const { OpenAIApi, Configuration } = require("openai");
const fs = require("fs");
const path = require("path");

// Configuration OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Contexte par module
const MODULE_CONTEXT = {
  module1: `Tu es un coach qui aide à développer la *mentalité d’entrepreneur*. Tu poses des questions, donnes des exemples et recadres.`,
  module2: `Tu es un coach qui aide à structurer l’*organisation et les objectifs*. Tu aides à fixer des priorités et à s’auto-discipliner.`,
  module3: `Tu es un coach expert en *marché et clients*. Tu aides à identifier les clients, tester les offres, comprendre les besoins.`,
};

// Micro-ressources
const TIPS = [
  "📌 Astuce : la loi de Pareto dit que 20% de tes actions apportent 80% des résultats. Concentre-toi sur l’essentiel.",
  "🎯 Conseil : commence chaque journée avec 1 action essentielle, même petite, qui fait avancer ton activité.",
  "💡 Exercice : décris ton client idéal avec 3 adjectifs, un prénom, un besoin clair. Ça t’aidera à mieux communiquer.",
];

// Daily challenges simples
const DAILY_CHALLENGES = {
  module1: [
    "Demande à un ami : 'Quel est mon plus gros talent selon toi ?'",
    "Note 3 raisons pour lesquelles tu veux réussir.",
  ],
  module2: [
    "Écris une TODO list avec seulement 3 priorités pour demain.",
    "Crée une mini-routine du matin (10 min) à tenir pendant 7 jours.",
  ],
  module3: [
    "Pose 3 questions à un potentiel client aujourd’hui.",
    "Fais une publication ou audio pour tester ton offre sur WhatsApp ou Facebook.",
  ],
};

// Résumé synthétique pour le suivi (exemple)
function generateSummary(module, logs) {
  return `🧾 Résumé du module ${module} :
- Messages échangés : ${logs.length}
- Dernier message : "${logs.at(-1)?.userMessage.slice(0, 60)}..."
- Blocages notés : à identifier selon les réponses
➡️ Continue comme ça !`;
}

// Fonction principale
async function coachResponse({ module, userMessage, userId, tone = "motivant", persona = {} }) {
  const context = MODULE_CONTEXT[module] || MODULE_CONTEXT.module1;
  const logPath = path.join(__dirname, `../logs/${userId}_${module}.json`);

  // Récupération des anciens logs (locaux)
  let history = [];
  if (fs.existsSync(logPath)) {
    const raw = fs.readFileSync(logPath);
    history = JSON.parse(raw);
  }

  // Génération du prompt
  const messages = [
    {
      role: "system",
      content: `${context} Tu t’adresses à un entrepreneur nommé ${persona.prénom || "Utilisateur"}.
Il est ${persona.type || "en cours de lancement"} et souhaite ${persona.objectif || "mieux structurer son activité"}.
Adopte un ton ${tone}. Ne réponds jamais à des sujets hors module. Recadre gentiment. Utilise parfois des tableaux, listes ou exemples.`,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.8,
    max_tokens: 500,
  });

  const aiReply = response.data.choices[0].message.content;

  // Ajout d’un conseil bonus aléatoire
  const bonusTip = TIPS[Math.floor(Math.random() * TIPS.length)];
  const finalReply = `${aiReply}\n\n${bonusTip}`;

  // Enregistrement local du log
  history.push({ userMessage, aiReply, date: new Date().toISOString() });
  fs.writeFileSync(logPath, JSON.stringify(history, null, 2));

  return finalReply;
}

// Génération d’un challenge quotidien
function dailyChallenge(module) {
  const challenges = DAILY_CHALLENGES[module] || [];
  return challenges.length > 0
    ? challenges[Math.floor(Math.random() * challenges.length)]
    : "Pas de mission aujourd’hui 😌";
}

// Résumé coaching d’un utilisateur
function coachingSummary(userId, module) {
  const logPath = path.join(__dirname, `../logs/${userId}_${module}.json`);
  if (!fs.existsSync(logPath)) return "Aucun historique trouvé.";
  const logs = JSON.parse(fs.readFileSync(logPath));
  return generateSummary(module, logs);
}

module.exports = {
  coachResponse,
  dailyChallenge,
  coachingSummary,
};
