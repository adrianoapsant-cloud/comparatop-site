# Runbook: Gerenciamento de Redirects

Este guia descreve como adicionar, modificar e validar redirecionamentos no ComparaTop usando a arquitetura "Redirects-as-Code".

## 1. Quando criar um redirect?
- Mudou a URL de uma página (SEO migration).
- Removeu um produto, mas quer direcionar para a categoria (Soft 404 prevention).
- Criou uma URL curta para marketing (ex: `/promo-natal` -> `/landing-page-longa`).

## 2. Como Adicionar (Passo a Passo)

1.  Abra o arquivo `config/redirects.yml`.
2.  Adicione uma nova entrada na lista `redirects`.

### Exemplo 1: Redirect Simples (1 para 1)
Use para páginas específicas.

```yaml
  - from: /promocao-antiga/
    to: /geladeiras/
    status: 301
    reason: "Promoção encerrada"
```

### Exemplo 2: Redirect de Padrão (Regex)
Use para migrar seções inteiras (ex: 500 produtos).

```yaml
  - from: ^/produto-velho/(.*)$
    to: /produto/$1
    type: regex
    status: 301
```
*Atenção: Regex usa sintaxe Nginx (PCRE).*

## 3. Validar Localmente

Antes de subir, teste se o arquivo de configuração gera o Nginx correto.

```bash
# Executar gerador
node tools/generate-redirects.js

# Verificar saída
cat dist/_nginx_redirects.conf
```

Você deve ver:
```nginx
location = /promocao-antiga/ { return 301 /geladeiras/; }
location ~ ^/produto-velho/(.*)$ { return 301 /produto/$1; }
```

## 4. Deploy

Apenas faça o commit e push. O CI/CD cuida do resto.

```bash
git add config/redirects.yml
git commit -m "chore: adiciona redirect da promo de natal"
git push origin main
```

## 5. Troubleshooting

**Redirect não funciona em produção:**
1.  Aguarde 2 minutos após o push (tempo de build).
2.  Limpe o cache do navegador (ou teste com `curl -I`).
3.  Verifique se existe conflito no `nginx.conf` (regras manuais têm prioridade).
4.  Se for Regex, verifique a sintaxe com validators online de Nginx.
