const { promptsIndex } = require('../coach/promptsIndex');
const { openaiCoach } = require('../utils/openaiCoach');
const { getUserProgress, updateUserProgress } = require('../progress/progress');
const { getUserById } = require('../users/users');
const { getPromptForDay } = require('../coach/coachRouter');
const { checkMembership } = require('../utils/checkMembership');

const COACH_CHANNEL = '@RichPreneurAcademie';

const handleCoaching = async (ctx) => {
  try {
    const userId = ctx.from.id;

    // 1. Vérifie l’abonnement : si non abonné => silence total
    const membership = await checkMembership(ctx.telegram, userId, COACH_CHANNEL);
    if (!membership.success || !membership.isMember) {
      return; // Silence total pour les non-membres
    }

    // 2. Récupération de la progression
    const progress = getUserProgress(userId);
    const currentDay = progress.currentDay || 1;

    // 3. Récupération du prompt du jour
    const prompt = getPromptForDay(currentDay);
    if (!prompt) {
      return ctx.reply(`📚 Le programme de coaching est terminé ! Félicitations 🎉`);
    }

    // 4. Message d’introduction
    const introMessage = `📅 Jour ${currentDay} - ${prompt.title}\n\n${prompt.intro}`;
    await ctx.reply(introMessage);

    // 5. Génération du contenu personnalisé via OpenAI
    const gptResponse = await openaiCoach(userId, prompt);
    await ctx.reply(gptResponse);

    // 6. Mise à jour de la progression
    updateUserProgress(userId, currentDay);
  } catch (error) {
    console.error("❌ Erreur dans handleCoaching :", error);
    ctx.reply("Une erreur est survenue. Réessaie plus tard.");
  }
};

module.exports = { handleCoaching };
