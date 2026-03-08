require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
    console.log('Fetching Eufy to verify/update...');
    const { data: row, error: fetchError } = await supabase
        .from('products_tco')
        .select('*')
        .ilike('product_name', '%eufy%')
        .single();

    if (fetchError || !row) {
        console.error('Fetch Error or No Data:', fetchError);
        return;
    }

    // Prepare new TCO Data with identifiers
    const currentTcoData = row.tco_data || {};
    const newTcoData = {
        ...currentTcoData,
        identifiers: {
            ...currentTcoData.identifiers,
            mlb_id: 'MLB5923576478',
            // magalu_id: '...', // leaving null until confirmed
            asin: 'B0CPFBBHP4'
        }
    };

    console.log('Updating with new ASIN and identifiers...');
    const { error: updateError } = await supabase
        .from('products_tco')
        .update({
            asin: 'B0CPFBBHP4',   // Correct ASIN in top-level column
            tco_data: newTcoData  // Identifiers in JSONB
        })
        .eq('id', row.id);

    if (updateError) {
        console.error('Update Error:', updateError);
    } else {
        console.log('Update Success!');
        console.log('New identifiers:', newTcoData.identifiers);
    }
}

run();
