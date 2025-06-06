const fs = require('fs');
const path = require('path');
const { promptsIndex } = require('./promptsIndex');
const { openaiCoach } = require('../utils/openaiCoach');
const { getPromptForDay } = require('./coachRouter');

// 🔧 Chemin du fichier JSON
const progressPath = path.join(__dirname, '../progress/progress.json');

// 🧠 Fonction pour lire le fichier
const readProgress = () => {
  if (!fs.existsSync(progressPath)) return {};
  const raw = fs.readFileSync(progressPath, 'utf-8');
  return JSON.parse(raw);
};

// 💾 Fonction pour écrire
const writeProgress = (data) => {
  fs.writeFileSync(progressPath, JSON.stringify(data, null, 2));
};

const handleNextDay = async (ctx) => {
  try {
    const userId = String(ctx.from.id);
    const progressData = readProgress();

    const currentDay = progressData[userId]?.currentDay || 1;
    const nextDay = currentDay + 1;

    const nextPrompt = getPromptForDay(nextDay);

    if (!nextPrompt) {
      return ctx.reply("🎉 Tu as terminé tout le programme de coaching. Bravo !");
    }

    // 🎯 Afficher l’introduction
    const introMessage = `📅 Jour ${nextDay} - ${nextPrompt.title}\n\n${nextPrompt.intro}`;
    await ctx.reply(introMessage);

    // 🤖 Coach IA
    const gptResponse = await openaiCoach(userId, nextPrompt);
    await ctx.reply(gptResponse);

    // ✅ Mise à jour
    progressData[userId] = {
      currentDay: nextDay,
      lastCompletedAt: new Date().toISOString(),
    };
    writeProgress(progressData);

  } catch (error) {
    console.error("❌ Erreur dans handleNextDay :", error);
    ctx.reply("Une erreur est survenue. Réessaie dans un instant.");
  }
};

module.exports = handleNextDay;
