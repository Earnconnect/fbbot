import { bot } from '../lib/bot.js';

// Telegram POSTs every update here (set up by `npm run setup`).
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('Bot webhook is up.');

  const secret = process.env.WEBHOOK_SECRET;
  if (secret && req.headers['x-telegram-bot-api-secret-token'] !== secret) {
    return res.status(401).send('Unauthorized');
  }

  // Wait for the reply to be sent before returning, or Vercel may freeze the function first.
  await bot.handleUpdate(req.body);
  res.status(200).send('ok');
}
