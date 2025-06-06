require("dotenv").config();
console.log("🤖 BOT_TOKEN loaded:", process.env.BOT_TOKEN);

const express = require("express");
const { Telegraf } = require("telegraf");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
app.use(express.json());

// ==== Handlers ====
const welcomeHandler = require("./handlers/welcomeHandler");
const unknownHandler = require("./handlers/unknownHandler");
const coachBotHandler = require("./handlers/coachBotHandler");
const registerHandler = require("./handlers/registerHandler");
const handleNextDay = require("./handlers/handleNextDay");

registerHandler(bot); // Enregistrement au démarrage

// ==== Commandes ====
const profilCommand = require("./commandes/profil");
const modifierProfilCommand = require("./commandes/modifier");
const redemarrerCommand = require("./commandes/redemarrer");
const pehpahCommand = require("./commandes/pehpah");
const activerCommand = require("./commandes/activer");

// ==== Utilitaires ====
const { cleanOldFiles } = require("./utils/fileCleaner");

// ==== Initialisation des Handlers ====
welcomeHandler(bot);
unknownHandler(bot);

// ==== Enregistrement des commandes ====
bot.command("coach", (ctx) => coachBotHandler.handleCoaching(ctx)); // ✅ Réagit uniquement aux membres
bot.command("profil", profilCommand);
bot.command("modifier_profil", modifierProfilCommand);
bot.command("redemarrer", redemarrerCommand);
pehpahCommand(bot);
bot.command("activer", (ctx) => activerCommand(bot, ctx));

// ✅ Coaching suivant
bot.command("suivant", handleNextDay);
bot.action("next_day", handleNextDay); // inline button

// ✅ Bouton inline pour démarrer le coaching
bot.action("start_coaching", (ctx) => coachBotHandler.handleCoaching(ctx));

// ==== Cron nettoyage fichiers temporaires ====
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

// ==== Lancement du bot et du serveur ====
app.listen(PORT, async () => {
  console.log(`🚀 Serveur Express lancé sur le port ${PORT}`);
  await bot.launch();
});
