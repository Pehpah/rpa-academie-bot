/**
 * Commande /modifier_profil
 * Lance le processus de modification du profil utilisateur
 */

module.exports = async (ctx) => {
  ctx.session = ctx.session || {};
  ctx.session.editProfilStep = 'prenom';

  await ctx.reply("🔧 Modification du profil :\nQuel est ton *prénom* ?");
};
