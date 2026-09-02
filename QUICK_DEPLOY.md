# 🚀 DEPLOY RÁPIDO - 5 MINUTOS

## PROBLEMA ATUAL
- Frontend ✅ (Vercel)
- Backend ❌ (não deployado)
- Socket.io tentando conectar = **404 Error**

## SOLUÇÃO: Deploy no Railway (Grátis)

### 1️⃣ Enviar código para GitHub
```bash
cd c:\Users\GAMER\Downloads\APP-TCC-INCUBADORA
git add .
git commit -m "Configurar deploy - adicionar env vars"
git push origin main
```

### 2️⃣ Criar conta no Railway (30 segundos)
- Acesse: https://railway.app
- Login com GitHub
- Clique em "Create a new project"

### 3️⃣ Deploy automático (1 minuto)
- Selecione "GitHub Repo"
- Escolha seu repositório
- Railway detecta Node.js automaticamente
- Clica em "Deploy"

### 4️⃣ Obter URL do backend (30 segundos)
- Aguarde build terminar (2-3 minutos)
- Vá em "Deployments" → veja a URL: `https://incubadora-backend-xxx.railway.app`
- Copie essa URL

### 5️⃣ Adicionar variável no Vercel (30 segundos)
- Acesse: https://vercel.com/dashboard
- Clique no seu projeto "frontend-incubadora-tcc"
- Vá em "Settings" → "Environment Variables"
- Adicione nova variável:
  ```
  Nome: VITE_BACKEND_URL
  Valor: https://incubadora-backend-xxx.railway.app
  ```
- Clique em "Save"

### 6️⃣ Redeploy frontend (automático)
- Vercel detecta mudança de env var
- Faz rebuild automaticamente
- Pronto! ✅

### ✅ Verificar se funcionou
- Abra seu app na Vercel
- Abra DevTools (F12) → Console
- Procure por: `[Socket.io] Connected to backend` ✅
- Status deve mudar de "Offline" → "Online" ✅

---

## 🆘 Precisa de ajuda?
Se der erro, envie:
1. Screenshot do erro do console
2. URL do seu backend no Railway
3. Seu projeto Vercel

Railway é gratuito por enquanto e não precisa de cartão de crédito!
