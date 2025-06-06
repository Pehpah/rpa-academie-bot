// /bot/coachBotHandler.js

const { handleCoaching } = require('../coach/handleCoaching');
const { handleNextDay } = require('../coach/handleNextDay');
const { handleFeedback } = require('../coach/handleFeedback');
const registerActions = require('../bot/actions');

const coachBotHandler = (bot) => {
  // 🔁 Enregistre toutes les actions inline
  registerActions(bot);

  // 🔹 Commande /start ou démarrage initial (à personnaliser si besoin)
  bot.start(async (ctx) => {
    await ctx.reply(
      `👋 Bienvenue dans le programme RPA Coaching !\n\nCe programme va t’accompagner chaque jour pour progresser.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🚀 Activer mon coaching", callback_data: "activate_coaching" }],
          ],
        },
      }
    );
  });

  // 🔹 Commande /coaching → démarre ou reprend là où il s’est arrêté
  bot.command('coaching', handleCoaching);

  // 🔹 Commande /nextday (optionnelle, mais utile pour debug)
  bot.command('nextday', handleNextDay);

  // 🔹 Commande /feedback → laisse un retour (optionnel)
  bot.command('feedback', handleFeedback);
};

module.exports = coachBotHandler;
