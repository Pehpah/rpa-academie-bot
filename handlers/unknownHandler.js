require('dotenv').config();

module.exports = function (bot) {
  const CHANNEL_ID = process.env.CANAL_ID;

  if (!CHANNEL_ID) {
    console.error("❌ Erreur : CANAL_ID n'est pas défini dans .env");
    return;
  }

  // ➤ 1. Message inconnu reçu
  bot.on('message', async (ctx) => {
    try {
      const userId = ctx.from.id;

      // Vérifie si l'utilisateur est membre du canal gratuit
      let member;
      try {
        member = await ctx.telegram.getChatMember(CHANNEL_ID, userId);
      } catch (err) {
        console.error('🔒 Impossible de vérifier l’abonnement au canal :', err);
        return; // Sort de la fonction si vérification échoue
      }

      // Si l'utilisateur est déjà membre, ne rien envoyer
      if (member.status === 'member' || member.status === 'administrator' || member.status === 'creator') {
        return;
      }

      // Sinon, proposer de rejoindre le canal
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
    } catch (error) {
      console.error('❌ Erreur dans unknownHandler (message) :', error);
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
        '3. Comment se passent les formations ?\n\n' +
        '👉 Clique sur *Activer mon espace RPA* pour vivre l’expérience toi-même !',
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      console.error('❌ Erreur dans action faq_unknown :', error);
    }
  });
};
