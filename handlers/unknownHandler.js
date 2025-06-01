module.exports = function (bot) {
  const faqResponses = {
    faq_1: '👉 Cliquez sur "Inscription" dans le menu principal.',
    faq_2: '👉 Il existe une version gratuite et une version premium.',
    faq_3: '👉 Dans la section "Modules" du menu.',
    faq_4: '👉 Inscrivez-vous via "Premium", puis vous recevrez l’accès.',
    faq_5: '👉 Modules avancés, ateliers, coaching, accompagnement, lives privés.',
    faq_6: '👉 Oui, les deux groupes sont complémentaires.',
    faq_7: '👉 Dans le canal Premium, vous pouvez poser vos questions.',
    faq_8: '👉 Les deux : modules enregistrés + lives réguliers.',
    faq_9: '👉 Oui, c’est 100% à ton rythme.',
    faq_10: '👉 Cliquez sur "Premium" pour voir les options de paiement.'
  };

  const moreFaqResponses = {
    faq_11: '👉 Bien sûr ! Invite-les à taper /start dans la conversation avec @RPA_academie_bot.',
    faq_12: '👉 Mtn mobile Money, Airtel mobile Money, carte visa.',
    faq_13: '👉 Oui, un certificat digital est remis.',
    faq_14: '👉 Accès possible selon ton abonnement.',
    faq_15: '👉 Absolument, tout commence par les bases.',
    faq_16: '👉 Contacte-nous ici : https://t.me/RichPreneurAcademie',
    faq_17: '👉 Oui, mais contacte notre équipe pour ça.',
    faq_18: '👉 Environ 1 à 3 mois selon ton rythme.',
    faq_19: '👉 Oui, tout fonctionne depuis ton téléphone.',
    faq_20: '👉 Non, tout est 100% en ligne.'
  };

  // Pour suivre temporairement les questions posées par chatId (en mémoire simple)
  const askedQuestions = {};

  // Message d'accueil personnalisé au /start
  bot.command('start', (ctx) => {
    const chatId = ctx.chat.id;
    askedQuestions[chatId] = new Set(); // reset session

    ctx.reply(
      `👋 Bonjour et bienvenue à la Rich Preneur Académie !\n\n` +
      `Je suis ton assistant virtuel.\n` +
      `Tu peux taper /faq pour accéder aux questions fréquentes.\n` +
      `Si tu souhaites parler à un humain, utilise /contact.\n\n` +
      `Que veux-tu faire ?`,
      {
        reply_markup: {
          keyboard: [
            [{ text: '/faq' }],
            [{ text: '/contact' }]
          ],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      }
    );
  });

  // Commande contact vers le canal Telegram
  bot.command('contact', (ctx) => {
    ctx.reply(
      '📞 Tu veux parler à un conseiller humain ?\n' +
      'Rejoins notre canal ici : https://t.me/RichpreneuracademieRPA'
    );
  });

  // Fonction pour envoyer le menu FAQ principal
  function sendFaqMenu(chatId) {
    bot.telegram.sendMessage(chatId, '❓ *Questions fréquentes – Choisis une question :*', {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '1️⃣ Comment m’inscrire ?', callback_data: 'faq_1' }],
          [{ text: '2️⃣ L’inscription est-elle payante ?', callback_data: 'faq_2' }],
          [{ text: '3️⃣ Où trouver les modules gratuits ?', callback_data: 'faq_3' }],
          [{ text: '4️⃣ Accès au canal premium ?', callback_data: 'faq_4' }],
          [{ text: '5️⃣ Que contient la version Premium ?', callback_data: 'faq_5' }],
          [{ text: '6️⃣ Dans les deux groupes ?', callback_data: 'faq_6' }],
          [{ text: '7️⃣ Contacter les formateurs ?', callback_data: 'faq_7' }],
          [{ text: '8️⃣ En direct ou en différé ?', callback_data: 'faq_8' }],
          [{ text: '9️⃣ Avancer à mon rythme ?', callback_data: 'faq_9' }],
          [{ text: '🔟 Comment payer ?', callback_data: 'faq_10' }],
          [{ text: 'Voir +10 questions ➕', callback_data: 'faq_more' }],
          [{ text: 'Faire un mini quiz 🎯', callback_data: 'quiz_start' }]
        ]
      }
    });
  }

  // Commande /faq pour afficher le menu FAQ
  bot.command('faq', (ctx) => {
    const chatId = ctx.chat.id;
    askedQuestions[chatId] = new Set(); // reset session FAQ
    sendFaqMenu(chatId);
  });

  // Gestionnaire des callback_query (clic sur les boutons FAQ, quiz...)
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Initialisation si pas encore présent
    if (!askedQuestions[chatId]) askedQuestions[chatId] = new Set();

    // Réponse FAQ simple avec bouton retour au menu
    const faqBackButton = {
      reply_markup: {
        inline_keyboard: [[{ text: '⬅️ Retour aux questions fréquentes', callback_data: 'faq' }]]
      }
    };

    if (faqResponses[data]) {
      // Empêche répétition de la même question dans la session
      if (askedQuestions[chatId].has(data)) {
        await bot.telegram.sendMessage(chatId, 'ℹ️ Tu as déjà vu cette réponse. Tu peux choisir une autre question.', faqBackButton);
      } else {
        askedQuestions[chatId].add(data);
        await bot.telegram.sendMessage(chatId, `💬 *Réponse :* ${faqResponses[data]}`, { parse_mode: 'Markdown', ...faqBackButton });
      }
    }
    else if (data === 'faq') {
      // Retour au menu FAQ principal
      await sendFaqMenu(chatId);
    }
    else if (data === 'faq_more') {
      await bot.telegram.sendMessage(chatId, '⬇️ *Autres questions fréquentes :*', {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: '11️⃣ Recommander à un ami ?', callback_data: 'faq_11' }],
            [{ text: '12️⃣ Moyens de paiement ?', callback_data: 'faq_12' }],
            [{ text: '13️⃣ Certificat fourni ?', callback_data: 'faq_13' }],
            [{ text: '14️⃣ Accès aux anciens modules ?', callback_data: 'faq_14' }],
            [{ text: '15️⃣ Formation pour débutants ?', callback_data: 'faq_15' }],
            [{ text: '16️⃣ Support technique ?', callback_data: 'faq_16' }],
            [{ text: '17️⃣ Annulation abonnement ?', callback_data: 'faq_17' }],
            [{ text: '18️⃣ Durée de la formation ?', callback_data: 'faq_18' }],
            [{ text: '19️⃣ Suivre via téléphone ?', callback_data: 'faq_19' }],
            [{ text: '20️⃣ Formation en présentiel ?', callback_data: 'faq_20' }],
            [{ text: '⬅️ Retour aux questions fréquentes', callback_data: 'faq' }]
          ]
        }
      });
    }
    else if (moreFaqResponses[data]) {
      if (askedQuestions[chatId].has(data)) {
        await bot.telegram.sendMessage(chatId, 'ℹ️ Tu as déjà vu cette réponse. Choisis une autre question.', faqBackButton);
      } else {
        askedQuestions[chatId].add(data);
        await bot.telegram.sendMessage(chatId, `💬 *Réponse :* ${moreFaqResponses[data]}`, { parse_mode: 'Markdown', ...faqBackButton });
      }
    }
    // ===== MINI QUIZ INTERACTIF =====
    else if (data === 'quiz_start') {
      // Démarrer quiz : 3 questions simples (exemple)
      askedQuestions[chatId] = new Set(); // Reset pour quiz
      await bot.telegram.sendMessage(chatId, '🎯 Mini Quiz : Question 1\n' +
        'Comment t’inscrire ?\n\n' +
        'a) En cliquant sur "Inscription" dans le menu principal\n' +
        'b) En envoyant un email\n' +
        'c) En appelant le support',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'a', callback_data: 'quiz_q1_a' }],
              [{ text: 'b', callback_data: 'quiz_q1_b' }],
              [{ text: 'c', callback_data: 'quiz_q1_c' }]
            ]
          }
        });
    }
    else if (data.startsWith('quiz_q1_')) {
      if (data === 'quiz_q1_a') {
        await bot.telegram.sendMessage(chatId, '✅ Correct ! Passons à la question 2.');
      } else {
        await bot.telegram.sendMessage(chatId, '❌ Ce n’est pas la bonne réponse. Réessayons la question 1.');
        return bot.answerCallbackQuery(query.id);
      }

      // Question 2
      await bot.telegram.sendMessage(chatId, '🎯 Question 2\n' +
        'Est-ce que l’inscription est payante ?\n\n' +
        'a) Oui\n' +
        'b) Non',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'a', callback_data: 'quiz_q2_a' }],
              [{ text: 'b', callback_data: 'quiz_q2_b' }]
            ]
          }
        });
    }
    else if (data.startsWith('quiz_q2_')) {
      if (data === 'quiz_q2_a') {
        await bot.telegram.sendMessage(chatId, '✅ Correct ! Passons à la dernière question.');
      } else {
        await bot.telegram.sendMessage(chatId, '❌ Ce n’est pas la bonne réponse. Réessayons la question 2.');
        return bot.answerCallbackQuery(query.id);
      }

      // Question 3
      await bot.telegram.sendMessage(chatId, '🎯 Question 3\n' +
        'Où trouver les modules gratuits ?\n\n' +
        'a) Dans la section "Modules" du menu\n' +
        'b) Dans un groupe Facebook\n' +
        'c) En envoyant un message privé',
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'a', callback_data: 'quiz_q3_a' }],
              [{ text: 'b', callback_data: 'quiz_q3_b' }],
              [{ text: 'c', callback_data: 'quiz_q3_c' }]
            ]
          }
        });
    }
    else if (data.startsWith('quiz_q3_')) {
      if (data === 'quiz_q3_a') {
        await bot.telegram.sendMessage(chatId, '🎉 Bravo, tu as terminé le quiz ! Tape /faq pour revenir au menu FAQ.');
      } else {
        await bot.telegram.sendMessage(chatId, '❌ Ce n’est pas la bonne réponse. Réessayons la question 3.');
        return bot.answerCallbackQuery(query.id);
      }
    }
    else {
      // Réponse par défaut aux messages non reconnus
      await bot.telegram.sendMessage(chatId, `🤔 Je n’ai pas compris ta demande.\n\nTape /faq pour voir les questions fréquentes ou /contact pour parler à un humain.`);
    }

    // Toujours répondre à la callback query pour ne pas afficher le "chargement"
    bot.answerCallbackQuery(query.id);
  });

  // Gestion des messages textes libres (hors commandes)
  bot.on('message', (ctx) => {
    const chatId = ctx.chat.id;
    const text = ctx.message.text;

    // Si ce n'est pas une commande connue, on guide l'utilisateur
    if (!text.startsWith('/')) {
      ctx.reply(`🤔 Je n’ai pas compris ce message. Tape /faq pour les questions fréquentes ou /contact pour parler à un humain.`);
    }
  });
};
