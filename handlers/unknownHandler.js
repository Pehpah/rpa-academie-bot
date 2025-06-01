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

  bot.command("faq", (ctx) => {
    ctx.reply('❓ *Questions fréquentes – Choisis une question :*', {
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
          [{ text: 'Voir +10 questions ➕', callback_data: 'faq_more' }]
        ]
      }
    });
  });

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
            [{ text: '11️⃣ Recommander à un ami ?', callback_data: 'faq_11' }],
            [{ text: '12️⃣ Moyens de paiement ?', callback_data: 'faq_12' }],
            [{ text: '13️⃣ Certificat fourni ?', callback_data: 'faq_13' }],
            [{ text: '14️⃣ Accès aux anciens modules ?', callback_data: 'faq_14' }],
            [{ text: '15️⃣ Formation pour débutants ?', callback_data: 'faq_15' }],
            [{ text: '16️⃣ Support technique ?', callback_data: 'faq_16' }],
            [{ text: '17️⃣ Annulation abonnement ?', callback_data: 'faq_17' }],
            [{ text: '18️⃣ Durée de la formation ?', callback_data: 'faq_18' }],
            [{ text: '19️⃣ Suivre via téléphone ?', callback_data: 'faq_19' }],
            [{ text: '20️⃣ Formation en présentiel ?', callback_data: 'faq_20' }]
          ]
        }
      });
    }

    if (moreFaqResponses[data]) {
      bot.telegram.sendMessage(chatId, `💬 *Réponse :* ${moreFaqResponses[data]}`, { parse_mode: 'Markdown' });
    }

    bot.answerCallbackQuery(query.id);
  });
};
