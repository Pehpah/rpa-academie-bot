module.exports = function (bot) {
  // Commande /start
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

  // Actions sur les boutons
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
          inline_keyboard: [
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
};
