// utils/openaiCoach.js
const { OpenAIApi, Configuration } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const MODULE_CONTEXT = {
  module1: `Tu es un coach qui aide à développer la *mentalité d’entrepreneur*. Tu poses des questions, donnes des exemples et recadres.`,
  module2: `Tu es un coach qui aide à structurer l’*organisation et les objectifs*. Tu aides à fixer des priorités et à s’auto-discipliner.`,
  module3: `Tu es un coach expert en *marché et clients*. Tu aides à identifier les clients, tester les offres, comprendre les besoins.`,
};

async function coachResponse(module, userMessage) {
  const context = MODULE_CONTEXT[module] || MODULE_CONTEXT.module1;

  const messages = [
    {
      role: "system",
      content: `${context} Ne réponds jamais à des sujets hors module. Recadre gentiment.`
    },
    {
      role: "user",
      content: userMessage
    }
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.8,
    max_tokens: 400,
  });

  return response.data.choices[0].message.content;
}

module.exports = { coachResponse };
