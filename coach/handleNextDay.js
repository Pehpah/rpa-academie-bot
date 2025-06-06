const { promptsIndex } = require('./promptsIndex');
const { openaiCoach } = require('../utils/openaiCoach');
const { getUserProgress, updateUserProgress } = require('../progress/progress');
const { getPromptForDay } = require('./coachRouter');

const handleNextDay = async (ctx) => {
  try {
    const userId = ctx.from.id;

    // Récupérer la progression actuelle
    const progress = getUserProgress(userId);
    let currentDay = progress.currentDay || 1;
    const nextDay = currentDay + 1;

    const nextPrompt = getPromptForDay(nextDay);

    if (!nextPrompt) {
      return ctx.reply("🎉 Tu as terminé tout le programme de coaching. Bravo !");
    }

    // Afficher le prompt du jour suivant
    const introMessage = `📅 Jour ${nextDay} - ${nextPrompt.title}\n\n${nextPrompt.intro}`;
    await ctx.reply(introMessage);

    // Obtenir la réponse de l’IA coach
    const gptResponse = await openaiCoach(userId, nextPrompt);
    await ctx.reply(gptResponse);

    // Mettre à jour la progression de l’utilisateur
    updateUserProgress(userId, nextDay);

  } catch (error) {
    console.error("❌ Erreur dans handleNextDay :", error);
    ctx.reply("Une erreur est survenue. Réessaie dans un instant.");
  }
};

module.exports = handleNextDay;
