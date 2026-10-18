import { Telegraf, Markup } from 'telegraf';

const { BOT_TOKEN, WEBAPP_URL } = process.env;

if (!BOT_TOKEN) throw new Error('BOT_TOKEN is missing. Set it in Vercel → Settings → Environment Variables.');
if (!WEBAPP_URL || !WEBAPP_URL.startsWith('https://')) {
  throw new Error('WEBAPP_URL must be a public https:// URL (Telegram requires HTTPS for Mini Apps).');
}

export const bot = new Telegraf(BOT_TOKEN);

const openKeyboard = Markup.inlineKeyboard([
  Markup.button.webApp('📘 Open Facebook', WEBAPP_URL),
]);

const startKeyboard = Markup.inlineKeyboard([
  [Markup.button.webApp('📘 Open Facebook', WEBAPP_URL)],
  [Markup.button.callback('❓ How it works', 'how')],
]);

const escapeHtml = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const welcomeText = (name) =>
  [
    `👋 <b>Hi ${escapeHtml(name) || 'there'}, welcome to AutomateEdge FB!</b>`,
    '',
    'Browse Facebook without leaving Telegram.',
    '',
    '✅ Your feed, messages and notifications',
    '✅ Opens in seconds, no extra app needed',
    '✅ Close it anytime and you are back in your chat',
    '',
    '👇 <b>Tap the button below to get started.</b>',
  ].join('\n');

const howText = [
  '<b>How it works</b>',
  '',
  '1️⃣ Tap <b>📘 Open Facebook</b>, or the <b>Facebook</b> button next to the message box.',
  '2️⃣ Facebook opens inside Telegram. Log in the first time.',
  '3️⃣ Swipe down or tap <b>Close</b> to come back here.',
  '',
  '<i>Your login goes straight to Facebook. This bot never sees your password.</i>',
].join('\n');

bot.start((ctx) =>
  ctx.reply(welcomeText(ctx.from?.first_name), { parse_mode: 'HTML', ...startKeyboard })
);

bot.action('how', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(howText, { parse_mode: 'HTML', ...openKeyboard });
});

bot.command('facebook', (ctx) => ctx.reply('Here you go 👇', openKeyboard));

bot.help((ctx) => ctx.reply(howText, { parse_mode: 'HTML', ...openKeyboard }));

// Any other message: show the button again.
bot.on('message', (ctx) => ctx.reply('Open Facebook:', openKeyboard));

bot.catch((err, ctx) => console.error(`Error handling update ${ctx.update.update_id}:`, err));

// One-time setup: chat menu button, profile texts and command list.
// Telegram stores these, so they only need re-running when the texts or WEBAPP_URL change.
export async function configureBot() {
  await bot.telegram.setChatMenuButton({
    menuButton: { type: 'web_app', text: 'Facebook', web_app: { url: WEBAPP_URL } },
  });

  // Shown on the empty chat screen before the user taps Start.
  await bot.telegram.setMyDescription(
    '📘 Facebook, right inside Telegram.\n\n' +
      '• Check your feed, messages and notifications\n' +
      '• No extra app needed\n' +
      '• Back to your chats in one tap\n\n' +
      'Tap START to begin 👇'
  );
  // Shown on the bot's profile and in link previews.
  await bot.telegram.setMyShortDescription('Open Facebook inside Telegram in one tap.');

  await bot.telegram.setMyCommands([
    { command: 'start', description: 'Show the Open Facebook button' },
    { command: 'facebook', description: 'Open Facebook' },
    { command: 'help', description: 'How to use this bot' },
  ]);
}
