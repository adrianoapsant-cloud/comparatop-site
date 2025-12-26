#!/usr/bin/env node
/**
 * ComparaTop - Schema Validator
 * 
 * Validates data files against JSON Schemas using Ajv.
 * 
 * Usage: node tools/validate-schemas.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SCHEMAS_DIR = path.join(__dirname, '..', 'schemas');
const CATALOGS_DIR = path.join(__dirname, '..', 'data', 'catalogs');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

let totalErrors = 0;
let totalWarnings = 0;

function log(type, message) {
    const prefix = {
        pass: `${colors.green}✅${colors.reset}`,
        fail: `${colors.red}❌${colors.reset}`,
        warn: `${colors.yellow}⚠️${colors.reset}`,
        info: `${colors.cyan}ℹ️${colors.reset}`
    };
    console.log(`${prefix[type] || ''} ${message}`);

    if (type === 'fail') totalErrors++;
    if (type === 'warn') totalWarnings++;
}

// Simple JSON Schema validator (without Ajv dependency)
// For production, install ajv: npm install ajv
function validateAgainstSchema(data, schema, dataPath = '') {
    const errors = [];

    // Check type
    if (schema.type) {
        const actualType = Array.isArray(data) ? 'array' : typeof data;
        if (schema.type !== actualType) {
            errors.push(`${dataPath}: esperado ${schema.type}, recebido ${actualType}`);
            return errors;
        }
    }

    // Check required fields
    if (schema.required && schema.type === 'object') {
        for (const field of schema.required) {
            if (data[field] === undefined) {
                errors.push(`${dataPath}.${field}: campo obrigatório ausente`);
            }
        }
    }

    // Check properties
    if (schema.properties && schema.type === 'object' && data) {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
            if (data[key] !== undefined) {
                const propErrors = validateAgainstSchema(
                    data[key],
                    propSchema,
                    `${dataPath}.${key}`
                );
                errors.push(...propErrors);
            }
        }
    }

    // Check array items
    if (schema.items && schema.type === 'array' && Array.isArray(data)) {
        data.forEach((item, idx) => {
            const itemErrors = validateAgainstSchema(
                item,
                schema.items,
                `${dataPath}[${idx}]`
            );
            errors.push(...itemErrors);
        });
    }

    // Check number constraints
    if (schema.type === 'number' || schema.type === 'integer') {
        if (schema.minimum !== undefined && data < schema.minimum) {
            errors.push(`${dataPath}: deve ser >= ${schema.minimum}, recebido ${data}`);
        }
        if (schema.maximum !== undefined && data > schema.maximum) {
            errors.push(`${dataPath}: deve ser <= ${schema.maximum}, recebido ${data}`);
        }
    }

    // Check string constraints
    if (schema.type === 'string' && typeof data === 'string') {
        if (schema.minLength !== undefined && data.length < schema.minLength) {
            errors.push(`${dataPath}: mínimo ${schema.minLength} caracteres`);
        }
        if (schema.maxLength !== undefined && data.length > schema.maxLength) {
            errors.push(`${dataPath}: máximo ${schema.maxLength} caracteres`);
        }
        if (schema.pattern && !new RegExp(schema.pattern).test(data)) {
            errors.push(`${dataPath}: não corresponde ao padrão ${schema.pattern}`);
        }
        if (schema.enum && !schema.enum.includes(data)) {
            errors.push(`${dataPath}: deve ser um de [${schema.enum.join(', ')}]`);
        }
    }

    return errors;
}

function loadSchema(schemaName) {
    const schemaPath = path.join(SCHEMAS_DIR, schemaName);
    try {
        const content = fs.readFileSync(schemaPath, 'utf-8');
        return JSON.parse(content);
    } catch (err) {
        log('fail', `Erro ao carregar schema ${schemaName}: ${err.message}`);
        return null;
    }
}

function validateCatalog(filename) {
    const filepath = path.join(CATALOGS_DIR, filename);

    console.log(`\n${colors.bold}=== Validando: ${filename} ===${colors.reset}`);

    let data;
    try {
        const content = fs.readFileSync(filepath, 'utf-8');
        data = JSON.parse(content);
    } catch (err) {
        log('fail', `Erro ao ler/parsear: ${err.message}`);
        return;
    }

    // Load product schema
    const productSchema = loadSchema('product.schema.json');
    if (!productSchema) return;

    // Validate category
    if (!data.category) {
        log('fail', 'category ausente');
    } else {
        log('pass', `category válido: ${data.category.name}`);
    }

    // Validate products
    if (!data.products || typeof data.products !== 'object') {
        log('fail', 'products ausente ou inválido');
        return;
    }

    const productIds = Object.keys(data.products);
    log('info', `${productIds.length} produto(s) encontrado(s)`);

    for (const [productId, product] of Object.entries(data.products)) {
        // Basic validation using schema
        const errors = validateAgainstSchema(product, productSchema, `products.${productId}`);

        // Additional custom validations
        if (product.id && product.id !== productId) {
            errors.push(`products.${productId}.id não confere com a chave: "${product.id}"`);
        }

        if (product.editorialScores?.overall !== undefined) {
            const score = product.editorialScores.overall;
            if (typeof score !== 'number' || score < 0 || score > 10) {
                errors.push(`products.${productId}.editorialScores.overall deve ser número entre 0-10`);
            }
        }

        if (product.offers && Array.isArray(product.offers)) {
            product.offers.forEach((offer, idx) => {
                if (typeof offer.price !== 'number' || offer.price <= 0) {
                    errors.push(`products.${productId}.offers[${idx}].price deve ser número > 0`);
                }
                const hasRetailer = offer.retailer || offer.retailerId || offer.retailerName || offer.store;
                if (!hasRetailer) {
                    errors.push(`products.${productId}.offers[${idx}] precisa de retailer`);
                }
            });
        }

        if (errors.length > 0) {
            errors.forEach(e => log('fail', e));
        } else {
            log('pass', `${productId}: ${product.name}`);
        }
    }
}

function main() {
    console.log(colors.bold + '\n🔍 ComparaTop - Validação de Schemas' + colors.reset);
    console.log(`Data: ${new Date().toISOString()}`);

    // Check if schemas exist
    if (!fs.existsSync(SCHEMAS_DIR)) {
        log('warn', 'Diretório schemas/ não encontrado, criando...');
        fs.mkdirSync(SCHEMAS_DIR, { recursive: true });
    }

    // Validate schemas are valid JSON
    console.log(`\n${colors.bold}=== Validando Schemas ===${colors.reset}`);
    const schemaFiles = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith('.json'));

    if (schemaFiles.length === 0) {
        log('warn', 'Nenhum schema encontrado em schemas/');
    } else {
        for (const file of schemaFiles) {
            try {
                const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), 'utf-8');
                JSON.parse(content);
                log('pass', `${file} é JSON válido`);
            } catch (err) {
                log('fail', `${file} não é JSON válido: ${err.message}`);
            }
        }
    }

    // Find and validate catalogs
    console.log(`\n${colors.bold}=== Validando Catálogos ===${colors.reset}`);

    let files;
    try {
        files = fs.readdirSync(CATALOGS_DIR).filter(f => f.endsWith('.json'));
    } catch (err) {
        log('fail', `Erro ao ler diretório: ${err.message}`);
        process.exit(1);
    }

    if (files.length === 0) {
        log('warn', 'Nenhum catálogo encontrado em data/catalogs/');
    } else {
        files.forEach(validateCatalog);
    }

    // Summary
    console.log('\n' + colors.bold + '=== RESUMO ===' + colors.reset);
    console.log(`Schemas: ${schemaFiles.length}`);
    console.log(`Catálogos: ${files.length}`);
    console.log(`Erros: ${totalErrors}`);
    console.log(`Avisos: ${totalWarnings}`);

    console.log('\n' + colors.bold + '=== VEREDITO ===' + colors.reset);
    if (totalErrors === 0) {
        console.log(colors.green + '🟢 APROVADO - Dados válidos!' + colors.reset);
        process.exit(0);
    } else {
        console.log(colors.red + `🔴 REPROVADO - ${totalErrors} erro(s)` + colors.reset);
        process.exit(1);
    }
}

main();
