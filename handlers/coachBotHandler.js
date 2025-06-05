const fs = require('fs');
const path = require('path');
const { promptsIndex } = require('../coach/promptsIndex');
const { openaiCoach } = require('../utils/openaiCoach');
const { getUserProgress, updateUserProgress } = require('../progress/progress');
const { getUserById } = require('../users/users');
const { getPromptForDay } = require('../coach/coachRouter');
const { checkMembership } = require('../utils/checkMembership');

const COACH_CHANNEL = '@RichPreneurAcademie'; // à adapter si l'@ change

const coachBotHandler = async (bot, ctx) => {
  const userId = ctx.from.id;
  const user = getUserById(userId);

  // Étape 1 : Vérifie l'abonnement au canal avant tout
  const membership = await checkMembership(bot, userId, COACH_CHANNEL);
  if (!membership.success || !membership.isMember) {
    return ctx.reply(
      `👋 Tu fais déjà partie du canal gratuit de la RichPreneur Académie !\n\n` +
      `Mais il semble que tu n’aies pas encore activé l’espace interactif.\n\n` +
      `👉 Rejoins le canal ici : https://t.me/${COACH_CHANNEL.replace('@', '')}\n` +
      `Puis reviens ici pour commencer ton coaching.`
    );
  }

  // Étape 2 : Récupération de la progression
  const progress = getUserProgress(userId);
  const currentDay = progress.currentDay || 1;

  // Étape 3 : Chargement du prompt du jour
  const prompt = getPromptForDay(currentDay);
  if (!prompt) {
    return ctx.reply(`📚 Le programme de coaching est terminé ! Félicitations 🎉`);
  }

  // Étape 4 : Construction du message d’introduction
  const introMessage = `📅 Jour ${currentDay} - ${prompt.title}\n\n${prompt.intro}`;

  await ctx.reply(introMessage);

  // Étape 5 : Envoi du contenu de coaching via OpenAI
  const gptResponse = await openaiCoach(userId, prompt);

  // Enregistre la réponse dans /data (historique) si besoin...

  await ctx.reply(gptResponse);

  // Étape 6 : Marquer le jour comme complété dans la progression
  updateUserProgress(userId, currentDay);

  // (optionnel) : Proposer d’enchaîner demain
};

module.exports = { coachBotHandler };
