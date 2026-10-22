import { Router } from 'express';
import rateLimit from 'express-rate-limit';

const router = Router();
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
});

router.post('/', contactLimiter, async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

  if (!name || name.length > 120) {
    return res.status(400).json({ error: 'Informe um nome com até 120 caracteres.' });
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Informe um endereço de e-mail válido.' });
  }
  if (!message || message.length > 5000) {
    return res.status(400).json({ error: 'A mensagem deve ter entre 1 e 5000 caracteres.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error('Contact email is not configured: set RESEND_API_KEY and CONTACT_FROM_EMAIL.');
    return res.status(503).json({ error: 'O envio de mensagens está temporariamente indisponível.' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: ['devmindsti@gmail.com'],
        reply_to: email,
        subject: `Contato pelo site: ${name}`,
        text: `Nome: ${name}\nE-mail para resposta: ${email}\n\nMensagem:\n${message}`,
      }),
    });

    if (!response.ok) {
      const providerError = await response.text();
      console.error('Contact email provider rejected the message:', response.status, providerError);
      return res.status(502).json({ error: 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.' });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return res.status(502).json({ error: 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.' });
  }
});

export default router;
