require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Configuration
const TRACKING_ID = 'aa20250829125621';

const ROBOTS = [
    {
        name: 'Xiaomi Robot Vacuum X10',
        id: '10f877e3-adaf-4120-ad32-339dbe235eb1',
        keyword: 'xiaomi-robot-vacuum-x10', // Safer than specific MLB ID
        action: 'UPDATE_FALLBACK'
    },
    {
        name: 'eufy X10 Pro Omni',
        id: 'd7a9e890-22c0-44f4-a72a-edeaf67263a3',
        keyword: 'eufy-x10-pro-omni',
        action: 'UPDATE_FALLBACK'
    }
];

async function run() {
    console.log('=== Updating Robot Vacuum Links ===\n');

    for (const robot of ROBOTS) {
        if (robot.action === 'UPDATE_FALLBACK') {
            // Safe Search Link: Keywords + Tracking
            const link = `https://lista.mercadolivre.com.br/${robot.keyword}#D[A:${robot.keyword}]&tracking_id=${TRACKING_ID}`;
            console.log(`[${robot.name}] Injecting Fallback Link:`);
            console.log(`  -> ${link}`);

            // Fetch current data to preserve other fields
            const { data: current } = await supabase.from('products_tco').select('tco_data').eq('id', robot.id).single();
            if (!current) {
                console.error(`  Error: Product not found!`);
                continue;
            }

            const tcoData = current.tco_data || {};

            // Ensure structure exists
            if (!tcoData.identifiers) tcoData.identifiers = {};
            if (!tcoData.affiliate_links) tcoData.affiliate_links = {};

            // Update fields
            // We use the keyword as a placeholder ID to indicate "Search Mode"
            tcoData.identifiers.mlb_id = robot.keyword;
            tcoData.affiliate_links.mercadolivre = link;

            const { error } = await supabase
                .from('products_tco')
                .update({ tco_data: tcoData })
                .eq('id', robot.id);

            if (error) console.error('  Error updating:', error);
            else console.log('  ✅ Success!');

        } else if (robot.action === 'CHECK_EXISTING') {
            const { data: current } = await supabase.from('products_tco').select('tco_data').eq('id', robot.id).single();
            const social = current?.tco_data?.affiliate_links?.mercadolivre;
            console.log(`[${robot.name}] Checking Status:`);
            if (social) {
                console.log(`  ✅ Has Link: ${social.substring(0, 50)}...`);
            } else {
                console.log(`  ⚠️ Warning: No link found!`);
            }
        }
        console.log('');
    }
}

run();
