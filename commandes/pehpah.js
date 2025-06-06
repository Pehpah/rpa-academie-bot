// commandes/pehpah.js
const { Markup } = require("telegraf");

module.exports = (bot) => {
  bot.command("pehpah", async (ctx) => {
    try {
      await ctx.reply(
        "🌍 *Bienvenue dans l’univers PEHPAH !*\n\nPEHPAH est une initiative pour renforcer les entrepreneurs à travers un accompagnement, des outils et une communauté soudée.\n\n🔗 Rejoins la tontine officielle PEHPAH ci-dessous 👇",
        {
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard([
            [
              Markup.button.url(
                "🔗 Accéder à la Tontine",
                "https://tontine.pehpah.com"
              ),
            ],
          ]),
        }
      );
    } catch (error) {
      console.error("Erreur dans la commande /pehpah :", error);
      ctx.reply("❌ Une erreur est survenue. Réessaie plus tard.");
    }
  });
};
