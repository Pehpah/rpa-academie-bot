require("dotenv").config();
const express = require("express");
const { Telegraf } = require("telegraf");
const path = require("path");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// ==== Handlers ====
const welcomeHandler = require("./handlers/welcomeHandler");
const coach = require("./handlers/coachHandler");
const unknownHandler = require("./handlers/unknownHandler");

// Appel des handlers
welcomeHandler(bot);
coach(bot);
unknownHandler(bot);

// ==== Commande coaching ====
bot.command("coaching", coach.handleCoaching);

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

// ==== Route principale ====
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("✅ RPA Bot est actif et prêt à coacher !");
});

// ==== Lancement ====
app.listen(PORT, async () => {
  console.log(`🚀 Serveur Express lancé sur le port ${PORT}`);
  await bot.launch();
});
