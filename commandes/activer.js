const { Markup } = require("telegraf");
const { checkMembership } = require("../utils/checkMembership");

const CHANNEL_ID = process.env.CHANNEL_ID || "https://tally.so/r/nPeGr5"; // remplace par ton ID de canal réel si nécessaire

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
    } else {
      await ctx.reply(
        `❌ Pour activer ton coaching RPA, tu dois d'abord rejoindre notre canal officiel.

👉 Clique ici pour le rejoindre : =https://t.me/RichpreneuracademieRPA`,
        { disable_web_page_preview: true }
      );
    }
  } catch (error) {
    console.error("Erreur dans la commande /activer :", error.message);
    await ctx.reply("❌ Une erreur est survenue lors de l’activation de ton coaching. Réessaie plus tard.");
  }
};
