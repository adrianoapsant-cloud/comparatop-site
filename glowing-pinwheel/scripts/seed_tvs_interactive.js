#!/usr/bin/env node
/**
 * Script Interativo para Seed de TVs - ComparaTop
 * Processa TVs já obtidas e permite inserção de links de afiliado
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const RAW_DATA_FILE = path.join(__dirname, 'tvs_raw_data.json');
const OUTPUT_FILE = path.join(__dirname, 'tvs_seed.json');

// Função para criar slug SEO-friendly
function slugify(text) {
    if (!text) return '';
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Extrair informações do título
function extractFromTitle(title) {
    const result = { brand: null, size: null, resolution: null, model: null };
    const titleLower = title.toLowerCase();

    // Marcas
    const brands = ['samsung', 'lg', 'philco', 'aoc', 'philips', 'tcl', 'toshiba', 'sony', 'panasonic'];
    for (const brand of brands) {
        if (titleLower.includes(brand)) {
            result.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
            break;
        }
    }

    // Tamanho (ex: 32, 40, 43, 50, 55, 58, 65)
    const sizeMatch = title.match(/(\d{2})\s*("|polegadas|pol)?/i);
    if (sizeMatch) {
        result.size = sizeMatch[1] + ' Polegadas';
    }

    // Resolução
    if (titleLower.includes('4k') || titleLower.includes('uhd')) {
        result.resolution = '4K UHD';
    } else if (titleLower.includes('full hd') || titleLower.includes('fhd')) {
        result.resolution = 'Full HD';
    } else if (titleLower.includes('hd')) {
        result.resolution = 'HD';
    }

    // Modelo (códigos alfanuméricos)
    const modelMatch = title.match(/([A-Z0-9]{2,}[A-Z0-9\-\/]+)/i);
    if (modelMatch && modelMatch[1].length > 3) {
        result.model = modelMatch[1].toUpperCase();
    }

    return result;
}

// Converter thumbnail para imagem HD
function getHDImageUrl(thumbnailUrl) {
    if (!thumbnailUrl) return null;
    return thumbnailUrl
        .replace(/-I\.jpg$/, '-O.webp')
        .replace(/-I\.webp$/, '-O.webp')
        .replace(/D_Q_NP_2X_/, 'D_NQ_NP_')
        .replace(/-AB\.webp$/, '-F.webp');
}

// Gerar Alt Text SEO
function generateSeoAltText(title, brand, size, resolution, model) {
    let parts = ['Smart TV'];
    if (brand) parts.push(brand);
    if (size) parts.push(size);
    if (resolution) parts.push(resolution);
    if (model) parts.push(`Modelo ${model}`);

    if (parts.length < 4) {
        return title.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    return parts.join(' ');
}

// Gerar filename SEO
function generateSeoFilename(brand, size, resolution, model, itemId) {
    let parts = ['smart-tv'];
    if (brand) parts.push(slugify(brand));
    if (size) parts.push(size.replace(/[^\d]/g, ''));
    if (resolution) parts.push(slugify(resolution));
    if (model) parts.push(slugify(model));
    else parts.push(itemId.toLowerCase());

    return parts.join('-') + '.webp';
}

// Processar um item
function processItem(item, index) {
    const extracted = extractFromTitle(item.title);

    const seoAltText = generateSeoAltText(item.title, extracted.brand, extracted.size, extracted.resolution, extracted.model);
    const seoFilename = generateSeoFilename(extracted.brand, extracted.size, extracted.resolution, extracted.model, item.id);
    const hdImageUrl = getHDImageUrl(item.thumbnail);

    return {
        position: index + 1,
        ml_id: item.id,
        title: item.title,
        price: item.price,
        currency: 'BRL',
        rank: item.rank,

        // Atributos extraídos
        brand: extracted.brand,
        display_size: extracted.size,
        resolution: extracted.resolution,
        model: extracted.model,

        // Imagens
        original_thumbnail: item.thumbnail,
        hd_image_url: hdImageUrl,

        // SEO
        seo_image_alt: seoAltText,
        seo_filename: seoFilename,

        // Links
        ml_permalink: item.permalink,
        affiliate_link: null,

        // Metadata
        fetched_at: new Date().toISOString()
    };
}

// Interface readline
function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

// Pergunta assíncrona
function question(rl, prompt) {
    return new Promise(resolve => {
        rl.question(prompt, answer => {
            resolve(answer);
        });
    });
}

// Carregar dados existentes de seed
function loadExistingData() {
    try {
        if (fs.existsSync(OUTPUT_FILE)) {
            const data = fs.readFileSync(OUTPUT_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.log('Iniciando novo arquivo de seed...');
    }
    return [];
}

// Salvar dados
function saveData(data) {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Formatar preço
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

// Main
async function main() {
    console.log('═'.repeat(80));
    console.log('📺 ComparaTop - Seed Interativo de TVs');
    console.log('═'.repeat(80));
    console.log();

    // Carregar dados raw
    if (!fs.existsSync(RAW_DATA_FILE)) {
        console.error('❌ Arquivo tvs_raw_data.json não encontrado!');
        process.exit(1);
    }

    const rawData = JSON.parse(fs.readFileSync(RAW_DATA_FILE, 'utf8'));
    console.log(`✅ ${rawData.length} TVs carregadas!\n`);

    // Processar todos os itens
    const processedItems = rawData.map((item, index) => processItem(item, index));

    // Carregar dados existentes
    const existingData = loadExistingData();
    const existingIds = new Set(existingData.map(d => d.ml_id));

    // Interface interativa
    const rl = createInterface();
    const finalData = [...existingData];

    for (const item of processedItems) {
        // Pular se já existe
        if (existingIds.has(item.ml_id)) {
            console.log(`⏭️  Produto #${item.position} (${item.ml_id}) já existe, pulando...\n`);
            continue;
        }

        console.clear();
        console.log('═'.repeat(80));
        console.log(`📺 TV #${item.position} de ${processedItems.length}  |  ${item.rank || ''}`);
        console.log('═'.repeat(80));
        console.log();
        console.log(`📌 TÍTULO: ${item.title}`);
        console.log(`💰 PREÇO: ${formatPrice(item.price)}`);
        console.log();
        console.log('─'.repeat(80));
        console.log('🏷️  ATRIBUTOS EXTRAÍDOS:');
        console.log(`   • Marca: ${item.brand || 'N/A'}`);
        console.log(`   • Tamanho: ${item.display_size || 'N/A'}`);
        console.log(`   • Resolução: ${item.resolution || 'N/A'}`);
        console.log(`   • Modelo: ${item.model || 'N/A'}`);
        console.log();
        console.log('─'.repeat(80));
        console.log('🔎 SEO GERADO:');
        console.log(`   • Alt Text: "${item.seo_image_alt}"`);
        console.log(`   • Filename: ${item.seo_filename}`);
        console.log(`   • Imagem HD: ${item.hd_image_url}`);
        console.log();
        console.log('─'.repeat(80));
        console.log(`🔗 LINK ORIGINAL ML: ${item.ml_permalink}`);
        console.log('─'.repeat(80));
        console.log();

        const affiliateLink = await question(rl, '👉 Cole seu LINK DE AFILIADO para este produto (ou "skip"/"exit"): ');

        if (affiliateLink.toLowerCase() === 'skip') {
            console.log('\n⏭️  Pulando este produto...\n');
            continue;
        }

        if (affiliateLink.toLowerCase() === 'exit' || affiliateLink.toLowerCase() === 'sair') {
            console.log('\n👋 Encerrando. Dados salvos!\n');
            break;
        }

        // Salvar com link de afiliado
        item.affiliate_link = affiliateLink.trim();
        finalData.push(item);
        existingIds.add(item.ml_id);
        saveData(finalData);

        console.log(`\n✅ TV #${item.position} salva com sucesso!`);
        console.log(`📁 Total no arquivo: ${finalData.length} TVs\n`);

        await question(rl, 'Pressione ENTER para continuar...');
    }

    rl.close();

    console.log('\n' + '═'.repeat(80));
    console.log('🎉 PROCESSO CONCLUÍDO!');
    console.log(`📊 Total de TVs no arquivo: ${finalData.length}`);
    console.log(`📁 Arquivo: ${OUTPUT_FILE}`);
    console.log('═'.repeat(80) + '\n');
}

main().catch(console.error);
