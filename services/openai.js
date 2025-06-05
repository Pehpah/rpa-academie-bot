// /services/openai.js

require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askGPT(prompt, options = {}) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "Tu es un coach entrepreneurial bienveillant. Tu donnes des conseils pratiques, motivants, simples et accessibles à des entrepreneurs africains en début de parcours ou en phase de structuration. Tu parles de manière chaleureuse et humaine, sans jargon compliqué.",
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: options.max_tokens || 500,
      temperature: options.temperature || 0.7,
      ...options,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Erreur OpenAI:', error?.message || error);
    return "⚠️ Désolé, je n'ai plus de conseil pour l’instant. Réessaie plus tard.";
  }
}

module.exports = {
  askGPT,
  openai, // Exporté si on a besoin d'accès direct dans openaiCoach.js
};
