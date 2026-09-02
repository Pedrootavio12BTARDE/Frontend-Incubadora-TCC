/**
 * ====================================================================
 * ROTAS DE SENSORES
 * ====================================================================
 * 
 * Arquivo: src/routes/sensors.ts
 * Função: Receber e gerenciar leituras de sensores (ESP32)
 * 
 * Sensores Monitorados:
 * ├─ DHT22: temperatura e umidade (obrigatório)
 * ├─ Contador de Ovos: contagem de ovos (opcional)
 * └─ Sensor de Adubo: nível do coletor orgânico (opcional)
 * 
 * Endpoints:
 * ├─ GET  /latest → retorna última leitura
 * └─ POST /data   → recebe nova leitura do ESP32
 * 
 * Fluxo:
 * 1. ESP32 faz POST JSON para /api/v1/sensors/data
 * 2. Backend valida e salva no banco via Prisma
 * 3. Backend emite evento Socket.io "sensor:update" para frontend
 * 4. Frontend recebe em tempo real e atualiza dashboard
 * ====================================================================
 */

import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/v1/sensors/latest
 * 
 * Retorna a ÚLTIMA leitura de sensor no banco
 * 
 * Resposta de Sucesso (200):
 * {
 *   "id": 1,
 *   "temperature": 37.8,
 *   "humidity": 60,
 *   "eggs": 245,
 *   "fertilizer": 75,
 *   "createdAt": "2026-08-31T00:30:00Z"
 * }
 * 
 * Resposta de Erro (500):
 * { "error": "failed to get latest reading" }
 */
router.get('/latest', async (req, res) => {
  try {
    // Busca no banco: ordenar por data DESC (mais recente primeiro) e pegar o primeiro
    const latest = await prisma.sensorReading.findFirst({ 
      orderBy: { createdAt: 'desc' } 
    });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: 'failed to get latest reading' });
  }
});

/**
 * POST /api/v1/sensors/data
 * 
 * Recebe NOVA LEITURA do ESP32 e salva no banco
 * 
 * Body JSON (esperado):
 * {
 *   "temperature": 37.8,        // obrigatório (float)
 *   "humidity": 60,             // obrigatório (float)
 *   "eggs": 245,                // opcional (int)
 *   "fertilizer": 75,           // opcional (int)
 *   "timestamp": "2026-08-31T00:30:00Z"  // opcional (ISO 8601)
 * }
 * 
 * Resposta de Sucesso (200):
 * {
 *   "ok": true,
 *   "created": {
 *     "id": 1,
 *     "temperature": 37.8,
 *     ...
 *   }
 * }
 * 
 * Resposta de Erro:
 * - 400: temperatura/umidade ausentes
 * - 500: erro ao salvar
 * 
 * Efeito Colateral:
 * - Emite evento Socket.io "sensor:update" para todos os clientes
 *   (frontend conectado recebe atualização em tempo real)
 */
router.post('/data', async (req, res) => {
  try {
    // Extrai dados do body
    const { temperature, humidity, eggs, fertilizer, timestamp } = req.body;
    
    // Validação básica: temperatura e umidade são obrigatórias
    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({ error: 'temperature and humidity are required' });
    }

    // Constrói objeto de dados dinamicamente (só inclui campos presentes)
    const data: any = {
      temperature: Number(temperature),
      humidity: Number(humidity),
    };
    
    // Adiciona campos opcionais se presentes
    if (eggs !== undefined && eggs !== null) data.eggs = Number(eggs);
    if (fertilizer !== undefined && fertilizer !== null) data.fertilizer = Number(fertilizer);
    if (timestamp) data.createdAt = new Date(timestamp);

    // Salva no banco de dados
    const created = await prisma.sensorReading.create({ data });

    // Emite evento para frontend (Socket.io - tempo real)
    const io = req.app.get('io');
    if (io) io.emit('sensor:update', created);

    // Retorna confirmação com dados salvos
    res.json({ ok: true, created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to save sensor data' });
  }
});

export default router;
