// /coach/handleFeedback.js

const fs = require('fs');
const path = require('path');
const feedbackFile = path.join(__dirname, '../data/feedback.json');

const handleFeedback = async (ctx) => {
  try {
    const userId = ctx.from.id;
    const message = ctx.message?.text || ctx.update?.callback_query?.data;

    // Extrait uniquement le texte après la commande "/feedback"
    const parts = message.split(' ');
    parts.shift(); // supprime "/feedback"
    const feedbackText = parts.join(' ').trim();

    if (!feedbackText) {
      return ctx.reply("✍️ Merci de nous faire un retour ! Utilise la commande ainsi :\n`/feedback Ton message ici`", { parse_mode: "Markdown" });
    }

    // Charge les anciens feedbacks
    let feedbackList = [];
    if (fs.existsSync(feedbackFile)) {
      const content = fs.readFileSync(feedbackFile, 'utf8');
      feedbackList = JSON.parse(content);
    }

    // Ajoute le nouveau feedback
    feedbackList.push({
      userId,
      username: ctx.from.username || null,
      feedback: feedbackText,
      date: new Date().toISOString()
    });

    // Sauvegarde
    fs.writeFileSync(feedbackFile, JSON.stringify(feedbackList, null, 2));

    await ctx.reply("🙏 Merci pour ton retour, il a bien été enregistré !");
  } catch (error) {
    console.error("❌ Erreur dans handleFeedback :", error);
    ctx.reply("Une erreur est survenue. Essaie encore !");
  }
};

module.exports = handleFeedback;
