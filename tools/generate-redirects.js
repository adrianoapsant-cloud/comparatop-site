#!/usr/bin/env node
/**
 * ComparaTop - Generate Redirects
 * 
 * Reads config/redirects.yml and generates Nginx config snippets.
 * 
 * Usage: node tools/generate-redirects.js
 * 
 * Output: dist/_nginx_redirects.conf
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    redirectsFile: path.join(__dirname, '..', 'config', 'redirects.yml'),
    outputFile: path.join(__dirname, '..', 'dist', '_nginx_redirects.conf'),
    distDir: path.join(__dirname, '..', 'dist')
};

// Colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

// Simple YAML parser (for our specific format)
function parseSimpleYaml(content) {
    const result = { redirects: [] };
    const lines = content.split('\n');

    let currentRedirect = null;
    let inRedirects = false;

    for (const line of lines) {
        const trimmed = line.trim();

        // Skip comments and empty lines
        if (trimmed.startsWith('#') || trimmed === '') continue;

        // Check for redirects section
        if (trimmed === 'redirects:') {
            inRedirects = true;
            continue;
        }

        // Check for patterns section (end redirects)
        if (trimmed === 'patterns:') {
            inRedirects = false;
            continue;
        }

        if (inRedirects) {
            // New redirect entry
            if (trimmed.startsWith('- from:')) {
                if (currentRedirect) {
                    result.redirects.push(currentRedirect);
                }
                currentRedirect = {
                    from: trimmed.replace('- from:', '').trim()
                };
            }
            // Properties of current redirect
            else if (currentRedirect) {
                if (trimmed.startsWith('to:')) {
                    currentRedirect.to = trimmed.replace('to:', '').trim();
                }
                else if (trimmed.startsWith('status:')) {
                    currentRedirect.status = parseInt(trimmed.replace('status:', '').trim());
                }
                else if (trimmed.startsWith('reason:')) {
                    currentRedirect.reason = trimmed.replace('reason:', '').trim().replace(/"/g, '');
                }
                else if (trimmed.startsWith('type:')) {
                    currentRedirect.type = trimmed.replace('type:', '').trim();
                }
            }
        }
    }

    // Don't forget the last one
    if (currentRedirect) {
        result.redirects.push(currentRedirect);
    }

    return result;
}

function generateNginxConfig(redirects) {
    let config = `# ==============================================
# ComparaTop - Auto-generated Redirects
# Generated: ${new Date().toISOString()}
# Source: config/redirects.yml
# ==============================================
# Include this file in your nginx.conf:
#   include /path/to/_nginx_redirects.conf;
# ==============================================

`;

    for (const redirect of redirects) {
        const status = redirect.status || 301;
        const from = redirect.from;
        const to = redirect.to;
        const type = redirect.type || 'exact'; // exact (default) or regex

        // Add reason as comment
        if (redirect.reason) {
            config += `# ${redirect.reason}\n`;
        }

        // Generate location block based on type
        if (type === 'regex') {
            config += `location ~ ${from} {
    return ${status} ${to};
}

`;
        } else {
            config += `location = ${from} {
    return ${status} ${to};
}

`;
        }
    }

    return config;
}

function main() {
    console.log(colors.bold + '\n🔄 ComparaTop - Generate Redirects' + colors.reset);
    console.log(`Data: ${new Date().toISOString()}`);

    // Check if redirects file exists
    if (!fs.existsSync(CONFIG.redirectsFile)) {
        console.log(`${colors.cyan}ℹ️${colors.reset} config/redirects.yml não encontrado, nada a fazer.`);
        process.exit(0);
    }

    // Read and parse YAML
    console.log(`\nLendo: ${CONFIG.redirectsFile}`);
    const yamlContent = fs.readFileSync(CONFIG.redirectsFile, 'utf-8');
    const parsed = parseSimpleYaml(yamlContent);

    console.log(`${colors.green}✅${colors.reset} ${parsed.redirects.length} redirect(s) encontrado(s)`);

    if (parsed.redirects.length === 0) {
        console.log(`${colors.cyan}ℹ️${colors.reset} Nenhum redirect definido.`);
        process.exit(0);
    }

    // List redirects
    console.log('\nRedirects:');
    for (const r of parsed.redirects) {
        console.log(`  ${r.from} → ${r.to} (${r.status || 301})`);
    }

    // Generate nginx config
    const nginxConfig = generateNginxConfig(parsed.redirects);

    // Ensure dist directory exists
    if (!fs.existsSync(CONFIG.distDir)) {
        fs.mkdirSync(CONFIG.distDir, { recursive: true });
    }

    // Write output
    fs.writeFileSync(CONFIG.outputFile, nginxConfig);
    console.log(`\n${colors.green}✅${colors.reset} Gerado: ${CONFIG.outputFile}`);

    // Instructions
    console.log(`
${colors.bold}Para usar no Nginx:${colors.reset}

1. Copie o arquivo para o servidor:
   scp dist/_nginx_redirects.conf user@server:/etc/nginx/conf.d/

2. Adicione no nginx.conf (dentro do server block):
   include /etc/nginx/conf.d/_nginx_redirects.conf;

3. Teste e recarregue:
   nginx -t && nginx -s reload

${colors.bold}Para Coolify (Nginx custom config):${colors.reset}

1. Copie o conteúdo do arquivo gerado
2. Cole no campo "Custom Nginx Configuration" do Coolify
3. Restart a aplicação
`);

    process.exit(0);
}

main();
