const { Telegraf } = require("telegraf");

// Remplace par le token de ton bot Telegram
const bot = new Telegraf("8192068389:AAEsWNPAOYfTYn3Rbnfzzy3DI5Xi_-WQQL0");

// Menu principal avec boutons inline
bot.start((ctx) => {
  ctx.reply(
    `🎓 *Bienvenue dans la RPA Académie !*\nTon espace de formation 100% sur Telegram 🚀\n\n👇 Choisis une option ci-dessous :`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📘 Modules", callback_data: "modules" },
            { text: "📝 Inscription", callback_data: "inscription" }
          ],
          [
            { text: "🔒 Premium", callback_data: "premium" },
            { text: "❓ FAQ", callback_data: "faq" }
          ],
          [{ text: "📞 Contact", callback_data: "contact" }]
        ]
      }
    }
  );
});

// Réponse au bouton "Modules"
bot.action("modules", (ctx) => {
  ctx.reply(
    `📘 *Modules gratuits disponibles* :

✅ Module 1 – Mentalité d’entrepreneur  
✅ Module 2 – Organisation & Objectifs  
✅ Module 3 – Marché & Clients

🔓 Tape /premium pour débloquer les modules avancés.`,
    { parse_mode: "Markdown" }
  );
});

// Réponse au bouton "Inscription" avec deux boutons cliquables
bot.action("inscription", (ctx) => {
  ctx.reply(
    `📝 *Inscription à la Rich-Preneur-Académie*

Choisis ton formulaire d'inscription selon ton niveau d'engagement 👇`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎁 Formulaire Gratuit", url: "https://tally.so/r/3jYky1" }],
          [{ text: "🔐 Formulaire Premium", url: "https://formulaire-premium.com" }]
        ]
      }
    }
  );
});

// Réponse au bouton "Premium" avec infos détaillées et bouton cliquable
bot.action("premium", (ctx) => {
  ctx.reply(
    `🔒 *Découvre l'offre Premium de la RPA !*

Tu veux aller plus loin, passer à l’action et vraiment faire décoller ton activité ? 💼🔥

Voici ce que t’offre la version Premium :

✅ Modules avancés pour entrepreneurs ambitieux  
🎙 Ateliers pratiques en ligne (Zoom, audio, etc.)  
💬 Accompagnement personnalisé dans un canal privé  
📌 Accès prioritaire aux opportunités PEHPAH  

🕒 *Durée moyenne* : 1 à 3 mois, selon ton rythme  
💸 *Tarif promo actuel* : seulement **5000 F/mois** (au lieu de 10 000 F)

👇 Clique ici pour t’inscrire en Premium :`,
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔐 Formulaire Premium", url: "https://formulaire-premium.com" }]
        ]
      }
    }
  );
});


// Réponse au bouton "Contact"
bot.action("contact", (ctx) => {
  ctx.reply(
    `📞 *Contacte-nous* :
  
💬 Telegram : @RichPreneurAcademie
📧 Email : richpreneuracademie@gmail.com`,
    { parse_mode: "Markdown" }
  );
});

// Commande /faq
bot.command("faq", (ctx) => {
  ctx.reply('❓ *Questions fréquentes – Choisis une question :*', {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '1️⃣ Comment m’inscrire ?', callback_data: 'faq_1' }],
        [{ text: '2️⃣ L’inscription est-elle payante ?', callback_data: 'faq_2' }],
        [{ text: '3️⃣ Où trouver les modules gratuits ?', callback_data: 'faq_3' }],
        [{ text: '4️⃣ Comment avoir accès au canal premium ?', callback_data: 'faq_4' }],
        [{ text: '5️⃣ Que contient la version Premium ?', callback_data: 'faq_5' }],
        [{ text: '6️⃣ C’est quoi la Rich-Preneur Académie ?', callback_data: 'faq_6' }],
        [{ text: '7️⃣ Puis-je arrêter quand je veux ?', callback_data: 'faq_7' }],
        [{ text: '8️⃣ Cela se passe en direct ou en différé ?', callback_data: 'faq_8' }],
        [{ text: '9️⃣ Je travaille déjà, c’est possible ?', callback_data: 'faq_9' }],
        [{ text: '🔟 Comment payer ?', callback_data: 'faq_10' }],
        [{ text: 'Voir +10 questions ➕', callback_data: 'faq_more' }]
      ]
    }
  });
});

