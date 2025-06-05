module.exports = function (bot) {
  const askedQuestions = {};

  // ======= Commande /start =======
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

  // ======= Commande /premium =======
  bot.command("premium", (ctx) => {
    ctx.reply(
      `🚀 *Modules Premium disponibles* :

🔒 Module 4 – Stratégie de Croissance  
🔒 Module 5 – Vente & Conversion  
🔒 Module 6 – Gestion Financière  
🔒 Module 7 – Marketing Digital  
🔒 Module 8 – Leadership & Équipe  
🔒 Module 9 – Systèmes et Automatisation  

⚠️ Ces modules sont réservés aux membres Premium.

👇 Inscris-toi pour débloquer l’accès :`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔐 S’inscrire en Premium", url: "https://tally.so/r/nPeGr5" }]
          ]
        }
      }
    );
  });

  // ======= Actions boutons principaux =======
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
💸 *Tarif promo actuel* : seulement **5000 F/mois** (au lieu de 50 000 F)

👇 Clique ici pour t’inscrire en Premium :`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "🔐 Formulaire Premium", url: "https://tally.so/r/nPeGr5" }]]
        }
      }
    );
  });

  bot.action("inscription", (ctx) => {
    ctx.reply(
      `📝 *Inscription à la Rich-Preneur-Académie*

Choisis ton formulaire d'inscription selon ton niveau d'engagement 👇`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🎁 Formulaire Gratuit", url: "https://tally.so/r/3jYky1" }],
            [{ text: "🔐 Formulaire Premium", url: "https://tally.so/r/nPeGr5" }]
          ]
        }
      }
    );
  });

  bot.action("contact", (ctx) => {
    ctx.reply(
      `📞 *Contacte-nous* :
  
