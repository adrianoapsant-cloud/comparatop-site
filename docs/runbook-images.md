# ComparaTop - Runbook de Imagens

> **Versão:** 2.0.0  
> **Atualizado:** 2025-12-25  
> **Status:** Produção

Este documento descreve como configurar, sincronizar e servir imagens via Cloudflare R2.

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     FLUXO DE IMAGENS                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   assets/images/           rclone copy           R2 Bucket  │
│   (local)          ───────────────────►     (comparatop-    │
│                                              images)        │
│                                                  │          │
│                                                  ▼          │
│                                          Cloudflare CDN     │
│                                                  │          │
│                                                  ▼          │
│                                    img.comparatop.com.br    │
│                                          (público)          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Pré-requisitos

### 1. Conta Cloudflare com R2

Acesse: https://dash.cloudflare.com → R2

### 2. Instalar rclone (Windows)

**Opção A - Via Scoop (recomendado):**
```powershell
# Instalar Scoop (se não tiver)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Instalar rclone
scoop install rclone
```

**Opção B - Download direto:**
1. Baixe: https://rclone.org/downloads/
2. Extraia para `C:\rclone\`
3. Adicione ao PATH

**Verificar instalação:**
```cmd
rclone version
```

## Configuração do Cloudflare R2

### 1. Criar Bucket

1. Acesse: Cloudflare Dashboard → R2 → Create bucket
2. Nome: `comparatop-images`
3. Location: Auto ou São Paulo (se disponível)

### 2. Criar API Token

1. Acesse: R2 → Manage R2 API Tokens → Create API Token
2. Permissões: Object Read & Write
3. Bucket: `comparatop-images`
4. Salve:
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint** (formato: `<account_id>.r2.cloudflarestorage.com`)

### 3. Configurar Domínio Público

1. Acesse: R2 → `comparatop-images` → Settings → Public Access
2. Clique: "Connect a domain"
3. Domínio: `img.comparatop.com.br`
4. Aguarde propagação DNS (~5 min)

### 4. Configurar Cache (Opcional)

Em Transform Rules ou Page Rules, configure:
```
Match: img.comparatop.com.br/*
Cache-Control: public, max-age=31536000, immutable
```

## Configuração do rclone

### 1. Criar Remote

```cmd
rclone config
```

Siga o wizard:
```
n) New remote
name> comparatop-r2
Storage> s3
provider> Cloudflare
access_key_id> [sua access key]
secret_access_key> [sua secret key]
region> auto
endpoint> [account_id].r2.cloudflarestorage.com
```

### 2. Testar Conexão

```cmd
rclone lsd comparatop-r2:
```

Deve listar o bucket `comparatop-images`.

## Estrutura de Pastas

### Local (`assets/images/`)

```
assets/images/
├── products/
│   ├── geladeira/
│   │   ├── brm44hb/
│   │   │   ├── hero.webp       # 800x800, <100KB
│   │   │   ├── thumb.webp      # 200x200, <20KB
│   │   │   └── gallery/
│   │   │       ├── 01.webp
│   │   │       └── 02.webp
│   │   └── tf55/
│   │       ├── hero.webp
│   │       └── thumb.webp
│   └── ar-condicionado/
│       └── ...
├── categories/
│   ├── geladeira-banner.webp
│   └── ...
└── site/
    ├── logo.webp
    ├── og-default.webp
    └── placeholder.webp
```

### Referência no Produto

```json
{
  "id": "brm44hb",
  "imageKeys": {
    "hero": "products/geladeira/brm44hb/hero.webp",
    "thumb": "products/geladeira/brm44hb/thumb.webp",
    "gallery": [
      "products/geladeira/brm44hb/gallery/01.webp",
      "products/geladeira/brm44hb/gallery/02.webp"
    ]
  }
}
```

### URL Final

```
https://img.comparatop.com.br/products/geladeira/brm44hb/hero.webp
```

## Scripts de Sync

### images-copy.bat (Recomendado)

**Modo:** Incremental, apenas adiciona, NUNCA deleta.

```cmd
cd C:\Users\Adriano Antonio\Downloads\comparatop-site-git
scripts\images-copy.bat
```

**Quando usar:**
- Adicionou novas imagens
- Upload inicial
- Qualquer momento (é sempre seguro)

### images-sync-safe.bat

**Modo:** Sync completo com deleção CONTROLADA.

```cmd
# Primeiro: dry-run (simula, não faz nada)
scripts\images-sync-safe.bat

# Depois: execução real (com confirmação)
scripts\images-sync-safe.bat --execute
```

**Proteções:**
- `--dry-run`: Obrigatório simular antes
- `--max-delete 50`: Máximo 50 deleções por vez
- `--backup-dir`: Deletados vão para pasta trash com timestamp

**Quando usar:**
- Renomeou/removeu imagens locais
- Quer espelhar exatamente local → R2

## Requisitos de Imagem

| Tipo | Dimensões | Formato | Max Size | Exemplo |
|------|-----------|---------|----------|---------|
| Hero | 800×800 | WebP | 100KB | produto principal |
| Thumb | 200×200 | WebP | 20KB | cards, listagens |
| Gallery | 800×600 | WebP | 80KB | fotos adicionais |
| Banner | 1200×400 | WebP | 150KB | cabeçalho categoria |
| OG Image | 1200×630 | PNG/WebP | 200KB | compartilhamento |

### Conversão para WebP

```cmd
# Usando ImageMagick
magick input.jpg -resize 800x800 -quality 80 output.webp

# Usando cwebp (Google)
cwebp -q 80 input.png -o output.webp
```

## Integração no Site

### Variável de Ambiente

Defina `IMAGE_BASE_URL` no Coolify ou `.env`:

```
IMAGE_BASE_URL=https://img.comparatop.com.br
```

### Componente de Imagem (HTML)

```html
<img 
  src="https://img.comparatop.com.br/products/geladeira/brm44hb/thumb.webp"
  data-src="https://img.comparatop.com.br/products/geladeira/brm44hb/hero.webp"
  alt="Geladeira Brastemp BRM44HB Frost Free 375L"
  width="800"
  height="800"
  loading="lazy"
  decoding="async"
  onerror="this.src='/assets/placeholder.webp'"
/>
```

### CSS para CLS (Cumulative Layout Shift)

```css
img[loading="lazy"] {
  aspect-ratio: attr(width) / attr(height);
  background: #f0f0f0;
}
```

## Validação

### Verificar Imagem no R2

```cmd
rclone ls comparatop-r2:comparatop-images/products/geladeira/brm44hb/
```

### Verificar URL Pública

```cmd
curl -I https://img.comparatop.com.br/products/geladeira/brm44hb/hero.webp
```

Esperado:
```
HTTP/2 200
content-type: image/webp
cache-control: public, max-age=31536000
```

### Smoke Test

O smoke test verifica automaticamente que páginas de produto renderizam imagens do domínio correto:

```cmd
npm run smoke-test:prod
```

## Lifecycle/Limpeza

### Expirar Trash (Manual)

No Cloudflare Dashboard, configure Object Lifecycle:

1. R2 → `comparatop-images` → Settings → Lifecycle Rules
2. Adicione regra:
   - Prefix: `trash/`
   - Action: Delete after 30 days

### Limpeza Manual

```cmd
# Listar arquivos na trash
rclone ls comparatop-r2:comparatop-images-trash/

# Deletar trash de mais de 30 dias
rclone delete comparatop-r2:comparatop-images-trash/ --min-age 30d
```

## Troubleshooting

### "Access Denied"

1. Verifique Access Key e Secret Key
2. Verifique permissões do token (Object Read & Write)
3. Verifique bucket name

### "Bucket not found"

```cmd
# Listar buckets disponíveis
rclone lsd comparatop-r2:

# Criar bucket se não existir
rclone mkdir comparatop-r2:comparatop-images
```

### Imagem não aparece no site

1. Verifique se o domínio público está configurado
2. Verifique propagação DNS: `nslookup img.comparatop.com.br`
3. Verifique se a imagem existe no R2

### rclone muito lento

Aumente paralelismo:
```cmd
rclone copy ... --transfers 8 --checkers 16
```

## Checklist de Setup

- [ ] Bucket `comparatop-images` criado
- [ ] API Token gerado
- [ ] rclone instalado
- [ ] Remote `comparatop-r2` configurado
- [ ] Conexão testada (`rclone lsd`)
- [ ] Domínio `img.comparatop.com.br` conectado
- [ ] Cache headers configurados
- [ ] Primeira imagem enviada e acessível
- [ ] Variável `IMAGE_BASE_URL` definida no Coolify
