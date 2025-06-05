// /coach/checkAccess.js

const fs = require('fs');
const path = require('path');

const PROGRESS_PATH = path.join(__dirname, '../progress/progress.json');
const MISSIONS_PATH = path.join(__dirname, './missions/dailyChallenges.json');

/**
 * Charge la progression utilisateur depuis le fichier.
 */
function getProgress() {
  if (!fs.existsSync(PROGRESS_PATH)) return {};
  return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf8'));
}

/**
 * Vérifie si l'utilisateur peut accéder au jour demandé.
 * @param {number} userId - ID Telegram.
 * @param {number} day - Numéro du jour demandé.
 * @returns {{ allowed: boolean, reason?: string }}
 */
function canAccessDay(userId, day) {
  const progress = getProgress();
  const user = progress[userId];

  if (!user) {
    return { allowed: false, reason: "🚫 Utilisateur non inscrit." };
  }

  // 🛑 Si jour demandé dépasse le jour maximum
  if (day > user.dayMax) {
    return { allowed: false, reason: "🔒 Ce jour n'est pas encore débloqué. Revenez demain." };
  }

  // 🛑 Si la mission du jour précédent n’a pas été complétée
  const previousDay = day - 1;
  const missionRequired = previousDay >= 1;
  const missionDone = !missionRequired || user.missions?.[previousDay];

  if (!missionDone) {
    return { allowed: false, reason: `📝 Merci de répondre à la mission du jour ${previousDay} avant de continuer.` };
  }

  // 🛑 Limite de la version démo (3 jours max)
  if (user.demo && day > 3) {
    return {
      allowed: false,
      reason: "🚧 Tu as atteint la fin de la démo gratuite. Active la version complète pour continuer."
    };
  }

  return { allowed: true };
}

/**
 * Sauvegarde qu’une mission a été complétée.
 * @param {number} userId - ID Telegram.
 * @param {number} day - Jour correspondant à la mission.
 * @param {string} response - Réponse de l’utilisateur.
 */
function saveMissionResponse(userId, day, response) {
  const progress = getProgress();
  if (!progress[userId]) return;

  if (!progress[userId].missions) progress[userId].missions = {};
  progress[userId].missions[day] = response;
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(progress, null, 2));
}

module.exports = {
  canAccessDay,
  saveMissionResponse
};
