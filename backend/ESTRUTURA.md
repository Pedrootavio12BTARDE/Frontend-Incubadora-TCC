# 📁 Estrutura do Backend - EcoIncubadora

## Visão Geral
Backend em **Node.js + Express + TypeScript** com **Prisma ORM** e **Socket.io** para comunicação em tempo real com o frontend React e o ESP32.

---

## 📂 Estrutura de Pastas

```
backend/
├── src/                          # Código-fonte TypeScript
│   ├── server.ts                 # Servidor principal (Express + Socket.io)
│   ├── lib/
│   │   └── prisma.ts             # Instância do cliente Prisma (BD)
│   └── routes/                   # Rotas da API REST
│       ├── index.ts              # Agregador principal de rotas
│       ├── sensors.ts            # Endpoints de leitura de sensores
│       ├── actuators.ts          # Endpoints de controle de atuadores (lâmpada, ventilador)
│       ├── production.ts         # Endpoints de gestão de produção (contagem de ovos)
│       ├── auth.ts               # Endpoints de autenticação (login, JWT)
│       └── reports.ts            # Endpoints de relatórios e histórico
│
├── prisma/
│   └── schema.prisma             # Definição do banco de dados (modelos: User, SensorReading, etc.)
│
├── dist/                         # Código compilado (gerado automaticamente)
│
├── package.json                  # Dependências e scripts
├── tsconfig.json                 # Configuração do TypeScript
├── .env.example                  # Variáveis de ambiente (copiar para .env)
├── README.md                     # Guia rápido de setup
└── ESTRUTURA.md                  # Este arquivo
```

---

## 🔍 Função de Cada Pasta

### **src/**
📌 **Contém todo o código TypeScript da aplicação**

#### **src/server.ts**
- Arquivo **principal** da aplicação.
- Inicializa o servidor Express e Socket.io.
- Configura CORS, JSON parsing, e middleware.
- Monta as rotas em `/api/v1/*`.
- Roda por padrão na porta **3001**.

#### **src/lib/**
- **Utilitários e configurações globais**.
- `prisma.ts`: Exporta a instância única do Prisma Client (usado em todas as rotas para acessar o banco).

#### **src/routes/**
- **Todas as rotas da API REST**.

| Arquivo | Função | Endpoints Principais |
|---------|--------|----------------------|
| **index.ts** | Agregador central; monta todas as sub-rotas | `GET /api/v1/status` |
| **sensors.ts** | Recebe dados de sensores (DHT22); retorna últimas leituras | `GET /api/v1/sensors/latest` `POST /api/v1/sensors/data` |
| **actuators.ts** | Controla lâmpada e ventilador; retorna status | `GET /api/v1/actuators/status` `PATCH /api/v1/actuators/lamp` `PATCH /api/v1/actuators/fan` |
| **production.ts** | Gerencia contagem de ovos | `GET /api/v1/production` `POST /api/v1/production/increment` |
| **auth.ts** | Autenticação de usuários; emite JWT | `POST /api/v1/auth/login` |
| **reports.ts** | Retorna histórico e relatórios | `GET /api/v1/reports/history` |

---

### **prisma/**
📌 **Definição do banco de dados e migrations**

#### **prisma/schema.prisma**
- Define os **modelos de dados** (tabelas):
  - **User**: usuários operadores (email, password, role, name).
  - **SensorReading**: leituras de sensores (temperatura, umidade, ovos, adubo, timestamp).
  - **ActuatorLog**: histórico de ações em atuadores (lâmpada, ventilador).
  - **Production**: contagem total de ovos e último classificador de cor.

- Cada modelo mapeia 1:1 com uma tabela no banco SQLite (ou Postgres em prod).

---

### **dist/**
📌 **Código compilado (NÃO editar manualmente)**

- Gerado automaticamente ao rodar `npm run build`.
- Contém o `.js` compilado a partir do TypeScript em `src/`.
- Usado para produção (`npm start` roda `dist/server.js`).

---

### **Raiz (backend/)**

