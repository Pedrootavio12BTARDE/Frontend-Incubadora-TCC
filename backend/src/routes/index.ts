/**
 * ====================================================================
 * ROUTER PRINCIPAL - Agregador de Todas as Rotas
 * ====================================================================
 * 
 * Arquivo: src/routes/index.ts
 * Função: Centralizar todas as sub-rotas da API em um só lugar
 * 
 * Rotas Disponíveis:
 * ├─ /sensors     → Leitura de sensores (temperatura, umidade, ovos)
 * ├─ /actuators   → Controle de atuadores (lâmpada, ventilador)
 * ├─ /production  → Gestão de produção (contagem de ovos)
 * ├─ /auth        → Autenticação (login, JWT)
 * ├─ /reports     → Relatórios e histórico
 * └─ /status      → Status geral do backend
 * 
 * Prefix: /api/v1 (definido em server.ts)
 * Exemplo: GET http://localhost:3001/api/v1/sensors/latest
 * ====================================================================
 */

import { Router } from 'express';

// Importa todas as sub-rotas especializadas
import sensors from './sensors';
import actuators from './actuators';
import production from './production';
import auth from './auth';
import reports from './reports';

// Cria o router principal
const router = Router();

// ====================================================================
// MONTA TODAS AS SUB-ROTAS
// ====================================================================

// Endpoints de Sensores (DHT22, contagem de ovos, nível de adubo)
router.use('/sensors', sensors);
// Exemplos:
//   GET  /api/v1/sensors/latest  → última leitura
//   POST /api/v1/sensors/data    → receber dados do ESP32

// Endpoints de Atuadores (lâmpada, ventilador)
router.use('/actuators', actuators);
// Exemplos:
//   GET   /api/v1/actuators/status    → status atual
//   PATCH /api/v1/actuators/lamp      → ligar/desligar lâmpada
//   PATCH /api/v1/actuators/fan       → ligar/desligar ventilador

// Endpoints de Produção (gestão de ovos)
router.use('/production', production);
// Exemplos:
//   GET  /api/v1/production           → estado atual
//   POST /api/v1/production/increment → adicionar ovos

// Endpoints de Autenticação
router.use('/auth', auth);
// Exemplos:
//   POST /api/v1/auth/login → login e obter JWT token

// Endpoints de Relatórios e Histórico
router.use('/reports', reports);
// Exemplos:
//   GET /api/v1/reports/history → dados dos últimos N sensores

// ====================================================================
// ROTA DE STATUS (Health Check)
// ====================================================================

// Retorna { ok: true } — útil para verificar se backend está online
router.get('/status', (req, res) => res.json({ ok: true }));

// ====================================================================
// EXPORTA ROUTER PARA SER USADO EM server.ts
// ====================================================================

export default router;
