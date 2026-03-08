require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
    const ID = '10f877e3-adaf-4120-ad32-339dbe235eb1'; // Xiaomi X10

    const { data, error } = await supabase
        .from('products_tco')
        .select('id, product_name, asin, amazon_url, tco_data')
        .eq('id', ID)
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Xiaomi Data:');
    console.log(`ASIN (col): ${data.asin}`);
    console.log(`Amazon URL (col): ${data.amazon_url}`);
    console.log(`ASIN (tco_data): ${data.tco_data?.identifiers?.asin}`);
    console.log(`Affiliate URL (tco_data): ${data.tco_data?.acquisition?.affiliateUrl}`);
}

run();
