require("dotenv").config();
const { Telegraf } = require("telegraf");
const express = require("express");

const welcomeHandler = require("./handlers/welcomeHandler");
const { handleCoaching } = require("./handlers/coachingHandler");
const unknownHandler = require("./handlers/unknownHandler");
const coachHandler = require('./handlers/coachHandler');
coachHandler(bot);

const { cleanOldFiles } = require("./utils/fileCleaner"); // ✅ Import du nettoyeur

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// Utilisation des handlers
welcomeHandler(bot);
unknownHandler(bot);

// Commande spécifique coaching
bot.command('coaching', handleCoaching);

// Nettoyage immédiat au démarrage
cleanOldFiles();

// Nettoyage toutes les 24 heures (86 400 000 ms)
setInterval(() => {
  console.log("🕒 Nettoyage automatique des fichiers de progression...");
  cleanOldFiles();
}, 24 * 60 * 60 * 1000); // 24h

// Route pour Render
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("✅ RPA Bot est actif !");
});

app.listen(PORT, async () => {
  console.log(`🚀 Serveur Express lancé sur le port ${PORT}`);
  await bot.launch();
});
