/**
 * Test Script: Generate a sample review using Gemini 2.5 Flash
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
    console.error('❌ GOOGLE_AI_API_KEY not found in .env.local');
    process.exit(1);
}

console.log('🔑 API Key found:', API_KEY.substring(0, 10) + '...');

async function testGemini() {
    const genAI = new GoogleGenerativeAI(API_KEY!);

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
        },
    });

    const prompt = `Você é um analista de produtos. Analise esta TV e retorne APENAS um JSON válido (sem markdown, sem explicações):

PRODUTO: LG OLED C3 65"
MARCA: LG
PREÇO: R$ 7.999

Formato exato do JSON:
{"overall":8.5,"headline":"Título curto","pros":["ponto forte 1","ponto forte 2"],"cons":["ponto fraco 1"]}`;

    console.log('📤 Sending request to Gemini 2.5 Flash...');
    const startTime = Date.now();

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text().trim();

        const latency = Date.now() - startTime;

        console.log(`\n✅ Response received in ${latency}ms\n`);
        console.log('📊 Tokens used:', response.usageMetadata?.totalTokenCount);
        console.log('\n📝 Raw response:\n', text);

        // Clean markdown if present
        if (text.startsWith('```')) {
            text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        }

        // Parse JSON
        const json = JSON.parse(text);
        console.log('\n✅ Parsed JSON:\n', JSON.stringify(json, null, 2));

        console.log('\n🎉 Gemini 2.5 Flash is working!');
        console.log('💰 Cost per review: ~$0.00005');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testGemini();
