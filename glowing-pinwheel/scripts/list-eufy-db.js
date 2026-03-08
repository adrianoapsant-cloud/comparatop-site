require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
    console.log('Listing all Eufy products...');
    const { data, error } = await supabase
        .from('products_tco')
        .select('id, product_name, asin, tco_data')
        .ilike('product_name', '%eufy%');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Found:', data.length);
        data.forEach(p => {
            console.log(`ID: ${p.id} | Name: ${p.product_name} | ASIN (col): ${p.asin} | ASIN (json): ${p.tco_data?.identifiers?.asin}`);
        });
    }
}

run();
