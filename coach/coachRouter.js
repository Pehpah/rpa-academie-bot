// /coach/coachRouter.js

const fs = require('fs');
const path = require('path');
const promptsIndex = require('./promptsIndex');
const missions = require('./missions/dailyChallenges.json');
const { sendInlineKeyboard, getUserId } = require('../utils/telegramUtils');

const PROGRESS_PATH = path.join(__dirname, '../progress/progress.json');
const USERS_PATH = path.join(__dirname, '../users/users.json');

// 🧠 Charge la progression depuis le fichier
function getProgress() {
  if (!fs.existsSync(PROGRESS_PATH)) return {};
  return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf8'));
}

// ✅ Sauvegarde la progression
function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
}

// 🧍 Infos utilisateur
function getUsers() {
  if (!fs.existsSync(USERS_PATH)) return {};
  return JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

// 🧠 Envoie le prompt du jour
async function sendDayPrompt(ctx, dayNumber) {
  const promptData = promptsIndex.coachingDays.find(d => d.day === dayNumber);
  if (!promptData) {
    await ctx.reply(`⛔️ Jour ${dayNumber} introuvable.`);
    return;
  }

  const promptPath = path.join(__dirname, 'prompts', promptData.file);
  const content = fs.readFileSync(promptPath, 'utf8');
  const prompt = JSON.parse(content);

  // Envoie le prompt (titre + contenu + mission)
  await ctx.reply(`📘 *Jour ${dayNumber} – ${prompt.title}*`, { parse_mode: 'Markdown' });
  await ctx.reply(prompt.content);
  await ctx.reply(`🎯 Mission : ${missions[dayNumber]?.mission || "Pas de mission définie."}`);
}

// 👣 Lance le coaching du jour (accessible via bouton ou commande)
async function startDay(ctx, dayNumber) {
  const userId = getUserId(ctx);
  const progress = getProgress();

  if (!progress[userId]) {
    // Initialisation
    progress[userId] = {
      dayMax: 1,
      completed: [],
      inscription: new Date().toISOString(),
      demo: true // version démo active par défaut
    };
  }

  const userProg = progress[userId];

  // Bloque l’accès si on veut aller plus vite que dayMax
  if (dayNumber > userProg.dayMax) {
    await ctx.reply(`⛔️ Jour verrouillé 🔒. Revenez demain.`);
    return;
  }

  // Empêche de refaire un jour terminé sans rattrapage explicite
  if (userProg.completed.includes(dayNumber)) {
    await ctx.reply(`✅ Jour ${dayNumber} déjà complété. Utilisez /rattraper pour revoir.`);
    return;
  }

  // Envoie le prompt du jour
  await sendDayPrompt(ctx, dayNumber);

  // Marque ce jour comme terminé seulement *si mission validée*
  // 🔒 Tu peux ajouter plus tard une vérification "réponse reçue" ici
  userProg.completed.push(dayNumber);
  if (dayNumber === userProg.dayMax && dayNumber < 21) {
    userProg.dayMax += 1;
  }

  // Fin version démo
  if (userProg.dayMax > 3 && userProg.demo === true) {
    await ctx.reply("🎁 Fin de la version démo (3 jours). Active ton programme complet pour continuer.");
    return;
  }

  progress[userId] = userProg;
  saveProgress(progress);
}

// 🧾 Commande spéciale pour rattraper un jour précédent
async function retryDay(ctx, dayNumber) {
  const userId = getUserId(ctx);
  const progress = getProgress();

  if (!progress[userId]) {
    await ctx.reply("Inscription non trouvée.");
    return;
  }

  const userProg = progress[userId];

  if (dayNumber > userProg.dayMax) {
    await ctx.reply(`⛔️ Tu n'as pas encore atteint le jour ${dayNumber}.`);
    return;
  }

  await ctx.reply(`🔁 Rattrapage du jour ${dayNumber} :`);
  await sendDayPrompt(ctx, dayNumber);
}

module.exports = {
  startDay,
  retryDay
};
