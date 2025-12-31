# ComparaTop - Contexto do Projeto

## 📍 Localização dos Arquivos
```
C:\Users\Adriano Antonio\Desktop\backup\
├── template.html          # Template principal do site
├── tools/                 # Scripts de build e geração
│   ├── build.js           # ⭐ Script principal de build estático
│   ├── minify.js          # Minificação CSS/JS
│   ├── generate-og-images.js      # Gerador de OG images
│   ├── generate-infographics.js   # Gerador de infográficos comparativos
│   ├── optimize-images.js         # Conversão WebP
│   └── image_seo_optimizer.py     # Otimizador de nomes/alt de imagens
├── data/catalogs/
│   └── geladeira.json     # Dados de produtos (fonte principal)
├── js/
│   └── main.js            # JavaScript principal
├── css/
│   └── main.css           # Estilos principais
├── dist/                  # Arquivos gerados (deploy)
└── .agent/workflows/      # Workflows documentados
```

## 🔧 Ferramentas e Infraestrutura

### Deploy
- **Plataforma**: Netlify
- **URL Produção**: https://majestic-biscuit-69e50b.netlify.app/
- **Deploy**: Automático via GitHub push
- **Repo**: https://github.com/adrianoapsant-cloud/comparatop-site.git

### Build
```bash
cd "C:\Users\Adriano Antonio\Desktop\backup"
node tools/build.js              # Gera páginas estáticas
node tools/minify.js             # Minifica CSS/JS
node tools/generate-og-images.js # Gera imagens OG
node tools/generate-infographics.js # Gera infográficos
```

### Deploy completo
```bash
node tools/build.js; node tools/minify.js; node tools/generate-og-images.js; node tools/generate-infographics.js; git add -A; git commit -m "mensagem"; git push origin main
```

## ✅ Funcionalidades Implementadas

### Imagens e SEO
- [x] Nomes de arquivo SEO-friendly
- [x] Alt texts descritivos
- [x] Google Images Sitemap
- [x] Schema.org ImageObject arrays
- [x] Lazy loading em todas imagens

### Feeds de Produtos  
- [x] Pinterest Feed (TSV): `/pinterest-feed.tsv`
- [x] Google Shopping Feed (XML): `/google-shopping-feed.xml`
- [x] Facebook Catalog (TSV): `/facebook-catalog.tsv`
- [x] Bing Shopping Feed (TXT): `/bing-shopping-feed.txt`

### Schema SEO
- [x] Product Schema
- [x] BreadcrumbList Schema
- [x] FAQPage Schema (5 perguntas por categoria)
- [x] HowTo Schema (função pronta para uso)
- [x] Review/Rating Schema

### Infográficos Automáticos
- [x] Gerador de infográficos A vs B
- [x] Gerador de OG images (1200x630)
- Formato: SVG (PNG requer `npm install sharp`)

## 🚧 Próximos Passos

### Engagement (Em discussão)
- [ ] Newsletter popup inteligente (exit-intent + delay + copy persuasivo)
- [x] WhatsApp removido (recomendação: não faz sentido para comparador)

### Performance (Fase C)
- [ ] Core Web Vitals otimização
- [ ] PWA (instalar como app)

### Conteúdo (Fase D)
- [ ] Google Web Stories
- [ ] Blog/Artigos SEO
- [ ] Ads (usar feeds já criados)

## 📋 Decisões de UX Importantes

### Por que NÃO ter WhatsApp
1. Usuários confundem comparador com loja
2. Receberá mensagens de suporte que não pode resolver
3. Custo operacional alto vs. retorno baixo
4. Site de comparação funciona via escala (cliques), não atendimento 1:1

### Newsletter Inteligente (Recomendado)
- Não aparecer imediatamente (irrita e Google penaliza)
- Usar exit-intent OU delay de 30s OU após 50% scroll
- Copy focado no benefício: "Alertas de preço" ao invés de "Receba ofertas"
- Mobile: usar sticky bar no footer, não popup central

## 📝 Notas Técnicas

### Adicionar novo produto
1. Editar `data/catalogs/geladeira.json`
2. Adicionar imagens em `assets/images/products/[id]/`
3. Rodar `node tools/build.js`
4. Commit e push

### Adicionar nova categoria
1. Criar arquivo `data/catalogs/[categoria].json`
2. Seguir estrutura de `geladeira.json`
3. Build script detecta automaticamente

### Alterar número WhatsApp (se reativar)
- `template.html` ~linha 1565
- `js/main.js` ~linha 3655

## 🔑 Configurações Importantes
- `baseUrl`: Configurado em `tools/build.js`
- Google Analytics: G-XXXXXXXXXX (placeholder)
- Cores brand: #1e3a8a (azul escuro), #3b82f6 (azul claro)
