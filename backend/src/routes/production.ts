/**
 * ====================================================================
 * ROTAS DE PRODUÇÃO
 * ====================================================================
 * 
 * Arquivo: src/routes/production.ts
 * Função: Gerenciar contagem de ovos produzidos/eclodidos
 * 
 * Dados Monitorados:
 * ├─ eggs: contador total de ovos
 * └─ lastColor: classificação (Branco, Marrom, Vermelho, etc.)
 * 
 * Endpoints:
 * ├─ GET  /              → retorna estado atual de produção
 * └─ POST /increment     → adiciona/incrementa ovos
 * 
 * Fluxo:
 * 1. Frontend ou sensor envia POST /increment
 * 2. Backend incrementa contador no banco
 * 3. Backend emite Socket.io "production:update" em tempo real
 * 4. Dashboard atualiza ProductionCard com novo número
 * ====================================================================
 */

import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

/**
 * GET /api/v1/production
 * 
 * Retorna o estado ATUAL de produção (ovos e classificação)
 * 
 * Resposta (200):
 * {
 *   "id": 1,
 *   "eggs": 245,
 *   "lastColor": "Marrom",
 *   "updatedAt": "2026-08-31T00:30:00Z"
 * }
 * 
 * Comportamento:
 * - Se não existir registro, cria um novo com eggs=0
 * - Retorna sempre um objeto (não null)
 */
router.get('/', async (req, res) => {
  try {
    // Busca primeiro (e único) registro de produção
    let prod = await prisma.production.findFirst();
    
    // Se não existe, cria
    if (!prod) {
      prod = await prisma.production.create({ data: {} });
    }
    
    res.json(prod);
  } catch (err) {
    res.status(500).json({ error: 'failed to read production' });
  }
});

/**
 * POST /api/v1/production/increment
 * 
 * Incrementa CONTADOR DE OVOS e atualiza classificação de cor
 * 
 * Body JSON (esperado):
 * {
 *   "amount": 1,          // opcional, padrão 1
 *   "color": "Marrom"     // opcional, última cor detectada
 * }
 * 
 * Exemplos de Requisição:
 * 
 * 1. Adicionar 1 ovo (padrão):
 *    POST /api/v1/production/increment
 *    {}
 *    Resultado: eggs aumenta em 1
 * 
 * 2. Adicionar múltiplos ovos:
 *    POST /api/v1/production/increment
 *    { "amount": 5, "color": "Branco" }
 *    Resultado: eggs aumenta em 5, lastColor = "Branco"
 * 
 * Resposta (200):
 * {
 *   "id": 1,
 *   "eggs": 250,
 *   "lastColor": "Branco",
 *   "updatedAt": "2026-08-31T00:30:00Z"
 * }
 * 
 * Efeito Colateral:
 * - Emite Socket.io "production:update" com dados atualizados
 * - Frontend (ProductionCard) recebe e atualiza dashboard em tempo real
 */
router.post('/increment', async (req, res) => {
  try {
    // Extrai parâmetros
    const { amount = 1, color } = req.body;
    
    // Busca registro atual
    let prod = await prisma.production.findFirst();
    if (!prod) prod = await prisma.production.create({ data: {} });
    
    // Atualiza: incrementa ovos e opcionalmente atualiza cor
    const updated = await prisma.production.update({ 
      where: { id: prod.id }, 
      data: { 
        eggs: prod.eggs + Number(amount), 
        lastColor: color || prod.lastColor 
      } 
    });
    
    // Emite evento para frontend (tempo real)
    const io = req.app.get('io');
    if (io) io.emit('production:update', updated);
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'failed to increment production' });
  }
});

export default router;
