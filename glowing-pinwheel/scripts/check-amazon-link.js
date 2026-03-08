const fetch = require('node-fetch');

async function check() {
    const asin = 'B0CPFBBHP4';
    const url = `https://www.amazon.com.br/dp/${asin}`;
    console.log(`Checking: ${url}`);
    try {
        const res = await fetch(url, { redirect: 'manual' });
        console.log(`Status: ${res.status}`);
        console.log(`Location: ${res.headers.get('location')}`);

        if (res.status === 301 || res.status === 302) {
            const redir = res.headers.get('location');
            console.log(`Follow redirect...`);
            const res2 = await fetch(redir);
            console.log(`Final Status: ${res2.status}`);
        }
    } catch (e) {
        console.error(e);
    }
}

check();
