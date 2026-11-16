# Módulo 3 · Unidade 2 — Planilhas, Webhooks e APIs: O Sistema Avisa Você

Página didática interativa de apoio aos alunos do **Curso de Formação em IA Generativa**.

## Sobre esta Unidade
Esta unidade explora integrações orientadas a eventos em tempo real: anatomia HTTP e JSON, testes no **Postman**, contratos de API (autenticação, paginação, *rate limit* e idempotência), **Webhooks**, registro de auditoria no **Google Sheets** via **Conta de Serviço** do Google Cloud, detecção de duplicata por conteúdo e segurança/LGPD.

### Recursos da Aplicação
- **Simulador Visual Dinâmico**: Fluxo animado completo (`Postman → Webhook n8n → API Ingestão → Google Sheets`).
- **Conteúdo Interativo**: Tópicos com explicações *Do Zero*, *Na Prática*, *Atenção / Risco* e *Ponto-chave*.
- **Quiz de Fixação**: 10 perguntas com feedback imediato e explicação.
- **Jogo da Memória**: Combinação de conceitos e definições da unidade.

## Stack Tecnológica
- **Next.js** (App Router com `output: "export"` para deploy estático)
- **Tailwind CSS**
- **Lucide React**

## Como executar localmente
```bash
npm install
npm run dev
```

## Publicação na Vercel
Importe o repositório no GitHub, selecione o diretório `MOD4/M3U2-WEB` como **Root Directory** e faça o deploy (sem necessidade de banco de dados ou variáveis de ambiente).

---
© 2026 **CucandoTI** — Todos os direitos reservados.
