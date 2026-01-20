/**
 * List available Gemini models
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.GOOGLE_AI_API_KEY;

async function listModels() {
    console.log('📋 Listing available models...\n');

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );

    const data = await response.json();

    if (data.models) {
        console.log('Available models:\n');
        data.models.forEach((model: any) => {
            if (model.supportedGenerationMethods?.includes('generateContent')) {
                console.log(`✅ ${model.name}`);
                console.log(`   Display: ${model.displayName}`);
                console.log(`   Input: ${model.inputTokenLimit} tokens`);
                console.log('');
            }
        });
    } else {
        console.log('Error:', data);
    }
}

listModels();
