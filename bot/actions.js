// /bot/actions.js

const { handleCoaching } = require('../coach/handleCoaching');
const { handleNextDay } = require('../coach/handleNextDay');

module.exports = function registerActions(bot) {

  // 🎯 Action : Activation du coaching
  bot.action('activate_coaching', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.reply(
        '🎉 Félicitations ! Ton espace RPA coaching est maintenant activé.\n\nClique sur "Commencer" pour recevoir ton premier jour de coaching.',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '▶️ Commencer', callback_data: 'start_coaching' }]
            ]
          }
        }
      );
    } catch (error) {
      console.error("❌ Erreur dans activate_coaching :", error);
      await ctx.reply("Une erreur est survenue pendant l'activation.");
    }
  });

  // 🎯 Action : Commencer le coaching (jour 1)
  bot.action('start_coaching', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await handleCoaching(ctx); // → lancement du coaching (jour 1)
    } catch (error) {
      console.error("❌ Erreur dans start_coaching :", error);
      await ctx.reply("Impossible de démarrer le coaching pour le moment.");
    }
  });

  // 🎯 Action : Continuer coaching (jours suivants)
  bot.action('next_day', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await handleNextDay(ctx); // → coaching pour jour suivant
    } catch (error) {
      console.error("❌ Erreur dans next_day :", error);
      await ctx.reply("Impossible de continuer le coaching pour le moment.");
    }
  });

};
