// handlers/registerHandler.js

module.exports = function (bot) {
  bot.action('register', async (ctx) => {
    try {
      await ctx.answerCbQuery(); // Ferme le "chargement" du bouton

      await ctx.reply(
        '✅ Bienvenue dans l’espace *RPA Coaching* !\n\n' +
        '🎯 Pour créer ton compte et débloquer ton accompagnement personnalisé,\n' +
        'clique sur le bouton ci-dessous 👇',
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🚀 Créer mon compte maintenant', url: 'https://tally.so/r/3jYky1' }]
            ]
          }
        }
      );
    } catch (err) {
      console.error('❌ Erreur dans action register :', err);
    }
  });
};
