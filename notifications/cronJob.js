const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Charger les utilisateurs enregistrés
const usersFile = path.join(__dirname, '../users.json');

/**
 * Envoie un message quotidien à tous les utilisateurs enregistrés.
 */
function sendDailyReminder() {
  if (!fs.existsSync(usersFile)) return;

  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

  for (const userId in users) {
    const user = users[userId];
    const prenom = user.prenom || 'Entrepreneur';

    const message = `👋 Bonjour ${prenom} !\n\nN'oublie pas de faire ta séance de coaching du jour 🧠💪\nTape /coach pour continuer.`;

    bot.telegram.sendMessage(userId, message).catch((err) => {
      console.error(`❌ Échec de l'envoi à l'utilisateur ${userId}:`, err.message);
    });
  }
}

/**
 * Tâche cron planifiée à 08h00 chaque jour (heure serveur).
 */
function scheduleDailyReminder() {
  console.log('⏰ Tâche cron quotidienne programmée à 08:00.');

  cron.schedule('0 8 * * *', () => {
    console.log('📤 Envoi des rappels quotidiens...');
    sendDailyReminder();
  });
}

module.exports = {
  scheduleDailyReminder,
};
