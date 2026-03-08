require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const SOCIAL_LINK = "https://www.mercadolivre.com.br/social/aa20250829125621?matt_word=aa20250829125621&matt_tool=21144041&forceInApp=true&ref=BKg39FNBG7T3YVTVOsip0l4CZ6%2BP9Il5GmxrbQM%2BpPftzZvqLFHlvw2kU4O0YVKsXGIV4iwyCIq0M%2FTFm51vz6Mr408XsdAI5jY0aIy0WjMLyHhk26qabRKhpmGlRZqDiLATv0x4RsxpmQlbIHGhqrpVggK3UGlmm1pdAKcEpCUsXWuBZunWvShQAD0KBEJB8uMf1w%3D%3D";

async function run() {
    console.log('Fetching Eufy product...');

    // 1. Get current data to preserve existing structure
    const { data: products, error: fetchError } = await supabase
        .from('products_tco')
        .select('*')
        .ilike('product_name', '%eufy%')
        .limit(1);

    if (fetchError || !products || products.length === 0) {
        console.error('Error fetching Eufy:', fetchError);
        return;
    }

    const product = products[0];
    console.log(`Found: ${product.product_name} (${product.id})`);

    // 2. Prepare update
    // We will store the social link in tco_data.affiliate_links.mercadolivre
    const tcoData = product.tco_data || {};

    if (!tcoData.affiliate_links) {
        tcoData.affiliate_links = {};
    }

    tcoData.affiliate_links.mercadolivre = SOCIAL_LINK;

    // 3. Update DB
    const { error: updateError } = await supabase
        .from('products_tco')
        .update({ tco_data: tcoData })
        .eq('id', product.id);

    if (updateError) {
        console.error('Error updating:', updateError);
    } else {
        console.log('Success! Social link injected.');
    }
}

run();
