require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// The CORRECT Eufy X10 Pro Omni Social Link provided by the user
const SOCIAL_LINK = "https://www.mercadolivre.com.br/social/aa20250829125621?matt_word=aa20250829125621&matt_tool=21144041&forceInApp=true&ref=BJaSaUG75nEUq7QUx9VfnxqGVTqjHM8S0nF4A4Hg5HGP%2BUZ9b9NWMrhkkCugMls53mKvQhj7yaALEWkBUaiJD5Gr3pucITIqYCHQYGur9IWUey23vicydSqfmY%2BtkQMBSdlUaEnaHYO%2FmmsosZvtt09s44vRIBs36%2BdGcYVFLIu6%2Fd%2B3toY0IFWWo2grAuy%2FR9cT%2BC95zddwuv80FD70qyLQV2%2FwLdE73pesP6sQ%2Fb16NcIr%2Fqt0AZGP%2FYd%2BYZ7bGngKLA4LnwNbmiGcQuZp381bzsW5WxKEvoh0eDmU6ueUpFczUjg3XMIi0KlRvX%2Fvytwb8TFkrC7twcDVVHVLBtUMHPg33ADAO285dymxgOCvE4Kmxq0Tmiv7VOM2MyPPiAtHIjMKYYiqEbXuAUxL4gWZs1JtVRblsJd%2Bw7TAX9%2Fn9eC2JE0A2w3Fus%2B2DLYZNm2ejx7HxOgje8awGXZE83m3lNHQtktm0XMwVt7fw5r97Ubg6cXF6AIeaU2wGUR3vPEo4lwJbkuRoGuV667A%2BbpTjE%2B%2Bj48dxcfa%2FNfQG9mYn%2BjLmlVnZoFodlg1o0CopA%3D%3D";

async function run() {
    console.log('Fetching Eufy product...');

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

    const tcoData = product.tco_data || {};
    if (!tcoData.affiliate_links) {
        tcoData.affiliate_links = {};
    }

    // Update with the correct link
    tcoData.affiliate_links.mercadolivre = SOCIAL_LINK;

    const { error: updateError } = await supabase
        .from('products_tco')
        .update({ tco_data: tcoData })
        .eq('id', product.id);

    if (updateError) {
        console.error('Error updating:', updateError);
    } else {
        console.log('Success! Correct Eufy Social link injected.');
    }
}

run();
