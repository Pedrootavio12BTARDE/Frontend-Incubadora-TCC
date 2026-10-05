"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
router.get('/history', async (req, res) => {
    try {
        // simple aggregated example: last 100 readings
        const readings = await prisma_1.default.sensorReading.findMany({ take: 100, orderBy: { createdAt: 'desc' } });
        res.json({ readings });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to get history' });
    }
});
exports.default = router;
