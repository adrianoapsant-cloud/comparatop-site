require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
    const ID = '10f877e3-adaf-4120-ad32-339dbe235eb1'; // Xiaomi X10
    const NEW_ASIN = 'B0BW4LVTTD';
    const NEW_URL = `https://www.amazon.com.br/dp/${NEW_ASIN}?tag=comparatop-20`;

    console.log(`Updating Xiaomi X10...`);
    console.log(`OLD ASIN: B0XXXXXXXXX`);
    console.log(`NEW ASIN: ${NEW_ASIN}`);

    // 1. Get current data to update nested tco_data
    const { data: current, error: fetchError } = await supabase
        .from('products_tco')
        .select('tco_data')
        .eq('id', ID)
        .single();

    if (fetchError) {
        console.error('Error fetching:', fetchError);
        return;
    }

    const tcoData = current.tco_data || {};

    // Update identifiers inside JSON
    if (!tcoData.identifiers) tcoData.identifiers = {};
    tcoData.identifiers.asin = NEW_ASIN;

    // Update acquisition URL inside JSON (just in case)
    if (!tcoData.acquisition) tcoData.acquisition = {};
    tcoData.acquisition.affiliateUrl = NEW_URL;

    // 2. Perform Update
    const { error: updateError } = await supabase
        .from('products_tco')
        .update({
            asin: NEW_ASIN,
            amazon_url: NEW_URL,
            tco_data: tcoData
        })
        .eq('id', ID);

    if (updateError) {
        console.error('Error updating:', updateError);
    } else {
        console.log('✅ Success! ASIN and URL updated.');
    }
}

run();
