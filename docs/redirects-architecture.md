# ComparaTop - Arquitetura de Redirects (Escalável 500+)

> **Data:** 25/12/2025
> **Versão:** 1.0 (Redirects-as-Code)
> **Status:** Deploy Automático (Nginx)

## 1. Visão Geral

Para suportar o crescimento para 500+ produtos sem overhead operacional, adotamos a estratégia **"Redirects-as-Code"**. As regras de roteamento não vivem no painel do Coolify ou Cloudflare, mas sim no repositório (`config/redirects.yml`), sendo versionadas e aplicadas automaticamente via CI/CD.

## 2. Política de URLs Canônicas

Decisão Arquitetural: **Opção A** (URLs curtas e semânticas).

| Tipo | URL Canônica (Status 200) | Alias / Legado (Redirect 301) | Racional |
| :--- | :--- | :--- | :--- |
| **Categoria** | `/geladeiras/` | `/categoria/geladeira/` | URL mais limpa, melhor UX, padrão de e-commerce moderno. |
| **Produto** | `/produto/<cat>/<modelo>/` | `/p/<id>` (futuro) | Manter estrutura hierárquica para SEO. |

**Regras de Governança:**
1.  **Sitemap.xml:** Deve conter APENAS a URL Canônica.
2.  **Canonical Tag:** Todas as variações apontam para a Canônica.
3.  **Links Internos:** O site sempre renderiza links para a Canônica.

## 3. Estrutura "Redirects-as-Code"

A arquitetura elimina a configuração manual 1-para-1 usando **Patterns (Regex)** onde possível.

### Fonte da Verdade
Arquivo: `config/redirects.yml`

```yaml
redirects:
  # Legado específico (1:1)
  - from: /categoria/geladeira/
    to: /geladeiras/
    status: 301

  # Padrões em Lote (Regex) - ESCALABILIDADE
  - from: ^/antiga-categoria/(.*)$
    to: /nova-categoria/$1
    type: regex
    status: 301
```

### Gerador de Artefatos
Script: `tools/generate-redirects.js`
- Lê o YAML.
- Processa regras exatas (`location =`) e regex (`location ~`).
- Gera arquivo Nginx otimizado: `dist/_nginx_redirects.conf`.

### Aplicação Automática (Zero-Touch)
1.  `npm run build` invoca o gerador.
2.  Arquivo `dist/_nginx_redirects.conf` é criado.
3.  `nginx.conf` da aplicação contém `include /var/www/comparatop/_nginx_redirects.conf;`.
4.  No deploy, o Nginx recarrega as novas regras instantaneamente.

## 4. Por que Nginx Regex (e não Cloudflare Bulk)?

Para o estágio atual (Gratuito/Pro):
- **Cloudflare Bulk Redirects:** Excelentes para listas grandes (CSV), mas não suportam Regex nativamente no plano Free de forma flexível (limitado a prefixos).
- **Cloudflare Redirect Rules:** Suportam Regex, mas limite de 10 regras no plano Free.
- **Nginx Local:** Suporta Regex ilimitado, custo zero, e performance "good enough" para <10k req/s.

**Caminho de Migração Futura:**
Ao atingir escala massiva (>1M req/mês), migraremos regras de padrão para Cloudflare Workers ou Enterprise Rulesets.

## 5. Validação (Testes Automatizados)

Os `smoke-tests` garantem a consistência antes de ir para o ar:
1.  **Check 301:** Alias conhecido retorna 301 e Location correto.
2.  **Check Canonical:** URL destino retorna 200.
3.  **Gatekeeper Sitemap:** Se o sitemap contiver qualquer URL iniciada por `/categoria/` (alias), o build Falha.

---
**Resultado:** Adicionar 500 produtos ou mudar a estrutura de URLs requer apenas um commit no YAML. O resto é automático.
