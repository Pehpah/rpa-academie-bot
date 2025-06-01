// telegramUtils.js
/**
 * Fonctions utilitaires pour le bot Telegram Telegraf
 */

const { Markup } = require('telegraf');

/**
 * Crée un clavier de boutons inline cliquables à partir d'une liste de boutons.
 * @param {Array<{ text: string, callback_data: string }>} buttons - Liste des boutons.
 * @param {number} [columns=1] - Nombre de colonnes par ligne.
 * @returns {Markup.InlineKeyboardMarkup} - Clavier inline.
 */
function createInlineKeyboard(buttons, columns = 1) {
  const keyboard = [];
  for (let i = 0; i < buttons.length; i += columns) {
    keyboard.push(buttons.slice(i, i + columns));
  }
  return Markup.inlineKeyboard(keyboard);
}

/**
 * Envoie un message avec un clavier inline.
 * @param {Context} ctx - Contexte Telegraf.
 * @param {string} text - Texte du message.
 * @param {Array<{ text: string, callback_data: string }>} buttons - Boutons inline.
 * @param {number} [columns=1] - Nombre de colonnes.
 */
async function sendInlineKeyboard(ctx, text, buttons, columns = 1) {
  const keyboard = createInlineKeyboard(buttons, columns);
  await ctx.reply(text, keyboard);
}

/**
 * Extrait l'identifiant utilisateur d'un contexte.
 * @param {Context} ctx - Contexte Telegraf.
 * @returns {number} - ID Telegram de l'utilisateur.
 */
function getUserId(ctx) {
  return ctx.from?.id || null;
}

/**
 * Extrait le nom complet (prénom + nom) de l'utilisateur.
 * @param {Context} ctx - Contexte Telegraf.
 * @returns {string} - Nom complet.
 */
function getUserFullName(ctx) {
  const firstName = ctx.from?.first_name || '';
  const lastName = ctx.from?.last_name || '';
  return `${firstName} ${lastName}`.trim();
}

module.exports = {
  createInlineKeyboard,
  sendInlineKeyboard,
  getUserId,
  getUserFullName,
};
