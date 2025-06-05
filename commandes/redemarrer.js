// /commandes/redemarrer.js

const fs = require('fs');
const path = require('path');
const { getUserId, getUserFullName } = require('../utils/telegramUtils');

const progressPath = path.join(__dirname, '../progress/progress.json');

/**
 * Commande /redemarrer : réinitialise la progression utilisateur au jour 1.
 */
async function redemarrerCommand(ctx) {
  const userId = getUserId(ctx);
  const fullName = getUserFullName(ctx);

  if (!userId) {
    return ctx.reply("❌ Impossible d'identifier votre profil.");
  }

  // Charger le fichier de progression
  let progress = {};
  if (fs.existsSync(progressPath)) {
    progress = JSON.parse(fs.readFileSync(progressPath, 'utf8'));
  }

  // Réinitialiser la progression pour l'utilisateur
  progress[userId] = {
    jour_max: 1,
    last_completed: null,
    started_at: new Date().toISOString()
  };

  // Enregistrer les changements
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2), 'utf8');

  await ctx.reply(`🔁 Bonjour ${fullName}, ta progression a été réinitialisée. Tu peux recommencer depuis le jour 1. Utilise /coach pour démarrer.`)
}

module.exports = redemarrerCommand;
