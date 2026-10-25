"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const requireAuth_1 = require("../middleware/requireAuth");
const router = (0, express_1.Router)();
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
});
router.use(authLimiter);
router.post('/login', async (req, res) => {
    try {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const password = typeof req.body?.password === 'string' ? req.body.password : '';
        if (!email || !password)
            return res.status(400).json({ error: 'email and password are required' });
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: 'invalid credentials' });
        const passwordIsValid = user.password.startsWith('$2')
            ? await bcryptjs_1.default.compare(password, user.password)
            : process.env.NODE_ENV !== 'production' && password === user.password;
        if (!passwordIsValid)
            return res.status(401).json({ error: 'invalid credentials' });
        const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev');
        if (!secret)
            return res.status(503).json({ error: 'authentication is not configured' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '8h' });
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role } });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to login' });
    }
});
router.post('/register', async (req, res) => {
    try {
        const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
        const password = typeof req.body?.password === 'string' ? req.body.password : '';
        const name = typeof req.body?.name === 'string' ? req.body.name.trim() : null;
        if (!email || password.length < 8) {
            return res.status(400).json({ error: 'a valid email and password of at least 8 characters are required' });
        }
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(409).json({ error: 'email is already registered' });
        const user = await prisma_1.default.user.create({
            data: {
                email,
                password: await bcryptjs_1.default.hash(password, 12),
                name: name || null,
                role: 'operator',
            },
        });
        const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev');
        if (!secret)
            return res.status(503).json({ error: 'authentication is not configured' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '8h' });
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar, role: user.role } });
    }
    catch (err) {
        res.status(500).json({ error: 'failed to register user' });
    }
});
router.get('/profile', requireAuth_1.requireAuth, async (req, res) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: Number(res.locals.authUserId) },
            select: { id: true, email: true, name: true, avatar: true, role: true },
        });
        if (!user)
            return res.status(404).json({ error: 'user not found' });
        return res.json({ user });
    }
    catch {
        return res.status(500).json({ error: 'failed to load profile' });
    }
});
router.patch('/profile', requireAuth_1.requireAuth, async (req, res) => {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const avatar = req.body?.avatar === null ? null : req.body?.avatar;
    const allowedAvatars = ['leaf', 'egg', 'robot', 'planet'];
    if (!name || name.length > 60) {
        return res.status(400).json({ error: 'display name must contain between 1 and 60 characters' });
    }
    if (avatar !== null && (typeof avatar !== 'string' || !allowedAvatars.includes(avatar))) {
        return res.status(400).json({ error: 'invalid avatar selection' });
    }
    try {
        const user = await prisma_1.default.user.update({
            where: { id: Number(res.locals.authUserId) },
            data: { name, avatar },
            select: { id: true, email: true, name: true, avatar: true, role: true },
        });
        return res.json({ user });
    }
    catch {
        return res.status(500).json({ error: 'failed to update profile' });
    }
});
exports.default = router;
