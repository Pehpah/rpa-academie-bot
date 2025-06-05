const fs = require('fs');
const path = require('path');
const { Markup } = require('telegraf');

const usersFile = path.join(__dirname, '../users.json');

// Fonction utilitaire pour charger les utilisateurs
function loadUsers() {
  if (!fs.existsSync(usersFile)) return {};
  const raw = fs.readFileSync(usersFile);
  return JSON.parse(raw);
}

// Fonction utilitaire pour enregistrer les utilisateurs
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// 📌 /profil — Affiche les infos
async function handleProfil(ctx) {
  const userId = ctx.from.id.toString();
  const users = loadUsers();
  const user = users[userId];

  if (!user) {
    return ctx.reply("Profil introuvable. Utilisez /modifier_profil pour le créer.");
  }

  const profilText = `
👤 *Profil utilisateur*
Prénom : ${user.prenom}
Nom : ${user.nom}
Secteur : ${user.secteur}
Objectif : ${user.objectif}
Bio : ${user.bio}
Date d'inscription : ${user.inscription}
Version : ${user.demo ? 'Démo (3 jours)' : 'Complète'}
  `;

  return ctx.replyWithMarkdown(profilText);
}

// 📌 /modifier_profil — Étapes pour modifier les infos
async function handleModifierProfil(ctx) {
  const userId = ctx.from.id.toString();
  const users = loadUsers();
  users[userId] = users[userId] || {
    demo: true,
    inscription: new Date().toISOString().split('T')[0]
  };

  ctx.session = ctx.session || {};
  ctx.session.editProfilStep = 'prenom';

  await ctx.reply("📝 Quel est ton *prénom* ?");
}

// 💬 Réponses étape par étape
async function handleProfilSteps(ctx) {
  const userId = ctx.from.id.toString();
  ctx.session = ctx.session || {};
  const step = ctx.session.editProfilStep;
  const users = loadUsers();
  const user = users[userId] || {};

  switch (step) {
    case 'prenom':
      user.prenom = ctx.message.text;
      ctx.session.editProfilStep = 'nom';
      await ctx.reply("Quel est ton *nom* ?");
      break;
    case 'nom':
      user.nom = ctx.message.text;
      ctx.session.editProfilStep = 'bio';
      await ctx.reply("Écris une courte *bio* de toi.");
      break;
    case 'bio':
      user.bio = ctx.message.text;
      ctx.session.editProfilStep = 'secteur';
      await ctx.reply("Dans quel *secteur* évolues-tu ?");
      break;
    case 'secteur':
      user.secteur = ctx.message.text;
      ctx.session.editProfilStep = 'objectif';
      await ctx.reply("Quel est ton *objectif* principal avec ce coaching ?");
      break;
    case 'objectif':
      user.objectif = ctx.message.text;
      user.inscription = user.inscription || new Date().toISOString().split('T')[0];
      user.demo = true; // On démarre en version démo par défaut

      users[userId] = user;
      saveUsers(users);
      ctx.session.editProfilStep = null;

      await ctx.reply("✅ Profil mis à jour !");
      await handleProfil(ctx); // Affiche le résumé
      break;
    default:
      await ctx.reply("Commande inconnue ou étape expirée. Recommence avec /modifier_profil.");
  }
}

module.exports = {
  handleProfil,
  handleModifierProfil,
  handleProfilSteps
};
