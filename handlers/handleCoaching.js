// /coach/handleCoaching.js

const { getUserProgress, updateUserProgress } = require('../progress/progress');
const { getPromptForDay } = require('./coachRouter');
const { openaiCoach } = require('../utils/openaiCoach');

const handleCoaching = async (ctx) => {
  try {
    const userId = ctx.from.id;

    // 🟡 Étape 1 : Vérifie la progression de l’utilisateur
    const progress = await getUserProgress(userId) || { currentDay: 0 };
    const currentDay = progress.currentDay || 0;

    // 🟢 Étape 2 : Si c’est la première fois, on démarre à Jour 1
    const dayToSend = currentDay === 0 ? 1 : currentDay;

    const prompt = getPromptForDay(dayToSend);
    if (!prompt) {
      return ctx.reply("🎉 Tu as déjà terminé tout le programme de coaching. Bravo !");
    }

    // 🔵 Étape 3 : Envoyer le message d’introduction
    const introMessage = `*📅 Jour ${dayToSend} - ${prompt.title}*\n\n${prompt.intro}`;
    await ctx.reply(introMessage, { parse_mode: 'Markdown' });

    // 🟠 Étape 4 : Message de transition
    await ctx.reply("🤖 Je prépare ta séance de coaching...");

    // 🟣 Étape 5 : Génération IA personnalisée
    const gptResponse = await openaiCoach(userId, prompt);
    await ctx.reply(gptResponse);

    // 🟤 Étape 6 : Mise à jour de la progression si jour 1
    if (currentDay === 0) {
      await updateUserProgress(userId, 1);
    }

    // ⚪ Étape 7 : Proposer de continuer
    await ctx.reply("💡 Veux-tu continuer vers le jour suivant ?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "➡️ Poursuivre mon coaching", callback_data: "next_day" }],
        ],
      },
    });

  } catch (error) {
    console.error("❌ Erreur dans handleCoaching :", error);
    ctx.reply("Une erreur est survenue. Réessaie dans un instant.");
  }
};

module.exports = { handleCoaching };
