/**
 * Script para inventariar valores únicos de atributos em ALL_PRODUCTS
 * Uso: npx tsx scripts/inventory-attributes.ts
 */

async function main() {
    const { ALL_PRODUCTS } = await import('../src/data/products');

    interface FieldInventory {
        field: string;
        values: Map<string, number>;
        sources: string[]; // "specs" | "attributes" | "technicalSpecs"
    }

    const inventory: Record<string, FieldInventory> = {};

    function addValue(category: string, field: string, value: unknown, source: string) {
        const key = `${category}:${field}`;
        if (!inventory[key]) {
            inventory[key] = { field, values: new Map(), sources: [] };
        }
        if (value !== undefined && value !== null) {
            const strVal = String(value);
            inventory[key].values.set(strVal, (inventory[key].values.get(strVal) || 0) + 1);
            if (!inventory[key].sources.includes(source)) {
                inventory[key].sources.push(source);
            }
        }
    }

    // Campos a inventariar por categoria
    const fieldsToCheck: Record<string, string[]> = {
        'robot-vacuum': ['navigationType', 'mopType', 'brushType', 'suctionPa', 'suctionPower', 'hasSelfEmpty', 'hasAutoEmpty'],
        'tv': ['panelType', 'resolution', 'refreshRate', 'hdmi21'],
        'fridge': ['doorType', 'hasFrostFree', 'hasInverter', 'energyClass', 'capacityLiters'],
        'air_conditioner': ['type', 'hasInverter', 'noiseDb', 'btus', 'energyClass', 'voltage'],
    };

    for (const product of ALL_PRODUCTS as any[]) {
        const categoryId = product.categoryId;
        const fields = fieldsToCheck[categoryId] || [];

        for (const field of fields) {
            // Check specs
            if (product.specs?.[field] !== undefined) {
                addValue(categoryId, field, product.specs[field], 'specs');
            }
            // Check attributes
            if (product.attributes?.[field] !== undefined) {
                addValue(categoryId, field, product.attributes[field], 'attributes');
            }
            // Check technicalSpecs
            if (product.technicalSpecs?.[field] !== undefined) {
                addValue(categoryId, field, product.technicalSpecs[field], 'technicalSpecs');
            }
        }
    }

    // Generate markdown report
    let md = `# Inventário de Valores de Atributos\n\n`;
    md += `**Gerado em:** ${new Date().toISOString()}\n\n`;

    const categories = [...new Set(Object.keys(inventory).map(k => k.split(':')[0]))];

    for (const cat of categories) {
        md += `## ${cat}\n\n`;
        md += `| Campo | Valores Únicos | Contagem | Fonte |\n`;
        md += `|-------|----------------|----------|-------|\n`;

        const catFields = Object.entries(inventory)
            .filter(([k]) => k.startsWith(`${cat}:`))
            .sort(([a], [b]) => a.localeCompare(b));

        for (const [key, inv] of catFields) {
            const field = key.split(':')[1];
            const valuesArr = [...inv.values.entries()]
                .map(([v, c]) => `\`${v}\` (${c})`)
                .join(', ');
            md += `| ${field} | ${valuesArr} | ${[...inv.values.values()].reduce((a, b) => a + b, 0)} | ${inv.sources.join(', ')} |\n`;
        }
        md += `\n`;
    }

    // Write report
    const fs = await import('fs');
    fs.writeFileSync('reports/attributes-values-inventory.md', md);
    console.log('Relatório gerado: reports/attributes-values-inventory.md');
    console.log('\n' + md);
}

main().catch(console.error);
