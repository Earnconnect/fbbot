// Run once after deploying:  npm run setup
// Points Telegram at the Vercel webhook and sets the menu button, descriptions and commands.
import 'dotenv/config';
import { bot, configureBot } from '../lib/bot.js';

const { WEBAPP_URL, WEBHOOK_SECRET } = process.env;
const webhookUrl = new URL('/api/telegram', WEBAPP_URL).href;

await bot.telegram.setWebhook(webhookUrl, {
  secret_token: WEBHOOK_SECRET || undefined,
  drop_pending_updates: true,
});
await configureBot();

const info = await bot.telegram.getWebhookInfo();
console.log(`Webhook set to ${info.url}`);
console.log(`Mini App URL: ${WEBAPP_URL}`);
