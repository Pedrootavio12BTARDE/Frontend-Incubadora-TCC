"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: 'invalid credentials' });
        // NOTE: in a real app compare hashed password with bcrypt
        if (password !== user.password)
            return res.status(401).json({ error: 'invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'dev', { expiresIn: '8h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to login' });
    }
});
exports.default = router;
