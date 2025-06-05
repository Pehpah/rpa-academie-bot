// utils/checkMembership.js

/**
 * Vérifie si un utilisateur est membre d’un canal ou groupe donné.
 * @param {Telegraf} bot - Instance du bot Telegraf.
 * @param {number|string} userId - ID de l’utilisateur à vérifier.
 * @param {number|string} chatId - ID du canal/groupe à vérifier.
 * @returns {Promise<Object>} - Résultat de la vérification.
 */
async function checkMembership(bot, userId, chatId) {
  try {
    const member = await bot.telegram.getChatMember(chatId, userId);
    const status = member.status;

    // L’utilisateur est considéré comme "membre" s’il a un rôle actif
    const isMember = ['creator', 'administrator', 'member', 'restricted'].includes(status);

    return {
      success: true,
      isMember,
      status,
      userId,
      chatId,
      raw: member, // optionnel : utile pour débogage ou affichage
    };
  } catch (error) {
    console.error(`❌ Erreur checkMembership pour user ${userId} dans ${chatId} :`, error.message);

    return {
      success: false,
      isMember: false,
      status: 'unknown',
      error: error.message,
      userId,
      chatId,
    };
  }
}

module.exports = { checkMembership };
