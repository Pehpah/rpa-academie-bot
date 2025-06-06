require("dotenv").config();
const { Telegraf } = require("telegraf");

// Remplace par le token de ton bot dans .env
const bot = new Telegraf(process.env.BOT_TOKEN);

// Écoute les messages envoyés dans un canal (ton bot doit être admin dans le canal)
bot.on("channel_post", async (ctx) => {
  console.log("📢 Message reçu dans le canal !");
  console.log("🔢 ID du canal :", ctx.chat.id);
});

bot.launch();
console.log("🤖 Bot en attente de messages de canal...");

// Stop proprement à Ctrl+C
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
