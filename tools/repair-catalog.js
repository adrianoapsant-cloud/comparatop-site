const fs = require('fs');
const path = require('path');

const catalogsDir = path.join(__dirname, '../data/catalogs');
const files = fs.readdirSync(catalogsDir).filter(f => f.endsWith('.json'));

for (const file of files) {
    const filePath = path.join(catalogsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    let updated = false;
    if (data.products) {
        for (const [key, product] of Object.entries(data.products)) {
            if (!product.status) {
                product.status = 'active';
                updated = true;
                console.log(`Updated status for ${product.id || key} in ${file}`);
            }

            // Cleanup quotes from names
            if (product.name && (product.name.startsWith('"') || product.name.endsWith('"'))) {
                product.name = product.name.replace(/^"|"$/g, '');
                updated = true;
                console.log(`Cleaned name for ${product.id || key} in ${file}`);
            }
        }
    }

    if (updated) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Saved updates to ${file}`);
    } else {
        console.log(`No changes needed for ${file}`);
    }
}
