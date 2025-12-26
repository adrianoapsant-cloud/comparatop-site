# Configuração Cloudflare — Guia para SEO & IAs

## Problema Identificado

O Cloudflare está injetando um bloco "Managed" no início do `robots.txt`, sobrescrevendo nossa configuração customizada.

## Solução: Desabilitar AI Scrapers no Cloudflare

1. Acesse o dashboard do Cloudflare
2. Selecione o domínio `comparatop.com.br`
3. Vá em **Security > Bots**
4. Na seção "**AI Scrapers and Crawlers**":
   - **Desabilite** a opção "Block AI Scrapers and Crawlers"
   - OU configure manualmente quais bots permitir/bloquear

5. Na seção "**Managed robots.txt**":
   - **Desabilite** para permitir que nosso `robots.txt` seja servido sem modificações

## Política de robots.txt Recomendada

```
# PERMITIR (citação/busca):
- Googlebot, Bingbot (busca tradicional)
- OAI-SearchBot (ChatGPT Search)
- PerplexityBot (Perplexity AI)
- ClaudeBot (Claude)

# BLOQUEAR (treinamento):
- GPTBot (treino OpenAI)
- Google-Extended (treino Gemini)
- CCBot (Common Crawl)
- Bytespider (ByteDance)
```

## Purge de Cache (Após Deploy)

Após cada deploy, execute o purge de cache:

1. Dashboard Cloudflare > Caching > Purge Cache
2. Selecione "**Custom Purge**"
3. Adicione URLs:
   - `https://comparatop.com.br/`
   - `https://comparatop.com.br/robots.txt`
   - `https://comparatop.com.br/sitemap.xml`
   - `https://comparatop.com.br/geladeiras/`
   - `https://comparatop.com.br/categoria/geladeira/`
   - `https://comparatop.com.br/comparar/brm44hb-vs-tf55/`

Ou use a API:
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```

## Cache de HTML

Configure Page Rules ou Cache Rules para HTML:

```
URL: comparatop.com.br/*
Browser Cache TTL: Bypass
Edge Cache TTL: 10 minutes (ou Bypass)
```

Isso garante que alterações no HTML sejam refletidas rapidamente.

## Verificação

Após ajustes, verifique:

```bash
# Deve retornar SEU robots.txt, sem bloco Cloudflare
curl https://comparatop.com.br/robots.txt

# Deve retornar o build fingerprint atual
curl https://comparatop.com.br/build.txt
```
