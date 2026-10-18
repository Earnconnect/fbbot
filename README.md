# FB Mini App (Telegram) on Vercel

A Telegram bot with a Mini App that opens facebook.com inside Telegram. Both run on one Vercel project:

```
public/index.html   the Mini App page, served at https://<project>.vercel.app/
api/telegram.js     webhook Telegram sends updates to: /api/telegram
lib/bot.js          bot replies and buttons (/start, /facebook, /help)
scripts/setup.js    one-time setup: webhook, menu button, descriptions, commands
```

## 1. Deploy
1. On Vercel: **Add New → Project**, then import this repo. Leave the framework preset as **Other** and click **Deploy**.
2. Copy the project URL, e.g. `https://fbbot.vercel.app/`.
3. Go to **Settings → Environment Variables** and add:
   - `BOT_TOKEN`: the token from @BotFather
   - `WEBAPP_URL`: the URL from step 2
   - `WEBHOOK_SECRET`: any long random string
4. Go to **Deployments → ⋯ → Redeploy** so the variables take effect.

## 2. Connect the bot (run once)
On your PC:
```powershell
npm install
copy .env.example .env    # fill in the same three values as on Vercel
npm run setup
```
It should print `Webhook set to https://<project>.vercel.app/api/telegram`.

Run it again only if you change the URL, the secret, or the bot's texts in `lib/bot.js`.

## 3. Test
Open the bot in Telegram and send `/start`.

## Notes
- A bot can use a webhook or polling, not both. Stop any copy running elsewhere (for example `pm2 delete fb-mini-app-bot` on the VPS).
- Check that the webhook works: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo`. Look at `last_error_message`.
- Logs: Vercel → your project → **Logs**.
- Optional: BotFather → `/mybots` → your bot → **Bot Settings → Configure Mini App**, then set the same `WEBAPP_URL`.
