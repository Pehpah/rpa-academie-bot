// coachBotHandler.js

const { coachResponse, dailyChallenge, coachingSummary } = require('../utils/openaiCoach');
const { sendDayPrompt, startDay } = require('./coachRouter');
const { getUserId } = require('../utils/telegramUtils');
const fs = require('fs');
const path = require('path');

const { Markup } = require("telegraf");
const openaiCoach = require("../services/openaiCoach");


const CANAL_ID = process.env.CANAL_ID || "@richpreneur_academie"; // à définir dans .env

// Étape 1 : Commande /coach
async function handleCoachCommand(ctx) {
  try {
    const userId = ctx.from.id;
    const chatMember = await ctx.telegram.getChatMember(CANAL_ID, userId);

    if (["member", "administrator", "creator"].includes(chatMember.status)) {
      await ctx.reply(
        "👋 Tu fais déjà partie du canal gratuit de la RichPreneur Académie !\nMais il semble que tu n’aies pas encore activé l’espace interactif.",
        Markup.inlineKeyboard([
          [Markup.button.callback("✅ Activer mon espace coaching RPA", "activer_espace_coaching")],
          [Markup.button.callback("📚 Voir les contenus du canal", "voir_contenus")],
        ])
      );
    }

    // Si l'utilisateur n'est pas membre, on ne dit rien (unknownHandler s'en occupe)

  } catch (error) {
    console.error("Erreur dans /coach :", error);
    ctx.reply("");
  }
}

// Étape 2 : Activation de l’espace coaching
async function handleCoaching(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(
    "🎯 Bienvenue dans l’espace Coaching RPA",
    Markup.inlineKeyboard([
      [Markup.button.callback("✅ Commencer le coaching", "commencer_coaching")],
    ])
  );
}

// Étape 3 : Connexion au module OpenAI Coach
async function handleStartCoaching(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply("🤖 Préparation de ta première session de coaching...");
  await openaiCoach.startConversation(ctx);
}

// Initialisation dans le bot
function setup(bot) {
  bot.command("coach", handleCoachCommand);

  bot.action("activer_espace_coaching", handleCoaching);

  bot.action("voir_contenus", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply("📚 Tu peux voir tous les contenus ici : https://t.me/richpreneur_academie");
  });

  bot.action("commencer_coaching", handleStartCoaching);
}

module.exports = {
  setup,
  handleCoaching,
};



const PROGRESS_PATH = path.join(__dirname, '../progress/progress.json');

// 🔁 Charge la progression
function getProgress() {
  if (!fs.existsSync(PROGRESS_PATH)) return {};
  return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf8'));
}

// ✅ Sauvegarde la progression
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
}

// 🎯 Gestion des messages utilisateurs pendant le coaching
async function handleUserMessage(ctx) {
  const userId = getUserId(ctx);
  const progress = getProgress();

  const userProgress = progress[userId];
  if (!userProgress) {
    await ctx.reply("🚨 Tu n'es pas encore inscrit.e. Utilise /start pour commencer.");
    return;
  }

  const day = userProgress.dayMax;
  const module = Math.ceil(day / 7); // 7 jours = 1 module

  const persona = {
    prénom: ctx.from.first_name || "entrepreneur",
    type: "débutant",
    objectif: "structurer son activité",
  };

  const userMessage = ctx.message.text;

  const response = await coachResponse({
    module,
    day,
    userMessage,
    userId,
    tone: "bienveillant",
    persona,
  });

  await ctx.reply(response);
}

// 🚀 Commande /coach – relance le jour actuel
async function handleCoachCommand(ctx) {
  const userId = getUserId(ctx);
  const progress = getProgress();

  const userProgress = progress[userId];
  if (!userProgress) {
    await ctx.reply("📝 Tu dois d'abord t'inscrire avec /start.");
    return;
  }

  const day = userProgress.dayMax;
  await startDay(ctx, day);
}

// 🔄 Commande /rattraper – revoir un jour déjà complété
async function handleRattraper(ctx, dayParam) {
  const userId = getUserId(ctx);
  const progress = getProgress();

  const day = parseInt(dayParam, 10);
  if (isNaN(day) || day < 1 || day > 21) {
    await ctx.reply("❌ Numéro de jour invalide. Utilise `/rattraper 3` pour revoir le jour 3.", {
      parse_mode: 'Markdown',
    });
    return;
  }

  const userProgress = progress[userId] || {};
  if (!userProgress.completed?.includes(day)) {
    await ctx.reply("⚠️ Ce jour n’a pas encore été complété. Utilise /coach pour avancer.");
    return;
  }

  await sendDayPrompt(ctx, day);
}

// 📊 Commande /bilan – résumé du parcours utilisateur
async function handleBilan(ctx) {
  const userId = getUserId(ctx);
  const summary = coachingSummary(userId);
  await ctx.reply(summary);
}

module.exports = {
  handleUserMessage,
  handleCoachCommand,
  handleRattraper,
  handleBilan,
};
