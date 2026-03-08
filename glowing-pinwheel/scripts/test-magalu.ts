
import { getMagaluAffiliateLink } from '../src/lib/safe-links';

console.log('=== TESTE MAGALU AFFILIATE ===');

const input = 'https://www.magazineluiza.com.br/iphone-13/p/12345/te/ip13/';
const expected = 'https://www.magazinevoce.com.br/magazinecomparatop/iphone-13/p/12345/te/ip13/';

const result = getMagaluAffiliateLink(input);

console.log(`Entrada:  ${input}`);
console.log(`Saída:    ${result}`);
console.log(`Esperado: ${expected}`);

if (result === expected) {
    console.log('\n✅ SUCESSO: A URL foi transformada corretamente.');
} else {
    console.error('\n❌ FALHA: O resultado não bate com o esperado.');
}

// Teste Negativo (Outro domínio)
const invalidInput = 'https://www.google.com';
const resultInvalid = getMagaluAffiliateLink(invalidInput);
if (resultInvalid === invalidInput) {
    console.log('✅ SUCESSO: URL externa ignorada corretamente.');
}
