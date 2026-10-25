"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const authorization = req.header('Authorization');
    const token = authorization?.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length)
        : '';
    if (!token) {
        return res.status(401).json({ error: 'authentication required' });
    }
    const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'dev');
    if (!secret) {
        return res.status(503).json({ error: 'authentication is not configured' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        if (typeof payload.userId !== 'number')
            return res.status(401).json({ error: 'invalid token payload' });
        res.locals.authUserId = payload.userId;
        next();
    }
    catch {
        return res.status(401).json({ error: 'invalid or expired authentication token' });
    }
};
exports.requireAuth = requireAuth;
