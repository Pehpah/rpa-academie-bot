require('dotenv').config();

module.exports = function (bot) {
  const CHANNEL_ID = process.env.CANAL_ID;

  if (!CHANNEL_ID) {
    console.error("❌ Erreur : CANAL_ID n'est pas défini dans .env");
    return;
  }

  // ➤ 1. Message reçu : vérifie l’abonnement et répond
  bot.on('message', async (ctx) => {
    try {
      const userId = ctx.from.id;

      // Vérifie si l'utilisateur est membre du canal
      let member;
      try {
        member = await ctx.telegram.getChatMember(CHANNEL_ID, userId);
      } catch (err) {
        console.error('🔒 Impossible de vérifier l’abonnement au canal :', err);
        return; // On sort si erreur lors de la vérification
      }

      // S’il est bien membre
      if (['member', 'administrator', 'creator'].includes(member.status)) {
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
      } else {
        // Sinon, il doit rejoindre le canal
        await ctx.reply(
          '🚨 Il semble que tu n’aies pas encore rejoint le canal *RP Académie Gratuit*.\n' +
          'Tu dois y entrer pour débloquer ton espace de coaching 🚀',
          {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{ text: '🔓 Rejoindre le canal gratuit', url: 'https://t.me/RichpreneuracademieRPA' }],
                [{ text: '❓ FAQ / Besoin d’aide', callback_data: 'faq_unknown' }]
              ]
            }
          }
        );
      }
    } catch (error) {
      console.error('❌ Erreur dans le handler message :', error);
    }
  });

  // ➤ 2. Bouton FAQ
  bot.action('faq_unknown', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.reply(
        '📌 *Foire Aux Questions (FAQ)*\n\n' +
        '1. Qui peut rejoindre la RPA ?\n' +
        '2. Est-ce que c’est vraiment gratuit ?\n' +
        '3. Comment se passent les formations et coachings ?\n\n' +
        '👉 Clique sur *Rejoindre le canal gratuit* pour vivre l’expérience toi-même !',
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      console.error('❌ Erreur dans action faq_unknown :', error);
    }
  });
};
