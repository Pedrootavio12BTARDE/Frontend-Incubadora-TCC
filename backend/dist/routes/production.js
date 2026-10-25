"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
function toProductionResponse(production) {
    return {
        id: production.id,
        eggs: production.eggs,
        eggsCount: production.eggs,
        whiteEggs: production.whiteEggs,
        brownEggs: production.brownEggs,
        lastColor: production.lastColor,
        updatedAt: production.updatedAt,
    };
}
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
        let prod = await prisma_1.default.production.findFirst();
        // Se não existe, cria
        if (!prod) {
            prod = await prisma_1.default.production.create({ data: {} });
        }
        res.json(toProductionResponse(prod));
    }
    catch (err) {
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
router.post('/increment', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const amount = req.body?.amount === undefined ? 1 : Number(req.body.amount);
        const color = req.body?.color;
        if (!Number.isInteger(amount) || amount < 1 || amount > 1000) {
            return res.status(400).json({ error: 'amount must be an integer between 1 and 1000' });
        }
        if (color !== 'Branco' && color !== 'Marrom') {
            return res.status(400).json({ error: 'color must be Branco or Marrom' });
        }
        let prod = await prisma_1.default.production.findFirst();
        if (!prod)
            prod = await prisma_1.default.production.create({ data: {} });
        const updated = await prisma_1.default.production.update({
            where: { id: prod.id },
            data: {
                eggs: { increment: amount },
                ...(color === 'Branco'
                    ? { whiteEggs: { increment: amount } }
                    : { brownEggs: { increment: amount } }),
                lastColor: color,
            }
        });
        const response = toProductionResponse(updated);
        const io = req.app.get('io');
        if (io)
            io.emit('production:update', response);
        res.json({ success: true, newCount: updated.eggs, color, ...response });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to increment production' });
    }
});
/**
 * POST /api/v1/production/set
 *
 * Permite definir diretamente a quantidade de ovos brancos e marrons
 */
router.post('/set', async (req, res) => {
    try {
        const whiteEggs = req.body?.whiteEggs !== undefined ? Math.max(0, Number(req.body.whiteEggs)) : 0;
        const brownEggs = req.body?.brownEggs !== undefined ? Math.max(0, Number(req.body.brownEggs)) : 0;
        const total = whiteEggs + brownEggs;
        const lastColor = req.body?.lastColor || (whiteEggs > 0 ? 'Branco' : 'Marrom');
        let prod = await prisma_1.default.production.findFirst();
        if (!prod)
            prod = await prisma_1.default.production.create({ data: {} });
        const updated = await prisma_1.default.production.update({
            where: { id: prod.id },
            data: {
                eggs: total,
                whiteEggs,
                brownEggs,
                lastColor,
            },
        });
        const response = toProductionResponse(updated);
        const io = req.app.get('io');
        if (io)
            io.emit('production:update', response);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({ error: 'failed to set production' });
    }
});
exports.default = router;
