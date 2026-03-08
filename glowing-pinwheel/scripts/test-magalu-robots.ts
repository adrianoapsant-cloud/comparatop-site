
import { generateMagaluLink } from '../src/lib/safe-links';

console.log('=== TESTE MAGALU FLEXÍVEL (ROBÔS) ===\n');

const testCases = [
    { type: 'Nome (Xiaomi)', input: 'Xiaomi Robot Vacuum X10' },
    { type: 'Nome (Eufy)', input: 'Eufy X10 Pro Omni' },
    { type: 'URL (Exemplo)', input: 'https://www.magazineluiza.com.br/robo-aspirador-liectroux-xr500/p/cj5d13460g/ep/rase/' },
    { type: 'Erro (ASIN)', input: 'B0CPFBBHP4' } // ASIN do Eufy na Amazon
];

testCases.forEach(test => {
    console.log(`[${test.type}]`);
    console.log(`Entrada: ${test.input}`);
    try {
        const result = generateMagaluLink(test.input);
        console.log(`Gerado:  ${result}`);
    } catch (error: any) {
        console.log(`Erro:    ${error.message}`);
    }
    console.log('---');
});
