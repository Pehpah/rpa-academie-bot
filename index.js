require("dotenv").config();
const express = require("express");
const { Telegraf } = require("telegraf");
const path = require("path");

// ==== Initialisation ====
const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// ==== Handlers ====
const welcomeHandler = require("./handlers/welcomeHandler");
const { handleCoaching } = require("./handlers/coachHandler");
const unknownHandler = require("./handlers/unknownHandler");
const coachHandler = require("./handlers/coachHandler");

// Appel des handlers
welcomeHandler(bot);
unknownHandler(bot);
coachHandler(bot);

// ==== Commande de coaching ====
bot.command("coaching", handleCoaching);

// ==== Nettoyage automatique des fichiers de logs ====
const { cleanOldFiles } = require("./utils/fileCleaner");
cleanOldFiles(); // au démarrage

setInterval(() => {
  console.log("🧹 Nettoyage automatique des fichiers obsolètes...");
  cleanOldFiles();
}, 24 * 60 * 60 * 1000); // chaque 24h

// ==== Interface de visualisation des logs ====
const logViewerRoutes = require("./routes/logViewer");
app.use("/logs", logViewerRoutes);

// ==== Route principale pour Render ====
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("✅ RPA Bot est actif et prêt à coacher !");
});

// ==== Lancement Express + Bot ====
app.listen(PORT, async () => {
  console.log(`🚀 Serveur Express lancé sur le port ${PORT}`);
  await bot.launch();
});
