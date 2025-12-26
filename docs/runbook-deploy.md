# ComparaTop - Runbook de Deploy

> **Versão:** 2.0.0  
> **Atualizado:** 2025-12-25

Guia completo para desenvolvimento local, build e deploy.

## Setup Local

### Pré-requisitos

- Node.js 18+ (LTS)
- npm 9+
- Git

### Instalação

```bash
# Clonar repositório
git clone https://github.com/adrianoapsant-cloud/comparatop-site.git
cd comparatop-site

# Instalar dependências
npm install
```

## Comandos

### Desenvolvimento

```bash
# Validar dados (roda automaticamente no build)
npm run validate

# Build (gera dist/)
npm run build

# Build completo (validate + build)
npm run build:full

# Servir localmente (porta 3000)
npm run serve

# Servir source (sem build, porta 3001)
npm run serve:dev
```

### Testes

```bash
# Smoke tests (verifica dist/)
npm run smoke-test

# Smoke tests em produção
npm run smoke-test:prod

# Verificar produção
npm run deploy:check
```

### Utilitários

```bash
# Gerar redirects nginx
npm run redirects

# Validar apenas schemas
npm run validate:schemas

# Validar apenas catálogos
npm run validate:catalog
```

## Fluxo de Deploy

### 1. Desenvolvimento Local

```bash
# Fazer alterações
vim data/catalogs/geladeira.json

# Validar
npm run validate

# Build local
npm run build

# Testar localmente
npm run serve
# Abrir http://localhost:3000
```

### 2. Commit

```bash
git add .
git commit -m "feat: adiciona novo produto XYZ"
```

### 3. Push (Dispara Deploy)

```bash
git push origin main
```

### 4. CI/CD Automático

O push dispara o GitHub Actions que:

1. ✅ `npm ci` - Instala deps
2. ✅ `npm run validate` - Valida schemas
3. ✅ `npm run build` - Gera dist/
4. ✅ `npm run smoke-test` - Testa build
5. ✅ Webhook Coolify - Dispara deploy

### 5. Coolify

Coolify recebe webhook e:

1. Faz `git pull`
2. Executa `npm run build`
3. Reinicia Nginx com novo dist/

### 6. Cloudflare

- CDN já está configurado
- Cache automático
- Para forçar atualização: Purge cache

## Verificação Pós-Deploy

### Automática (CI)

O smoke test verifica:

- [ ] Home retorna 200
- [ ] Produto retorna 200
- [ ] Categoria retorna 200
- [ ] 404 para rota inexistente
- [ ] Sitemap existe e contém URLs
- [ ] Canonical presente

### Manual

```bash
# Verificar home
curl -sSI https://comparatop.com.br/ | head -1
# HTTP/1.1 200 OK

# Verificar produto
curl -sSI https://comparatop.com.br/produto/geladeira/brm44hb/ | head -1
# HTTP/1.1 200 OK

# Verificar 404
curl -sSI https://comparatop.com.br/nao-existe/ | head -1
# HTTP/1.1 404 Not Found

# Verificar sitemap
curl -sS https://comparatop.com.br/sitemap.xml | head -5
# <?xml version="1.0"...

# Contar URLs no sitemap
curl -sS https://comparatop.com.br/sitemap.xml | grep -c "<url>"
```

## Rollback

### Opção 1: Git Revert

```bash
# Ver commits recentes
git log --oneline -5

# Reverter último commit
git revert HEAD
git push origin main
```

### Opção 2: Coolify Rollback

1. Acessar painel Coolify
2. Ir em Deployments
3. Clicar em deployment anterior
4. Clicar "Rollback"

## Troubleshooting

### Build falha localmente

```bash
# Limpar cache npm
npm cache clean --force

# Reinstalar deps
rm -rf node_modules
npm install

# Verificar versão Node
node --version  # Deve ser 18+
```

### Validação falha

```bash
# Ver erro detalhado
npm run validate 2>&1 | less

# Comum: tipo errado
# Erro: specs.capacidade_total deve ser number
# Fix: alterar "375" para 375 (sem aspas)
```

### Deploy não atualiza

1. **Verificar GitHub Actions:**
   - Repo → Actions → Ver último workflow
   - Checar se passou ou falhou

2. **Verificar Coolify:**
   - Painel → Projeto → Deployments
   - Ver se há deploy recente

3. **Purge cache Cloudflare:**
   - Dashboard → comparatop.com.br
   - Caching → Purge Everything

### 404 em página que deveria existir

```bash
# Verificar se página foi gerada
ls -la dist/produto/geladeira/brm44hb/

# Se não existe, verificar catálogo
cat data/catalogs/geladeira.json | jq '.products.brm44hb'
```

### Sitemap desatualizado

```bash
# Forçar rebuild
npm run build

# Verificar dist
cat dist/sitemap.xml | grep brm44hb
```

## Ambientes

| Ambiente | URL | Branch |
|----------|-----|--------|
| **Produção** | comparatop.com.br | main |
| **Local** | localhost:3000 | qualquer |

## Secrets

Secrets estão em:

- **GitHub:** Settings → Secrets → Actions
- **Coolify:** Variáveis de ambiente do projeto

| Secret | Uso |
|--------|-----|
| `COOLIFY_WEBHOOK_URL` | URL do webhook Coolify |

## Contatos

- **Problemas de deploy:** Verificar GitHub Actions
- **Problemas de DNS:** Cloudflare
- **Problemas de servidor:** Coolify/VPS
