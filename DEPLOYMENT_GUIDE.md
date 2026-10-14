# EcoIncubadora - Deploy de demonstração no Render

O repositório inclui `render.yaml` para publicar o backend no Render. O SQLite continua sendo usado localmente; a versão online usa PostgreSQL.

## Backend

1. Envie o repositório atualizado ao GitHub. Não envie `.env`, `.env.production`, `secrets.h` nem o banco SQLite.
2. No Render, crie um banco PostgreSQL.
3. Crie um Blueprint conectado ao repositório e use o `render.yaml` da raiz.
4. Configure `DATABASE_URL` com a **Internal Database URL** do PostgreSQL e `ALLOWED_ORIGINS` com a origem do frontend, como `https://seu-site.vercel.app`.
5. O Render gera `JWT_SECRET` automaticamente. O Blueprint executa a migração PostgreSQL durante a inicialização.
6. Depois do deploy, teste `https://NOME-DO-SERVICO.onrender.com/api/v1/status`; deve retornar `{"ok":true}`.

Consulte [backend/RENDER_DEPLOY.md](backend/RENDER_DEPLOY.md) para preparar o ESP32.

## Frontend

No provedor do frontend, configure a variável de build `VITE_BACKEND_URL` com a origem do backend, sem `/api/v1` e sem barra final. Faça um novo build do site para incorporar a URL.

## Limite desta configuração

As rotas de sensores e atuadores ficam públicas para facilitar a apresentação. Qualquer pessoa que conheça a URL pode consultar dados e enviar comandos à lâmpada ou ao motor. Não use essa configuração para operar a incubadora fora da demonstração.
