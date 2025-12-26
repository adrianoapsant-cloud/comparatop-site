# PEDIDO DE AJUDA - Redirect 301 não funciona no Coolify/Nginx

**Data:** 2025-12-25 10:16 BRT  
**Site:** comparatop.com.br  
**Ambiente:** Coolify (Docker) + Nginx + Cloudflare (DNS/CDN)

---

## 🎯 OBJETIVO

Configurar redirect 301 de `/categoria/geladeira/` para `/geladeiras/` no Coolify.

---

## ✅ O QUE JÁ FUNCIONA

1. **Sitemap corrigido:** 9 URLs (antes tinha 11 com duplicação)
   ```bash
   curl -sS https://comparatop.com.br/sitemap.xml | grep -c "<url>"
   # Resultado: 9 ✅
   ```

2. **Deploy automático:** Webhook GitHub → Coolify configurado ✅

3. **robots.txt:** Correto (sem Cloudflare Managed, políticas de IA OK) ✅

---

## ❌ PROBLEMA: Redirect 301 não funciona

### Comando de teste:
```bash
curl -sSI https://comparatop.com.br/categoria/geladeira/ | grep "Location"
```

**Resultado atual:** (vazio - sem redirect)

**Esperado:** `Location: https://comparatop.com.br/geladeiras/`

---

## 🔧 O QUE JÁ TENTAMOS

### 1. Arquivo `_redirects` (formato Netlify/Cloudflare Pages)

Criamos arquivos:
- `dist/_redirects`
- `_redirects` (source)

Conteúdo:
```
/categoria/geladeira/ /geladeiras/ 301
```

**Resultado:** ❌ Não funcionou (Coolify usa Nginx, não reconhece `_redirects`)

---

### 2. Custom Nginx Configuration no Coolify

**Localização no Coolify:**
- Projeto: `adrianoapsant-cloud/comparatop-site-main-ic8g4484Bc040Ocswi4owh004`
- Aba: **Configuration**
- Campo: **Custom Nginx Configuration**

**Configuração adicionada:**
```nginx
# Redirect categoria para URL canônica
location = /categoria/geladeira/ {
    return 301 https://comparatop.com.br/geladeiras/;
}
```

**Ações tomadas:**
1. Adicionado código na caixa "Custom Nginx Configuration"
2. Clicado em **Save** (se disponível)
3. Clicado em **Restart** (botão vermelho)
4. Deploy completado com sucesso: "Deployment is Finished", "Rolling update completed"

**Resultado:** ❌ Redirect ainda não funciona

---

## 🏗️ ARQUITETURA ATUAL

```
GitHub (git push)
    ↓
Coolify (deploy automático via webhook)
    ↓
Docker Container (Nginx serve dist/)
    ↓
Cloudflare (DNS + CDN)
    ↓
comparatop.com.br
```

---

## 🔍 INFORMAÇÕES DO AMBIENTE

### Coolify
- Versão: v4.0.0-beta.425
- URL: https://painel.petconfirmado.com.br
- Tipo de aplicação: Static (nginx:alpine)
- Build Pack: Nixpacks

### Nginx
- Imagem: `nginx:alpine`
- Configuração: Custom Nginx Configuration (campo de texto na UI)

### Cloudflare
- Status: Ativo (proxy orange cloud)
- Cache: Purgado após deploy
- Modo: Full (Strict)

---

## 📊 VALIDAÇÕES REALIZADAS

### 1. Sitemap (✅ Funciona)
```bash
$ curl -sS https://comparatop.com.br/sitemap.xml | grep -c "<url>"
9
```

### 2. URL de destino existe (✅ Funciona)
```bash
$ curl -sSI https://comparatop.com.br/geladeiras/
HTTP/1.1 200 OK
Content-Type: text/html
Server: cloudflare
```

### 3. URL de origem retorna 200 (❌ Deveria ser 301)
```bash
$ curl -sSI https://comparatop.com.br/categoria/geladeira/
HTTP/1.1 200 OK
Content-Type: text/html
Server: cloudflare
(sem header "Location")
```

---

## ❓ PERGUNTAS

1. **A configuração Nginx customizada no Coolify está sendo aplicada corretamente?**
   - Como verificar se o Nginx realmente carregou a config?
   - Existe algum log do Nginx no Coolify para verificar?

2. **O formato da configuração está correto para Nginx estático no Coolify?**
   - Precisa de algum contexto adicional (server block, etc)?
   - A sintaxe `location = /categoria/geladeira/` está correta?

3. **Pode ser cache do Cloudflare impedindo o redirect?**
   - Já fizemos purge, mas pode ter algo mais?
   - Precisa configurar Page Rules no Cloudflare?

4. **Existe outra forma de configurar redirects no Coolify?**
   - Via variáveis de ambiente?
   - Via arquivo de configuração no repositório?
   - Via regras do Cloudflare ao invés do Nginx?

---

## 🎯 SOLUÇÃO ESPERADA

Quando acessar `https://comparatop.com.br/categoria/geladeira/`, deve retornar:

```http
HTTP/1.1 301 Moved Permanently
Location: https://comparatop.com.br/geladeiras/
Server: cloudflare
```

---

## 📁 ARQUIVOS DO PROJETO

### Estrutura:
```
comparatop-site-git/
├── dist/
│   ├── sitemap.xml (✅ corrigido - 9 URLs)
│   ├── _redirects (criado, mas não usado pelo Nginx)
│   ├── index.html
│   └── ... (outros arquivos estáticos)
├── sitemap.xml (source)
├── _redirects (source)
└── ... 
```

### Git:
- Repositório: `https://github.com/adrianoapsant-cloud/comparatop-site.git`
- Branch: `main`
- Último commit: `2fd0d79` - "fix: corrige sitemap duplicado + adiciona redirect 301"

---

## 💡 SUGESTÕES DE INVESTIGAÇÃO

1. **Verificar logs do Nginx no Coolify:**
   - Onde encontrar logs no painel?
   - Como confirmar que a configuração customizada foi aplicada?

2. **Testar configuração Nginx alternativa:**
   - Talvez precise do bloco `server {}` completo?
   - Ou usar `rewrite` ao invés de `location`?

3. **Verificar se Cloudflare está interferindo:**
   - Desabilitar proxy temporariamente (grey cloud)?
   - Criar Page Rule específica?

4. **Alternativa: Configurar redirect no Cloudflare:**
   - Redirect Rules no dashboard
   - Bulk Redirects
   - Page Rules

---

## ⏰ PRIORIDADE

**CRÍTICO** - Blocking Google Search Console submission

Precisamos do redirect 301 funcionando para:
1. Evitar conteúdo duplicado (2 URLs servindo mesmo conteúdo)
2. Submeter sitemap limpo no GSC
3. Consolidar autoridade na URL canônica `/geladeiras/`

---

## 📞 CONTATO

Se precisar de mais informações:
- Screenshots do Coolify disponíveis
- Acesso aos logs se necessário
- Configurações do Cloudflare podem ser compartilhadas

---

**Aguardando orientação sobre como fazer o redirect 301 funcionar no ambiente Coolify + Nginx + Cloudflare.**

Obrigado!
