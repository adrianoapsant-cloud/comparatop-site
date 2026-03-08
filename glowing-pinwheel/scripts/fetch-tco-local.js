async function check() {
    try {
        console.log('Fetching from local API...');
        const res = await fetch('http://localhost:3000/api/tco/lookup?q=eufy');
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

check();
