// utils/openaiCoach.js

const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

// ✅ Compatible openai@4.x
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 📌 Astuces bonus inspirantes
const TIPS = [
  "📌 Astuce : la loi de Pareto dit que 20% de tes actions apportent 80% des résultats. Concentre-toi sur l’essentiel.",
  "🎯 Conseil : commence chaque journée avec 1 action essentielle, même petite, qui fait avancer ton activité.",
  "💡 Exercice : décris ton client idéal avec 3 adjectifs, un prénom, un besoin clair. Ça t’aidera à mieux communiquer.",
  "📈 Astuce : n’attends pas d’être prêt à 100%. Lance-toi à 70% et ajuste en chemin.",
  "🛠️ Conseil : ce qui n’est pas planifié ne se fait pas. Utilise un agenda pour bloquer ton temps.",
  "🧠 Astuce : une idée claire vaut mieux que mille idées floues. Clarifie ton offre en 1 phrase.",
  "🗣️ Exercice : explique ton activité à un enfant de 10 ans. Si c’est clair pour lui, c’est clair pour tout le monde.",
  "🚀 Conseil : fais d’abord ce qui te fait peur. C’est souvent là que tu progresseras le plus.",
  "📊 Astuce : suis tes revenus et tes dépenses chaque semaine. La clarté financière booste ta stratégie.",
  "🧭 Conseil : reviens chaque semaine à ton 'Pourquoi'. Il te guidera dans les moments de doute.",
  "🔍 Astuce : observe 3 concurrents. Que font-ils de bien ? Que peux-tu améliorer dans ta propre offre ?",
  "💬 Exercice : appelle un ancien client ou prospect. Demande-lui un retour sincère sur ton service.",
  "⏱️ Conseil : le temps est ta monnaie. Priorise ce qui t’approche de ton objectif chaque jour.",
  "🌱 Astuce : l’entrepreneuriat est un marathon, pas un sprint. Préserve ton énergie mentale.",
  "📚 Conseil : lis 10 pages par jour d’un bon livre business. En 1 mois, ta vision changera.",
  "📝 Exercice : écris ce que tu veux accomplir ce mois-ci. Relis-le chaque lundi matin.",
  "🧩 Astuce : simplifie ton offre. Trop d’options = confusion. Une seule offre claire vaut mieux que 10 floues.",
  "👥 Conseil : entoure-toi d’autres entrepreneurs motivés. L’énergie est contagieuse.",
  "🎙️ Exercice : enregistre un vocal de 1 min expliquant ton produit. Réécoute-le et améliore-le.",
  "🎯 Astuce : choisis une seule chose à améliorer cette semaine. Et fais-le à fond.",
  "📅 Conseil : chaque dimanche, planifie ta semaine. Tu maîtriseras mieux ton agenda que lui ne te maîtrise.",
  "🛎️ Rappel : ne compare pas ton chapitre 1 au chapitre 10 de quelqu’un d’autre. Avance à ton rythme."
];

// 🎯 Défis quotidiens par module
const DAILY_CHALLENGES = require("../coach/missions/dailyChallenges.json");

// 📥 Chargement du prompt quotidien
function loadDailyPrompt(day) {
  try {
    const filePath = path.join(__dirname, `../prompts/${day}.json`);
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.warn(`⚠️ Prompt pour "${day}" introuvable. Utilisation d'un message générique.`);
    return {
      system:
        "Tu es un coach entrepreneurial bienveillant. Donne des conseils simples et motivants à des entrepreneurs africains.",
      user: "Bonjour coach, je suis prêt pour ma séance !",
    };
  }
}

// 🧾 Résumé synthétique des échanges
function generateSummary(module, logs) {
  return `🧾 Résumé du module ${module} :
- Messages échangés : ${logs.length}
- Dernier message : "${logs.at(-1)?.userMessage?.slice(0, 60)}..."
- Blocages notés : à identifier selon les réponses
➡️ Continue comme ça !`;
}

// 💬 Réponse IA principale avec log et bonus
async function coachResponse({ module, day, userMessage, userId, tone = "motivant", persona = {} }) {
  const prompt = loadDailyPrompt(day);

  const systemMessage = `${prompt.system}
Tu parles à ${persona.prénom || "l’entrepreneur"} qui est ${persona.type || "débutant"} et souhaite ${persona.objectif || "développer son activité"}.
Adopte un ton ${tone}, bienveillant et structuré. Utilise parfois des listes, des tableaux ou des exemples.`;

  const messages = [
    { role: "system", content: systemMessage },
    { role: "user", content: userMessage || prompt.user },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.8,
    max_tokens: 500,
  });

  const aiReply = completion.choices[0].message.content.trim();
  const bonusTip = TIPS[Math.floor(Math.random() * TIPS.length)];
  const finalReply = `${aiReply}\n\n${bonusTip}`;

  // Enregistrement dans un journal utilisateur
  const logPath = path.join(__dirname, `../logs/${userId}_${day}.json`);
  let history = [];
  if (fs.existsSync(logPath)) {
    history = JSON.parse(fs.readFileSync(logPath));
  }
  history.push({ userMessage, aiReply, date: new Date().toISOString() });
  fs.writeFileSync(logPath, JSON.stringify(history, null, 2));

  return finalReply;
}

// 🎯 Défi quotidien personnalisé
function dailyChallenge(module) {
  const challenges = DAILY_CHALLENGES[module] || [];
  return challenges.length > 0
    ? challenges[Math.floor(Math.random() * challenges.length)]
    : "Pas de mission aujourd’hui 😌";
}

// 📊 Résumé global d’un utilisateur
function coachingSummary(userId) {
  const logsDir = path.join(__dirname, "../logs");
  const files = fs.readdirSync(logsDir).filter((f) => f.startsWith(userId));
  if (files.length === 0) return "Aucune séance enregistrée pour cet utilisateur.";

  let totalMessages = 0;
  const summary = files.map((file) => {
    const content = JSON.parse(fs.readFileSync(path.join(logsDir, file)));
    totalMessages += content.length;
    return generateSummary(file.split("_")[1].replace(".json", ""), content);
  });

  return `📋 Bilan des échanges pour ${userId} :
Total de séances : ${files.length}
Total de messages : ${totalMessages}

${summary.join("\n\n")}`;
}

module.exports = {
  coachResponse,
  dailyChallenge,
  coachingSummary,
};
