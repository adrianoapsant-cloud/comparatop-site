/**
 * Image Optimizer - Convert images to WebP format
 * 
 * Requires: sharp (npm install sharp)
 * 
 * Usage: node tools/optimize-images.js
 * 
 * This script will:
 * 1. Find all JPG/PNG images in assets/images/products
 * 2. Create WebP versions alongside originals
 * 3. Generate optimized thumbnails
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('⚠️  sharp module not installed.');
    console.log('   Run: npm install sharp');
    console.log('   Then run this script again.');
    process.exit(1);
}

const CONFIG = {
    inputDir: path.join(__dirname, '..', 'assets', 'images', 'products'),
    outputDir: path.join(__dirname, '..', 'dist', 'assets', 'images', 'products'),
    quality: 80,
    thumbnailWidth: 200
};

async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .webp({ quality: CONFIG.quality })
            .toFile(outputPath);
        return true;
    } catch (err) {
        console.error(`  ❌ Error converting ${inputPath}: ${err.message}`);
        return false;
    }
}

async function createThumbnail(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .resize(CONFIG.thumbnailWidth)
            .webp({ quality: CONFIG.quality })
            .toFile(outputPath);
        return true;
    } catch (err) {
        console.error(`  ❌ Error creating thumbnail ${inputPath}: ${err.message}`);
        return false;
    }
}

async function processDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let converted = 0;

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            converted += await processDirectory(fullPath);
        } else if (/\.(jpg|jpeg|png)$/i.test(file.name)) {
            const relativePath = path.relative(CONFIG.inputDir, fullPath);
            const outputDir = path.join(CONFIG.outputDir, path.dirname(relativePath));

            // Ensure output directory exists
            fs.mkdirSync(outputDir, { recursive: true });

            // WebP path (replace extension)
            const webpName = file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const webpPath = path.join(outputDir, webpName);

            // Thumbnail path
            const thumbName = file.name.replace(/\.(jpg|jpeg|png)$/i, '-thumb.webp');
            const thumbPath = path.join(outputDir, thumbName);

            console.log(`  Converting: ${relativePath}`);

            if (await convertToWebP(fullPath, webpPath)) {
                converted++;
            }

            // Also create thumbnail
            await createThumbnail(fullPath, thumbPath);
        }
    }

    return converted;
}

async function main() {
    console.log('🖼️  Image Optimizer - WebP Conversion\n');

    if (!fs.existsSync(CONFIG.inputDir)) {
        console.log(`❌ Input directory not found: ${CONFIG.inputDir}`);
        return;
    }

    console.log(`📁 Input: ${CONFIG.inputDir}`);
    console.log(`📁 Output: ${CONFIG.outputDir}`);
    console.log(`📊 Quality: ${CONFIG.quality}%\n`);

    const count = await processDirectory(CONFIG.inputDir);

    console.log(`\n✅ Converted ${count} images to WebP`);
}

main().catch(console.error);
