require("dotenv").config();
console.log("🤖 BOT_TOKEN loaded:", process.env.BOT_TOKEN);

const express = require("express");
const { Telegraf } = require("telegraf");
const path = require("path");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
app.use(express.json()); // Pour parser JSON des requêtes POST

// ==== Handlers ====
const welcomeHandler = require("./handlers/welcomeHandler");
const unknownHandler = require("./handlers/unknownHandler");
const coachBotHandler = require("./handlers/coachBotHandler");
const registerHandler = require("./handlers/registerHandler");
registerHandler(bot);

// ==== Commandes ====
const profilCommand = require("./commandes/profil");
const modifierProfilCommand = require("./commandes/modifier");
const redemarrerCommand = require("./commandes/redemarrer");
const pehpahCommand = require("./commandes/pehpah");
const activerCommand = require("./commandes/activer"); // ✅ Ajout commande activer

// ==== Utilitaires ====
const { cleanOldFiles } = require("./utils/fileCleaner");

// ==== Initialisation des Handlers ====
welcomeHandler(bot);
unknownHandler(bot);

// ==== Commandes utilisateur ====
bot.command("coach", coachBotHandler.handleCoaching);
bot.command("profil", profilCommand);
bot.command("modifier_profil", modifierProfilCommand);
bot.command("redemarrer", redemarrerCommand);
bot.command("pehpah", pehpahCommand);
bot.command("activer", (ctx) => activerCommand(bot, ctx)); // ✅ Activation

// ✅ Réponse au bouton "Démarrer le coaching du jour"
bot.action("start_coaching", (ctx) => coachBotHandler.handleCoaching(ctx));

// ==== Cron Nettoyage fichiers ====
cleanOldFiles(); // au démarrage
setInterval(() => {
  console.log("🧹 Nettoyage automatique des fichiers obsolètes...");
  cleanOldFiles();
}, 24 * 60 * 60 * 1000); // toutes les 24h

// ==== Routes Express ====
const coachApiRoutes = require("./routes/coachApiRoutes");
const logViewerRoutes = require("./routes/logViewer");

app.use("/api/coach", coachApiRoutes);
app.use("/logs", logViewerRoutes);

// ==== Route principale ====
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("✅ RPA Bot est actif et prêt à coacher !");
});

// ==== Lancement du Bot et du Serveur ====
app.listen(PORT, async () => {
  console.log(`🚀 Serveur Express lancé sur le port ${PORT}`);
  await bot.launch();
});
