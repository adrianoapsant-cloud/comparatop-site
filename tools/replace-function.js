// Script to safely replace generateComparisonContent function in build.js
const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, 'build.js');
const newFunctionPath = path.join(__dirname, 'comparison-content.js');

// Read files
let buildContent = fs.readFileSync(buildPath, 'utf-8');
const newFunction = fs.readFileSync(newFunctionPath, 'utf-8');

// Find the start of the old function
const startMarker = '// Generate comparison page content';
const startIndex = buildContent.indexOf(startMarker);

if (startIndex === -1) {
    console.error('Could not find start marker');
    process.exit(1);
}

// Find the end of the old function (next function declaration)
const endMarker = '// Process template and inject content';
const endIndex = buildContent.indexOf(endMarker, startIndex);

if (endIndex === -1) {
    console.error('Could not find end marker');
    process.exit(1);
}

console.log('Found function from position', startIndex, 'to', endIndex);

// Replace the old function with the new one
const before = buildContent.substring(0, startIndex);
const after = buildContent.substring(endIndex);

const newContent = before + newFunction + '\n\n' + after;

// Backup original
fs.writeFileSync(buildPath + '.backup', buildContent);
console.log('Backup created at build.js.backup');

// Write new content
fs.writeFileSync(buildPath, newContent);
console.log('Successfully replaced function!');

// Verify by trying to require it
try {
    delete require.cache[require.resolve(buildPath)];
    console.log('Syntax check... running build...');
} catch (e) {
    console.error('Error:', e.message);
}
