const { getUserProgress, updateUserProgress } = require('../progress/progress');
const { getPromptForDay } = require('../coach/coachRouter');
const { openaiCoach } = require('../utils/openaiCoach');

const handleCoaching = async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Récupérer la progression actuelle (si aucune, commencer à 1)
    const progress = await getUserProgress(userId) || { currentDay: 0 };
    let currentDay = progress.currentDay || 0;

    // Si pas encore commencé, on démarre au jour 1, sinon on reprend au jour courant
    const dayToSend = currentDay === 0 ? 1 : currentDay;

    const prompt = getPromptForDay(dayToSend);

    if (!prompt) {
      return ctx.reply("🎉 Tu as déjà terminé tout le programme de coaching. Bravo !");
    }

    // Message d’intro
    const introMessage = `*📅 Jour ${dayToSend} - ${prompt.title}*\n\n${prompt.intro}`;
    await ctx.reply(introMessage, { parse_mode: 'Markdown' });

    // Message d'attente avant la réponse IA
    await ctx.reply("🤖 Je prépare ta séance de coaching...");

    // Obtenir la réponse de l’IA coach
    const gptResponse = await openaiCoach(userId, prompt);
    await ctx.reply(gptResponse);

    // Si c’est le premier jour, on enregistre la progression à 1
    if (currentDay === 0) {
      await updateUserProgress(userId, 1);
    }

    // Proposer bouton inline pour continuer au jour suivant
    await ctx.reply("Veux-tu continuer ?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "➡️ Continuer vers le jour suivant", callback_data: "next_day" }],
        ],
      },
    });

  } catch (error) {
    console.error("❌ Erreur dans handleCoaching :", error);
    ctx.reply("Une erreur est survenue. Réessaie dans un instant.");
  }
};

module.exports = { handleCoaching };
