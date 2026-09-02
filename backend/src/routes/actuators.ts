/**
 * ====================================================================
 * ROTAS DE ATUADORES
 * ====================================================================
 * 
 * Arquivo: src/routes/actuators.ts
 * Função: Controlar e monitorar atuadores (lâmpada, ventilador)
 * 
 * Atuadores Controláveis:
 * ├─ Lâmpada (Aquecimento): liga/desliga para manter temperatura
 * └─ Ventilador: circula ar e evita umidade excessiva
 * 
 * Endpoints:
 * ├─ GET   /status  → retorna estado atual de lâmpada e ventilador
 * ├─ PATCH /lamp    → controla lâmpada (on/off)
 * └─ PATCH /fan     → controla ventilador (on/off/auto)
 * 
 * Fluxo de Controle:
 * 1. Frontend (ou ESP32) envia PATCH com novo estado
 * 2. Backend registra ação em ActuatorLog (histórico)
 * 3. Backend emite Socket.io "actuator:update" em tempo real
 * 4. ESP32/Frontend recebe e executa a ação (se aplicável)
 * ====================================================================
 */

import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/v1/actuators/status
 * 
 * Retorna o status ATUAL de lâmpada e ventilador
 * (baseia-se no último registro em ActuatorLog)
 * 
 * Resposta (200):
 * {
 *   "lamp": "on" | "off" | "unknown",
 *   "fan": "on" | "off" | "auto" | "unknown"
 * }
 */
router.get('/status', async (req, res) => {
  try {
    // Busca último log de lâmpada e ventilador para inferir status
    const lampLog = await prisma.actuatorLog.findFirst({ 
      where: { actuator: 'lamp' }, 
      orderBy: { createdAt: 'desc' } 
    });
    const fanLog = await prisma.actuatorLog.findFirst({ 
      where: { actuator: 'fan' }, 
      orderBy: { createdAt: 'desc' } 
    });
    
    res.json({ 
      lamp: lampLog?.action || 'unknown', 
      fan: fanLog?.action || 'unknown' 
    });
  } catch (err) {
    res.status(500).json({ error: 'failed to get actuators status' });
  }
});

/**
 * PATCH /api/v1/actuators/lamp
 * 
 * Liga ou desliga a LÂMPADA (aquecimento)
 * 
 * Body JSON (esperado):
 * { "on": true | false }
 * 
 * Exemplo de Requisição:
 * PATCH /api/v1/actuators/lamp
 * { "on": true }
 * 
 * Resposta (200):
 * {
 *   "ok": true,
 *   "created": {
 *     "id": 1,
 *     "actuator": "lamp",
 *     "action": "on",
 *     "payload": "{\"on\":true}",
 *     "createdAt": "2026-08-31T00:30:00Z"
 *   }
 * }
 * 
 * Efeito Colateral:
 * - Emite Socket.io "actuator:update" → { actuator: 'lamp', action: 'on'|'off' }
 * - ESP32 pode ouvir e ativar/desativar GPIO da lâmpada
 */
router.patch('/lamp', async (req, res) => {
  try {
    const { on } = req.body;
    
    // Cria registro de log
    const payload = { 
      actuator: 'lamp', 
      action: on ? 'on' : 'off', 
      payload: JSON.stringify({ on }) 
    };
    const created = await prisma.actuatorLog.create({ data: payload });
    
    // Emite evento para clientes conectados (tempo real)
    const io = req.app.get('io');
    if (io) io.emit('actuator:update', { actuator: 'lamp', action: on ? 'on' : 'off' });
    
    res.json({ ok: true, created });
  } catch (err) {
    res.status(500).json({ error: 'failed to update lamp' });
  }
});

/**
 * PATCH /api/v1/actuators/fan
 * 
 * Controla o VENTILADOR (circulação de ar)
 * 
 * Body JSON (esperado):
 * { "state": "on" | "off" | "auto" | ... }
 * 
 * Exemplo de Requisição:
 * PATCH /api/v1/actuators/fan
 * { "state": "auto" }
 * 
 * Resposta (200):
 * {
 *   "ok": true,
 *   "created": {
 *     "id": 2,
 *     "actuator": "fan",
 *     "action": "auto",
 *     "payload": "{\"state\":\"auto\"}",
 *     "createdAt": "2026-08-31T00:30:00Z"
 *   }
 * }
 * 
 * Efeito Colateral:
 * - Emite Socket.io "actuator:update" → { actuator: 'fan', action: 'on'|'off'|'auto' }
 * - ESP32 pode ajustar velocidade ou modo do ventilador
 */
router.patch('/fan', async (req, res) => {
  try {
    const { state } = req.body;  // expected 'on'|'off'|'auto' etc
    
    // Cria registro de log
    const payload = { 
      actuator: 'fan', 
      action: state, 
      payload: JSON.stringify({ state }) 
    };
    const created = await prisma.actuatorLog.create({ data: payload });
    
    // Emite evento para clientes conectados (tempo real)
    const io = req.app.get('io');
    if (io) io.emit('actuator:update', { actuator: 'fan', action: state });
    
    res.json({ ok: true, created });
  } catch (err) {
    res.status(500).json({ error: 'failed to update fan' });
  }
});

export default router;
