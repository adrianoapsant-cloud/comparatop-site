#!/usr/bin/env node
/**
 * ComparaTop - Generate Category Redirects
 * 
 * Lê config/categories.yml e gera regras de redirect para Nginx.
 * 
 * Usage: node tools/generate-category-redirects.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
    categoriesFile: path.join(__dirname, '..', 'config', 'categories.yml'),
    outputDir: path.join(__dirname, '..', 'dist'),
    baseUrl: 'https://comparatop.com.br'
};

function parseYamlForRedirects(content) {
    const redirects = [];
    const lines = content.split('\n');

    let currentCategory = null;
    let currentCanonical = null;
    let inAliases = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detecta início de categoria (2 espaços + nome + :)
        if (/^  \w+:$/.test(line)) {
            currentCategory = line.trim().replace(':', '');
            currentCanonical = null;
            inAliases = false;
            continue;
        }

        // Detecta canonicalPath (4 espaços)
        if (/^\s{4}canonicalPath:/.test(line)) {
            currentCanonical = line.split(':')[1].trim();
            continue;
        }

        // Detecta início de aliases
        if (/^\s{4}aliases:\s*$/.test(line)) {
            inAliases = true;
            continue;
        }

        // Detecta fim de aliases (qualquer linha com 4 espaços que não é -)
        if (inAliases && /^\s{4}[^-\s]/.test(line)) {
            inAliases = false;
        }

        // Detecta item de alias (6 espaços + -)
        if (inAliases && /^\s{6}-/.test(line)) {
            const alias = line.replace(/^\s{6}-\s*/, '').trim();
            if (currentCanonical && alias) {
                redirects.push({
                    source: alias,
                    destination: currentCanonical,
                    category: currentCategory
                });
            }
        }
    }

    return redirects;
}

function generateNginxConf(redirects) {
    let conf = `# ==================================================
# ComparaTop - Category Redirects (Auto-generated)
# Generated: ${new Date().toISOString()}
# Source: config/categories.yml
# ==================================================

`;

    for (const r of redirects) {
        conf += `# ${r.category}\n`;
        conf += `location = ${r.source} {\n`;
        conf += `    return 301 ${r.destination};\n`;
        conf += `}\n\n`;
    }

    return conf;
}

function main() {
    console.log('\n\x1b[1m🔄 ComparaTop - Generate Category Redirects\x1b[0m');
    console.log(`Data: ${new Date().toISOString()}\n`);

    try {
        const content = fs.readFileSync(CONFIG.categoriesFile, 'utf8');
        const redirects = parseYamlForRedirects(content);

        console.log(`\x1b[32m✅\x1b[0m ${redirects.length} redirect(s) encontrado(s)\n`);

        // Gera Nginx conf
        const nginxConf = generateNginxConf(redirects);
        const nginxPath = path.join(CONFIG.outputDir, '_category_redirects.conf');
        fs.writeFileSync(nginxPath, nginxConf);
        console.log(`\x1b[32m✅\x1b[0m Gerado: ${nginxPath}`);

        // Lista redirects
        console.log('\n\x1b[1mRedirects:\x1b[0m');
        for (const r of redirects) {
            console.log(`  ${r.source} → ${r.destination} (301)`);
        }

        console.log('\n\x1b[1mPara migrar de Page Rules para Redirect Rules:\x1b[0m');
        console.log('1. Cloudflare Dashboard > Rules > Redirect Rules');
        console.log('2. Create Rule > Single Redirect');
        console.log('3. Custom filter expression:');
        console.log('   (http.request.uri.path matches "^/categoria/geladeira/?$")');
        console.log('4. URL redirect: Static > /geladeiras/');
        console.log('5. Status code: 301');
        console.log('6. Delete Page Rules antigos\n');

    } catch (err) {
        console.error(`\x1b[31m❌\x1b[0m Erro: ${err.message}`);
        process.exit(1);
    }
}

main();
