# INSTRUÇÕES DE DEPLOY — comparatop.com.br

## Arquivos Modificados

### Corrigidos (prontos para deploy)
1. `dist/sitemap.xml` - Removida URL duplicada `/categoria/geladeira/`
2. `dist/_redirects` - **NOVO** - Redirect 301 de categoria
3. `sitemap.xml` (source) - Atualizado para URL canônica
4. `_redirects` (source) - **NOVO** - Backup do redirect

## Comandos de Deploy

### 1. Verificar mudanças
```bash
cd comparatop-site-git
git status
```

### 2. Adicionar arquivos
```bash
git add dist/sitemap.xml
git add dist/_redirects
git add sitemap.xml
git add _redirects
```

### 3. Commit
```bash
git commit -m "fix: corrige sitemap duplicado + adiciona redirect 301 categoria

- Remove /categoria/geladeira/ do sitemap (mantém apenas /geladeiras/)
- Adiciona redirect 301: /categoria/geladeira/ -> /geladeiras/
- Atualiza sitemap.xml source com URL canônica
- Total URLs no sitemap: 10 (antes: 11)
"
```

### 4. Push
```bash
git push origin main
```

### 5. Aguardar deploy automático
- Cloudflare Pages vai detectar o push
- Deploy leva ~1-2 minutos
- Verificar em: https://dash.cloudflare.com/

### 6. Purge cache Cloudflare
```bash
# Via dashboard:
# Cloudflare → Websites → comparatop.com.br → Caching → Purge Everything

# OU via curl (substitua {zone_id} e {api_token}):
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{"purge_everything":true}'
```

## Validação Pós-Deploy

### Aguardar 3-5 minutos, então testar:

#### 1. Verificar sitemap (deve ter 10 URLs)
```bash
curl -sS https://comparatop.com.br/sitemap.xml | grep -c "<url>"
# Esperado: 10
```

#### 2. Verificar sitemap NÃO tem /categoria/geladeira/
```bash
curl -sS https://comparatop.com.br/sitemap.xml | grep "categoria/geladeira"
# Esperado: (sem output)
```

#### 3. Verificar redirect 301
```bash
curl -sSI https://comparatop.com.br/categoria/geladeira/ | grep -E "HTTP|Location"
# Esperado: 
# HTTP/1.1 301 Moved Permanently
# Location: https://comparatop.com.br/geladeiras/
```

#### 4. Verificar URL canônica funciona
```bash
curl -sSI https://comparatop.com.br/geladeiras/ | grep "HTTP"
# Esperado: HTTP/1.1 200 OK
```

## Após Validação Bem-Sucedida

### Google Search Console
1. Acessar: https://search.google.com/search-console
2. Property: comparatop.com.br
3. Sitemaps → Add new sitemap
4. URL: `https://comparatop.com.br/sitemap.xml`
5. Submit

### Monitoramento
- Aguardar 3-7 dias para indexação
- Verificar "Coverage" em GSC
- Verificar "Sitemaps" status

## Troubleshooting

### Se redirect não funcionar:
1. Verificar se arquivo `dist/_redirects` foi deployado
2. Cloudflare Pages lê `_redirects` automaticamente
3. Formato correto: `/source /destination 301`

### Se sitemap ainda tiver 11 URLs:
1. Purge cache novamente
2. Verificar arquivo `dist/sitemap.xml` no repositório
3. Forçar redeploy: commit vazio + push

### Se cache persistir:
```bash
# Purge específico:
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{"files":["https://comparatop.com.br/sitemap.xml","https://comparatop.com.br/robots.txt"]}'
```

---

**Preparado em:** 2025-12-25 09:40 BRT
