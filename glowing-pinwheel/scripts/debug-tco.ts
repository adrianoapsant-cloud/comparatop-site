
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('--- Debugging TCO Search ---');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    console.log('\n1. Checking specific Eufy product...');
    const { data: eufy, error: eufyError } = await supabase
        .from('products_tco')
        .select('*')
        .ilike('product_name', '%eufy%');

    if (eufyError) {
        console.error('Error querying Eufy:', eufyError);
    } else {
        console.log(`Found ${eufy.length} Eufy products:`);
        eufy.forEach(p => console.log(` - ${p.product_name} (ID: ${p.id}, Active: ${p.is_active})`));
    }

    console.log('\n2. Listing all products to verify table access...');
    const { data: all, error: allError } = await supabase
        .from('products_tco')
        .select('id, product_name, is_active')
        .limit(5);

    if (allError) {
        console.error('Error querying table:', allError);
        if (allError.code === '42501') {
            console.error('RLS POLICY VIOLATION: Anon key cannot read this table.');
        }
    } else {
        console.log(`Table query successful. Returned ${all.length} rows.`);
        all.forEach(p => console.log(` - ${p.product_name}`));
    }
}

run();