const faqResponses = {
  faq_1: '👉 Cliquez sur "Inscription" dans le menu principal.',
  faq_2: '👉 Il existe une version gratuite et une version premium.',
  faq_3: '👉 Dans la section "Modules" du menu.',
  faq_4: '👉 Inscrivez-vous via "Premium", puis vous recevrez l’accès.',
  faq_5: '👉 Modules avancés, ateliers, coaching, lives privés.',
  faq_6: '👉 La RPA est le lieu d’apprentissage des entrepreneurs africain.',
  faq_7: '👉 Oui, aucun engagement.',
  faq_8: '👉 Les deux : modules enregistrés + lives réguliers.',
  faq_9: '👉 Oui, c’est 100% à ton rythme, tu apprends quand tu es dispo.',
  faq_10: '👉 Cliquez sur "Premium" pour voir les options de paiement.'
};

const moreFaqResponses = {
  faq_11: '👉 Oui, partage simplement ce bot @RPA_academie_bot.',
  faq_12: '👉 Mtn mobile Money, Airtel mobile Money, carte visa.',
  faq_13: '👉 Le programme t’aide à en trouver.',
  faq_14: '👉 Oui, avec la version Premium.',
  faq_15: '👉 Absolument, tout commence par les bases.',
  faq_16: '👉 Contacte-nous ici : https://t.me/ton_support',
  faq_17: '👉 Oui, soutenu par des réseaux et partenaires.',
  faq_18: '👉 Environ 1 à 3 mois selon ton rythme.',
  faq_19: '👉 Oui, tout fonctionne depuis ton téléphone.',
  faq_20: '👉 Non, tout est 100% en ligne.'
};

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (faqResponses[data]) {
    bot.telegram.sendMessage(chatId, `💬 *Réponse :* ${faqResponses[data]}`, { parse_mode: 'Markdown' });
  }

  if (data === 'faq_more') {
    bot.telegram.sendMessage(chatId, '⬇️ *Autres questions fréquentes :*', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '11️⃣ Puis-je inviter d’autres ?', callback_data: 'faq_11' }],
          [{ text: '12️⃣ quelles sont les différents moyens de paiement ?', callback_data: 'faq_12' }],
          [{ text: '13️⃣ Et si je n’ai pas d’idée ?', callback_data: 'faq_13' }],
          [{ text: '14️⃣ Y a-t-il un accompagnement ?', callback_data: 'faq_14' }],
          [{ text: '15️⃣ Avez vous une formation pour débutants ?', callback_data: 'faq_15' }],
          [{ text: '16️⃣ y a-t-il un moyen de discuter avec le Support technique ?', callback_data: 'faq_16' }],
          [{ text: '17️⃣ La RPA est-elle reconnu ?', callback_data: 'faq_17' }],
          [{ text: '18️⃣ Quelle est la durée de la formation ?', callback_data: 'faq_18' }],
          [{ text: '19️⃣ Est ce que je peux suivre via téléphone ?', callback_data: 'faq_19' }],
          [{ text: '20️⃣ Avez vous des formations en présentiel ?', callback_data: 'faq_20' }]
        ]
      }
    });
  }

  if (moreFaqResponses[data]) {
    bot.telegram.sendMessage(chatId, `💬 *Réponse :* ${moreFaqResponses[data]}`, { parse_mode: 'Markdown' });
  }

  bot.answerCallbackQuery(query.id);
});

// Démarrage du bot (pour local ou serveur)
bot.launch();


// Lancer le bot (pour Firebase, via webhook)
exports.bot = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error handling bot update:", err);
    res.status(500).send("Error");
  }
};