💬 Telegram : @RichPreneurAcademie  
📧 Email : richpreneuracademie@gmail.com`,
      { parse_mode: "Markdown" }
    );
  });

  // ======= FAQ =======
  const faqResponses = {
    faq_1: '👉 Cliquez sur "Inscription" dans le menu principal.',
    faq_2: '👉 Il existe une version gratuite et une version premium.',
    faq_3: '👉 Dans la section "Modules" du menu.',
    faq_4: '👉 Inscrivez-vous via "Premium", puis vous recevrez l’accès.',
    faq_5: '👉 Modules avancés, ateliers, coaching, accompagnement, lives privés.',
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
    faq_16: '👉 Contacte-nous ici : https://t.me/RichPreneurAcademie',
    faq_17: '👉 Oui, soutenu par des réseaux et partenaires',
    faq_18: '👉 Environ 1 à 3 mois selon ton rythme.',
    faq_19: '👉 Oui, tout fonctionne depuis ton téléphone.',
    faq_20: '👉 Non, tout est 100% en ligne.'
  };

  // Fonction pour afficher le menu FAQ principal
  function sendFaqMenu(chatId) {
    bot.telegram.sendMessage(chatId, '❓ *Questions fréquentes – Choisis une question :*', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '1️⃣ Comment m’inscrire ?', callback_data: 'faq_1' }],
          [{ text: '2️⃣ L’inscription est-elle payante ?', callback_data: 'faq_2' }],
          [{ text: '3️⃣ Où trouver les modules gratuits ?', callback_data: 'faq_3' }],
          [{ text: '4️⃣ comment puis je avoir accès au canal premium ?', callback_data: 'faq_4' }],
          [{ text: '5️⃣ Que contient la version Premium ?', callback_data: 'faq_5' }],
          [{ text: '6️⃣ C’est quoi la Rich-Preneur Académie ?', callback_data: 'faq_6' }],
          [{ text: '7️⃣ Puis-je arrêter quand je veux ?', callback_data: 'faq_7' }],
          [{ text: '8️⃣ Cela se passe en direct ou en différé ?', callback_data: 'faq_8' }],
          [{ text: '9️⃣ Je travaille déjà, c’est possible ?', callback_data: 'faq_9' }],
          [{ text: '🔟 Comment payer ?', callback_data: 'faq_10' }],
          [{ text: 'Voir +10 questions ➕', callback_data: 'faq_more' }],
          [{ text: 'Faire un mini quiz 🎯', callback_data: 'quiz_start' }]
        ]
      }
    });
  }

  // Afficher FAQ via commande /faq
  bot.command('faq', (ctx) => {
    const chatId = ctx.chat.id;
    askedQuestions[chatId] = new Set();
    sendFaqMenu(chatId);
  });

  // Afficher FAQ via bouton FAQ
  bot.action('faq', (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;

    if (!askedQuestions[chatId]) askedQuestions[chatId] = new Set();
    sendFaqMenu(chatId);
    ctx.answerCbQuery(); // retire l'animation "chargement" du bouton
  });

  // Gestion des réponses FAQ et suite FAQ More
  bot.action(/faq_\d+|faq_more/, async (ctx) => {
    const chatId = ctx.chat?.id;
    const data = ctx.callbackQuery.data;
    if (!chatId) return;

    if (!askedQuestions[chatId]) askedQuestions[chatId] = new Set();

    const faqBackButton = {
      reply_markup: {
        inline_keyboard: [[{ text: '⬅️ Retour aux questions fréquentes', callback_data: 'faq' }]]
      }
    };

    if (faqResponses[data]) {
      if (askedQuestions[chatId].has(data)) {
        await ctx.reply('ℹ️ Tu as déjà vu cette réponse. Choisis une autre question.', faqBackButton);
      } else {
        askedQuestions[chatId].add(data);
        await ctx.reply(`💬 *Réponse :* ${faqResponses[data]}`, { parse_mode: 'Markdown', ...faqBackButton });
      }
      await ctx.answerCbQuery();
    } else if (data === 'faq_more') {
      await ctx.reply('⬇️ *Autres questions fréquentes :*', {
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
            [{ text: '20️⃣ Avez vous des formations en présentiel ?', callback_data: 'faq_20' }],
            [{ text: '⬅️ Retour aux questions fréquentes', callback_data: 'faq' }]
          ]
        }
      });
      await ctx.answerCbQuery();
    } else if (moreFaqResponses[data]) {
      if (askedQuestions[chatId].has(data)) {
        await ctx.reply('ℹ️ Tu as déjà vu cette réponse. Choisis une autre question.', faqBackButton);
      } else {
        askedQuestions[chatId].add(data);
        await ctx.reply(`💬 *Réponse :* ${moreFaqResponses[data]}`, { parse_mode: 'Markdown', ...faqBackButton });
      }
      await ctx.answerCbQuery();
    }
  });

  // ======= Mini quiz =======
  const quizQuestions = [
    {
      question: "Quel est le premier module gratuit disponible ?",
      options: ["Mentalité d’entrepreneur", "Vente & Conversion", "Gestion Financière"],
      answerIndex: 0
    },
    {
      question: "Que contient la version Premium ?",
      options: [
        "Modules avancés + accompagnement",
        "Uniquement des livres",
        "Accès aux réseaux sociaux"
      ],
      answerIndex: 0
    },
    {
      question: "Comment s’inscrire en version Premium ?",
      options: ["Par formulaire en ligne", "En payant en liquide", "En appelant le support"],
      answerIndex: 0
    }
  ];

  const userQuizState = {};

  // Démarrer le quiz
  bot.action('quiz_start', (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;

    userQuizState[chatId] = { currentQuestion: 0, score: 0 };
    sendQuizQuestion(ctx, chatId);
    ctx.answerCbQuery();
  });

  // Envoyer une question du quiz
  function sendQuizQuestion(ctx, chatId) {
    const state = userQuizState[chatId];
    if (!state) return;

    const q = quizQuestions[state.currentQuestion];

    const buttons = q.options.map((opt, i) => [{ text: opt, callback_data: `quiz_answer_${i}` }]);

    ctx.telegram.sendMessage(chatId, `🎯 *Question ${state.currentQuestion + 1}:*\n${q.question}`, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: buttons }
    });
  }

  // Gérer les réponses du quiz
  bot.action(/quiz_answer_\d+/, (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;

    const state = userQuizState[chatId];
    if (!state) {
      ctx.answerCbQuery("Le quiz n'a pas été lancé, tape /start.");
      return;
    }

    const selected = parseInt(ctx.callbackQuery.data.split('_').pop(), 10);
    const q = quizQuestions[state.currentQuestion];

    if (selected === q.answerIndex) {
      state.score++;
      ctx.answerCbQuery("✅ Bonne réponse !");
    } else {
      ctx.answerCbQuery("❌ Mauvaise réponse.");
    }

    state.currentQuestion++;

    if (state.currentQuestion < quizQuestions.length) {
      sendQuizQuestion(ctx, chatId);
    } else {
      ctx.telegram.sendMessage(chatId, `🎉 *Quiz terminé !*\nTon score est ${state.score} / ${quizQuestions.length}\n\nMerci d'avoir participé !`, { parse_mode: "Markdown" });
      delete userQuizState[chatId];
    }
  });
};
