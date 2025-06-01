require("dotenv").config();
const express = require("express");
const { Telegraf } = require("telegraf");
const path = require("path");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// ==== Handlers ====
const welcomeHandler = require("./handlers/welcomeHandler");
const coachHandler = require("./handlers/coachHandler");
const unknownHandler = require("./handlers/unknownHandler");

// Enregistrement des handlers
welcomeHandler(bot);
coachHandler(bot);
unknownHandler(bot);

// ✅ Commande coaching
bot.command("coaching", coachHandler.handleCoaching);

// ✅ Nettoyage régulier des fichiers expirés
const { cleanOldFiles } = require("./utils/fileCleaner");
cleanOldFiles(); // au lancement

setInterval(() => {
  console.log("🧹 Nettoyage automatique des fichiers obsolètes...");
  cleanOldFiles();
}, 24 * 60 * 60 * 1000); // toutes les 24h

// ✅ Interface web (visualisation logs)
const logViewerRoutes = require("./routes/logViewer");
app.use("/logs", logViewerRoutes);

// ✅ Route principale
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("✅ RPA Bot est actif et prêt à coacher !");
});

// ✅ Lancement
app.listen(PORT, async () => {
  console.log(`🚀 Serveur Express lancé sur le port ${PORT}`);
  await bot.launch();
});
