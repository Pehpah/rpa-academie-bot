const { Markup } = require("telegraf");
const { checkMembership } = require("../utils/checkMembership");

const CHANNEL_ID = process.env.CHANNEL_ID || "@RichpreneuracademieRPA"; // Remplace par l'@ ou l'ID du canal

module.exports = async function activerCommand(bot, ctx) {
  try {
    const userId = ctx.from.id;
    const chatId = CHANNEL_ID;

    const result = await checkMembership(bot, userId, chatId);

    if (result.success && result.isMember) {
      await ctx.reply(
        `🎉 Bienvenue dans ton espace de coaching RPA interactif !

Tu es bien membre du canal de la RichPreneur Académie. Tu peux maintenant accéder à ta séance quotidienne. Prends une grande inspiration, et clique ci-dessous pour commencer. 💪`,
        Markup.inlineKeyboard([
          Markup.button.callback("🚀 Démarrer le coaching du jour", "start_coaching"),
        ])
      );
    }

    // Silence total si l'utilisateur n'est pas membre
  } catch (error) {
    console.error("❌ Erreur dans la commande /activer :", error);
    // Aucun message envoyé à l'utilisateur en cas d'erreur
  }
};
