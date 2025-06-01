// checkMembership.js
async function checkMembership(bot, userId, chatId) {
  try {
    const member = await bot.telegram.getChatMember(chatId, userId);
    const status = member.status;
    const isMember = ['creator', 'administrator', 'member', 'restricted'].includes(status);

    return {
      success: true,
      isMember,
      status,
      userId,
      chatId,
    };
  } catch (error) {
    console.error('Erreur dans checkMembership:', error.message);
    return {
      success: false,
      error: error.message,
      userId,
      chatId,
    };
  }
}

module.exports = { checkMembership };
