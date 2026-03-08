require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
    console.log('Listing all products...');

    const { data: products, error } = await supabase
        .from('products_tco')
        .select('id, product_name, category, tco_data')
        .limit(10);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`Found ${products.length} products.`);

    products.forEach(p => {
        const mlb = p.tco_data?.identifiers?.mlb_id || 'N/A';
        const social = p.tco_data?.affiliate_links?.mercadolivre || 'None';

        console.log(`\nID: ${p.id}`);
        console.log(`Name: ${p.product_name} [${p.category}]`);
        console.log(`MLB ID: ${mlb}`);
        console.log(`Current Link: ${social}`);
    });
}

run();
