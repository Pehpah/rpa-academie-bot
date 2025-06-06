module.exports = function (bot) {
  bot.action('register', async (ctx) => {
    try {
      await ctx.answerCbQuery(); // Ferme le "chargement" du bouton

      await ctx.reply(
        "✅ Bienvenue dans l’espace RPA Coaching !\n\n🎯 Pour créer ton compte et débloquer ton accompagnement personnalisé,\nclique sur l’un des boutons ci-dessous 👇",
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "🚀 Commencer le coaching", callback_data: "start_coaching" }],
              [{ text: "➡️ Continuer vers le jour suivant", callback_data: "next_day" }]
            ]
          }
        }
      );
    } catch (err) {
      console.error('❌ Erreur dans action register :', err);
    }
  });
};
