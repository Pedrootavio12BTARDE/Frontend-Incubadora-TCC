/**
 * ====================================================================
 * SERVIDOR PRINCIPAL - EcoIncubadora Backend
 * ====================================================================
 * 
 * Arquivo: src/server.ts
 * Função: Inicializar e configurar o servidor Express com Socket.io
 * 
 * Componentes:
 * - Express: framework web (HTTP/REST)
 * - Socket.io: comunicação em tempo real (WebSocket)
 * - Dotenv: carregar variáveis de ambiente
 * - CORS: permitir requisições do frontend em dev/prod
 * 
 * Porta: 3001 (pode ser configurada via PORT em .env)
 * ====================================================================
 */

import express from 'express';
import http from 'http';
import { Server as IOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

// Carrega variáveis de ambiente de .env
dotenv.config();

// Configurações
const PORT = process.env.PORT || 3001;

// Inicializa Express app
const app = express();

// Cria servidor HTTP (necessário para Socket.io)
const server = http.createServer(app);

// Configura Socket.io com CORS para aceitar conexões do frontend
const io = new IOServer(server, {
  cors: { origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }
});

// ====================================================================
// MIDDLEWARES (processam requisições antes das rotas)
// ====================================================================

// Permite requisições de origem diferente (ex: frontend em outra porta/host)
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));

// Parseia corpo da requisição como JSON
app.use(express.json());

// Anexa instância de Socket.io ao app para uso em rotas
// (permite que rotas emitam eventos em tempo real)
app.set('io', io);

// ====================================================================
// ROTAS DA API REST
// ====================================================================

// Monta todas as rotas em /api/v1/*
// Inclui: sensors, actuators, production, auth, reports, status
app.use('/api/v1', routes);

// ====================================================================
// SOCKET.IO - EVENTOS EM TEMPO REAL
// ====================================================================

// Escuta nova conexão WebSocket
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  
  // Envia mensagem de boas-vindas ao cliente que se conectou
  socket.emit('welcome', { msg: 'connected to EcoIncubadora backend' });
  
  // Eventos que backend emite para frontend:
  // - sensor:update: nova leitura de temperatura/umidade/ovos
  // - actuator:update: mudança de estado da lâmpada/ventilador
  // - production:update: alteração na contagem de ovos
});

// ====================================================================
// INICIAR SERVIDOR
// ====================================================================

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/v1`);
  console.log(`🔌 WebSocket (Socket.io) habilitado para tempo real`);
});
