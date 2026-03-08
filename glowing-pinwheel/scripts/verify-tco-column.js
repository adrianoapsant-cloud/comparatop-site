require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
    console.log('Verifying tco_data column...');
    const { data, error } = await supabase
        .from('products_tco')
        .select('product_name, tco_data') // Select explicitly
        .ilike('product_name', '%eufy%');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Data:', JSON.stringify(data, null, 2));
    }
}

run();
