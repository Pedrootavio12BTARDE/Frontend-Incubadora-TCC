# EcoIncubadora - Guia de Deploy em Produção

## 🚀 Deploy do Backend (Railway)

Railway é o mais fácil: só conecta seu GitHub e faz auto-deploy.

### Passo 1: Preparar o Backend
Sua pasta `backend/` já está pronta! Só precisa fazer push no GitHub.

### Passo 2: Criar conta no Railway
1. Acesse [railway.app](https://railway.app)
2. Clique em "Start a New Project"
3. Conecte sua conta GitHub

### Passo 3: Deploy do Backend no Railway
1. Selecione "GitHub Repo" → escolha seu repositório
2. Railway detectará automaticamente que é um projeto Node.js
3. Clique em "Deploy"
4. Railway vai compilar TypeScript automaticamente

### Passo 4: Configurar variáveis de ambiente
No painel do Railway, vá em "Variables" e adicione:
```
PORT=3001
DATABASE_URL=postgresql://... (Railway gera automaticamente se usar PostgreSQL)
JWT_SECRET=ecoincubadora_jwt_secret_2024
ALLOWED_ORIGINS=https://frontend-incubadora-tcc.vercel.app
```

⚠️ **IMPORTANTE**: Mude `ALLOWED_ORIGINS` para aceitar sua URL da Vercel!

### Passo 5: Obter URL do Backend
Railway vai gerar uma URL tipo: `https://backend-incubadora-xxxx.railway.app`

## 🔗 Conectar Frontend à Vercel

### Passo 1: Variáveis de Ambiente na Vercel
1. Acesse seu projeto no [vercel.com](https://vercel.com)
2. Vá em "Settings" → "Environment Variables"
3. Adicione:
   ```
   VITE_BACKEND_URL=https://backend-incubadora-xxxx.railway.app
   ```
   (substitua pela URL do seu backend no Railway)

### Passo 2: Fazer Deploy do Frontend
```bash
npm run build
# ou
vercel deploy
```

A Vercel vai ler a variável e compilar o frontend corretamente.

## ✅ Verificar se está funcionando

Abra o DevTools (F12) no navegador e veja se:
- ✅ Socket.io conecta a `wss://backend-incubadora-xxxx.railway.app/socket.io/`
- ✅ API calls vão para `https://backend-incubadora-xxxx.railway.app/api/v1/*`
- ✅ Status muda de "Offline" para "Online"

## 🔄 Fluxo de Desenvolvimento

- **Dev local**: Frontend porta 5173 → proxy para backend 3001 (automático)
- **Produção**: Frontend Vercel → Backend Railway (via env var)

## 🆘 Troubleshooting

### WebSocket 404
- Checar se backend está rodando no Railway
- Verificar se `VITE_BACKEND_URL` está correto na Vercel
- Verificar `ALLOWED_ORIGINS` no backend

### API 404
- Mesmos passos acima

### CORS Error
- Adicionar `https://frontend-incubadora-tcc.vercel.app` em `ALLOWED_ORIGINS` no Railway
