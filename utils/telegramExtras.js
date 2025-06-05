const { Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// 1. Envoyer un document
async function sendDocument(ctx, filePath, caption = '') {
  try {
    await ctx.replyWithDocument({ source: fs.createReadStream(filePath) }, { caption });
  } catch (error) {
    console.error('Erreur lors de l’envoi du document :', error.message);
    await ctx.reply("❌ Impossible d’envoyer le fichier.");
  }
}

// 2. Modifier un message existant
async function editMessage(ctx, newText, newButtons = []) {
  try {
    await ctx.editMessageText(newText, {
      reply_markup: Markup.inlineKeyboard(newButtons),
    });
  } catch (error) {
    console.error('❌ Impossible d’éditer le message :', error.message);
  }
}

// 3. Simuler la frappe
async function sendTyping(ctx) {
  try {
    await ctx.sendChatAction('typing');
  } catch (error) {
    console.error('❌ Impossible de simuler la frappe.');
  }
}

// 4. Contexte utilisateur temporaire
const userContext = new Map(); // { userId: { module, step } }

function setUserContext(userId, data) {
  userContext.set(userId, data);
}

function getUserContext(userId) {
  return userContext.get(userId) || null;
}

// 5. Nom formaté
function getFormattedName(ctx) {
  const { first_name, last_name, username } = ctx.from || {};
  const fullName = `${first_name || ''} ${last_name || ''}`.trim();
  return `${fullName}${username ? ` (@${username})` : ''}`;
}

// 6. Timestamp lisible
function getTimestamp() {
  const date = new Date();
  return date.toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// 7. Pagination de boutons
function paginateButtons(list, page = 0, perPage = 5) {
  const totalPages = Math.ceil(list.length / perPage);
  const start = page * perPage;
  const currentButtons = list.slice(start, start + perPage);

  const nav = [];
  if (page > 0) nav.push({ text: '⬅️ Précédent', callback_data: `page_${page - 1}` });
  if (page < totalPages - 1) nav.push({ text: 'Suivant ➡️', callback_data: `page_${page + 1}` });

  return {
    buttons: currentButtons,
    navigation: nav,
    totalPages,
    currentPage: page,
  };
}

// 8. Récupérer fuseau horaire / langue
function getUserTimezone(ctx) {
  return ctx.from?.language_code || 'fr';
}

// 9. Menu dynamique (toggle avec bouton)
const menuContent = [
  [{ text: '🎯 Coach', callback_data: 'menu_coach' }],
  [{ text: '📚 Modules', callback_data: 'menu_modules' }],
  [{ text: '📝 Inscription', callback_data: 'menu_inscription' }],
  [{ text: '💎 Premium', callback_data: 'menu_premium' }],
  [{ text: '❓ FAQ', callback_data: 'menu_faq' }],
  [{ text: '📩 Contact', callback_data: 'menu_contact' }],
  [{ text: '❌ Fermer le menu', callback_data: 'hide_menu' }]
];

async function sendMenuButton(ctx) {
  try {
    await ctx.reply('📋 Ouvre le menu :', {
      reply_markup: Markup.inlineKeyboard([
        [{ text: '📋 Menu', callback_data: 'toggle_menu' }]
      ])
    });
  } catch (error) {
    console.error('❌ Erreur bouton menu :', error.message);
  }
}

async function openMenu(ctx) {
  try {
    await ctx.editMessageReplyMarkup(
      Markup.inlineKeyboard(menuContent).reply_markup
    );
  } catch (error) {
    console.error('❌ Erreur ouverture menu :', error.message);
  }
}

async function closeMenu(ctx) {
  try {
    await ctx.editMessageReplyMarkup(
      Markup.inlineKeyboard([
        [{ text: '📋 Menu', callback_data: 'toggle_menu' }]
      ]).reply_markup
    );
  } catch (error) {
    console.error('❌ Erreur fermeture menu :', error.message);
  }
}

module.exports = {
  sendDocument,
  editMessage,
  sendTyping,
  setUserContext,
  getUserContext,
  getFormattedName,
  getTimestamp,
  paginateButtons,
  getUserTimezone,
  sendMenuButton,
  openMenu,
  closeMenu
};
