// services/openaiService.js

require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * Pose une question à GPT-3.5-turbo et retourne la réponse texte.
 * @param {string} prompt - Le texte de la question ou instruction.
 * @param {object} options - Options facultatives (max_tokens, temperature, etc.)
 * @returns {Promise<string>} - Réponse texte générée par GPT.
 */
async function askGPT(prompt, options = {}) {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Tu es un coach entrepreneurial qui guide avec bienveillance.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: options.max_tokens || 500,
      temperature: options.temperature || 0.7,
      ...options,
    });

    const answer = response.data.choices[0].message.content.trim();
    return answer;
  } catch (error) {
    console.error('Erreur OpenAI:', error.response ? error.response.data : error.message);
    return "Désolé, je n'ai pas pu traiter ta demande pour le moment.";
  }
}

module.exports = {
  askGPT,
};