| Arquivo | Função |
|---------|--------|
| **package.json** | Define dependências (Express, Prisma, Socket.io, bcrypt, JWT, etc.) e scripts (dev, build, start, prisma:generate, prisma:migrate). |
| **tsconfig.json** | Configuração do compilador TypeScript (target ES2022, module Node16, strict mode, etc.). |
| **.env.example** | Modelo de variáveis de ambiente. Copie para `.env` e ajuste (PORT, DATABASE_URL, JWT_SECRET, ALLOWED_ORIGINS). |
| **README.md** | Guia rápido de setup e start. |
| **ESTRUTURA.md** | Este arquivo com documentação detalhada. |

---

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento (recarrega automaticamente)
npm run dev

# Compilar TypeScript para JavaScript
npm run build

# Rodar em produção
npm start

# Gerar cliente Prisma (necessário após instalar dependências)
npm run prisma:generate

# Executar migrations do banco
npm run prisma:migrate
```

---

## 🔄 Fluxo de Dados

### **ESP32 → Backend**
1. ESP32 envia POST HTTP para `http://backend-ip:3001/api/v1/sensors/data` com JSON:
   ```json
   { "temperature": 37.8, "humidity": 60, "eggs": 245 }
   ```
2. Route `sensors.ts` recebe, valida e salva no banco via Prisma.
3. Emite evento `sensor:update` via Socket.io para todos os clientes conectados.

### **Frontend → Backend**
1. Frontend React (Vite) chama `fetch()` para endpoint da API:
   ```js
   fetch('http://localhost:3001/api/v1/production')
   ```
2. Route `production.ts` retorna JSON com dados do banco.
3. Frontend renderiza dados em componentes (ProductionCard, IncubationCard, etc.).

### **Controle Remoto (Frontend → Backend → ESP32)**
1. Frontend envia PATCH para `http://localhost:3001/api/v1/actuators/lamp`:
   ```json
   { "on": true }
   ```
2. Backend registra em ActuatorLog.
3. Backend emite `actuator:update` via Socket.io.
4. Frontend (ou ESP32 se conectado via Socket) recebe e atualiza UI.
5. Para hardware real: ESP32 escuta Socket ou lê de endpoint de polling.

---

## 🔐 Segurança & Autenticação

- **JWT**: Rota `/api/v1/auth/login` emite token (`expiresIn: 8h`).
- **CORS**: Configurado em `server.ts` para permitir frontend em dev (ajustar em prod).
- **Validação**: Rotas validam `temperature`, `humidity` etc. antes de persistir.
- **Prod**: Use HTTPS, hash passwords com bcrypt, e configure `ALLOWED_ORIGINS` corretamente.

---

## 📊 Banco de Dados

- **Desenvolvimento**: SQLite (`dev.db`) — arquivo local, sem servidor.
- **Produção**: PostgreSQL ou MySQL recomendado.
- Mudar: ajuste `DATABASE_URL` em `.env` e rode `npx prisma migrate deploy`.

---

## 🔌 Socket.io (Tempo Real)

Eventos emitidos pelo backend para o frontend:
- `sensor:update` — nova leitura de sensor.
- `actuator:update` — mudança de estado de atuador.
- `production:update` — atualização de contagem de ovos.
- `welcome` — mensagem de boas-vindas ao conectar.

O frontend deve:
1. Instalar `socket.io-client`.
2. Conectar: `io('http://localhost:3001')`.
3. Escutar: `socket.on('sensor:update', (data) => { ... })`.

---

## ✅ Próximos Passos

1. **Configurar `.env`** (copie de `.env.example`).
2. **Rodar migrations**: `npm run prisma:migrate`.
3. **Iniciar dev**: `npm run dev`.
4. **Testar endpoints**: use `curl`, Postman ou o frontend.
5. **Conectar ESP32**: envie POST JSON para `/api/v1/sensors/data`.
6. **Integrar Socket.io no frontend**: implemente listener de eventos em tempo real.

---

## 📞 Contato / Dúvidas

Para ajuda com estrutura, roteamento ou Prisma, consulte:
- Express Docs: https://expressjs.com/
- Prisma Docs: https://www.prisma.io/docs/
- Socket.io Docs: https://socket.io/docs/
- TypeScript Docs: https://www.typescriptlang.org/
