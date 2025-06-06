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
const handleNextDay = require("./coach/handleNextDay");
const { handleCoaching } = require("./coach/handleCoaching");
const handleFeedback = require("./coach/handleFeedback");
registerHandler(bot);

// ==== Commandes ====
const profilCommand = require("./commandes/profil");
const redemarrerCommand = require("./commandes/redemarrer");
const pehpahCommand = require("./commandes/pehpah");
const activerCommand = require("./commandes/activer");

// ==== Utilitaires ====
const { cleanOldFiles } = require("./utils/fileCleaner");

// ==== Cron automatique ====
const coachingCronjob = require("./notifications/cronjob");

// ==== Initialisation des handlers ====
welcomeHandler(bot);
unknownHandler(bot);

// ==== Commandes Telegram ====
bot.command("coach", (ctx) => coachBotHandler.handleCoaching(ctx));
bot.command("coaching", (ctx) => coachBotHandler.handleCoaching(ctx));
bot.command("profil", profilCommand);
bot.command("redemarrer", redemarrerCommand);
pehpahCommand(bot);
bot.command("activer", (ctx) => activerCommand(bot, ctx));
bot.command("suivant", handleNextDay); // Avance dans le coaching

// ==== Boutons inline ====
bot.action("activate_coaching", handleCoaching);
bot.action("start_coaching", (ctx) => coachBotHandler.handleCoaching(ctx));
bot.action("next_day", handleNextDay);

// ==== Nettoyage fichiers temporaires ====
cleanOldFiles(); // nettoyage immédiat
setInterval(() => {
  console.log("🧹 Nettoyage automatique des fichiers obsolètes...");
  cleanOldFiles();
}, 24 * 60 * 60 * 1000); // toutes les 24h

// ==== Notifications coaching (à 9h du matin, via cronjob) ====
coachingCronjob.start();

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

// ==== Lancement du bot ====
app.listen(PORT, async () => {
  console.log(`🚀 Serveur Express lancé sur le port ${PORT}`);
  await bot.launch();
});
