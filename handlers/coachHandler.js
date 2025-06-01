// handlers/coachHandler.js

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { format } = require('date-fns');
const { askGPT } = require('../services/openai'); // SDK OpenAI v4.x

const DATA_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const COACHING_DAYS = 21;
const EXPIRATION_DAYS = 22;

function getUserFilePath(userId) {
  return path.join(DATA_DIR, `${userId}.json`);
}

function getUserPdfPath(userId) {
  return path.join(DATA_DIR, `${userId}_resume.pdf`);
}

function loadUserProgress(userId) {
  const filePath = getUserFilePath(userId);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return null;
}

function saveUserProgress(userId, data) {
  fs.writeFileSync(getUserFilePath(userId), JSON.stringify(data, null, 2));
}

function deleteUserProgress(userId) {
  const jsonPath = getUserFilePath(userId);
  const pdfPath = getUserPdfPath(userId);
  if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
  if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
}

function cleanOldFiles() {
  const files = fs.readdirSync(DATA_DIR);
  const now = Date.now();

  files.forEach((file) => {
    const filePath = path.join(DATA_DIR, file);
    const stats = fs.statSync(filePath);
    const ageInDays = (now - stats.ctimeMs) / (1000 * 60 * 60 * 24);
    if (ageInDays > EXPIRATION_DAYS) {
      fs.unlinkSync(filePath);
      console.log(`🧹 Supprimé : ${file}`);
    }
  });
}

function getModuleForDay(day) {
  if (day >= 1 && day <= 7) {
    return {
      title: "Mentalité d’entrepreneur",
      content: "Aujourd’hui, vous allez réfléchir à votre posture d’entrepreneur. Quelle est votre vision à long terme ?",
    };
  }
  if (day >= 8 && day <= 14) {
    return {
      title: "Organisation & Objectifs",
      content: "Concentrez-vous sur votre manière de planifier. Quels sont vos objectifs SMART de la semaine ?",
    };
  }
  if (day >= 15 && day <= 21) {
    return {
      title: "Marché & Clients",
      content: "Identifiez précisément votre client idéal. Qui est-il ? Où le trouver ?",
    };
  }
  return null;
}

function generatePdf(userId, progress, ctx) {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const pdfPath = getUserPdfPath(userId);
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    doc.fontSize(18).text('📘 Résumé de votre Coaching PEHPAH', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Nom d’utilisateur : ${ctx.from.first_name || ''} (@${ctx.from.username || ''})`);
    doc.text(`Date de début : ${format(new Date(progress.startDate), 'dd/MM/yyyy')}`);
    doc.text(`Total de jours complétés : ${progress.history.length}`);
    doc.moveDown();

    doc.fontSize(14).text('🗓️ Parcours détaillé :');
    progress.history.forEach((item) => {
      doc.fontSize(12).text(`Jour ${item.day} : ${item.module} – ${format(new Date(item.date), 'dd/MM/yyyy')}`);
    });

    doc.end();
    stream.on('finish', () => resolve(pdfPath));
  });
}

async function handleCoaching(ctx) {
  const userId = ctx.from.id;
  let progress = loadUserProgress(userId);

  if (!progress) {
    progress = {
      currentDay: 1,
      history: [],
      startDate: new Date().toISOString(),
    };
  }

  if (progress.currentDay > COACHING_DAYS) {
    const pdfPath = getUserPdfPath(userId);
    if (!fs.existsSync(pdfPath)) {
      await ctx.reply("📄 Génération de votre résumé, un instant...");
      await generatePdf(userId, progress, ctx);
    }
    await ctx.replyWithDocument({ source: pdfPath, filename: 'resume_coaching_pehpah.pdf' });
    return;
  }

  const module = getModuleForDay(progress.currentDay);
  const intro = `📅 Jour ${progress.currentDay} – *${module.title}*\n\n${module.content}`;
  await ctx.replyWithMarkdown(intro);

  try {
    const conseil = await askGPT(`Donne un conseil utile pour un entrepreneur sur le thème : "${module.title}". Reste concret et bienveillant.`);
    await ctx.reply(`💡 Conseil du jour :\n${conseil}`);
  } catch (err) {
    console.error('❌ Erreur GPT:', err);
    await ctx.reply("⚠️ Je n'ai pas pu générer le conseil du jour. Réessaie plus tard.");
  }

  progress.history.push({
    day: progress.currentDay,
    module: module.title,
    date: new Date().toISOString(),
  });

  progress.currentDay += 1;
  saveUserProgress(userId, progress);
}

// 📦 Export
module.exports = function (bot) {
  bot.action("coaching", (ctx) => {
    ctx.reply("🎯 Tu veux un coaching ? Réserve-le ici : https://tally.so/r/nPeGr5");
  });

  bot.command("reset", async (ctx) => {
    deleteUserProgress(ctx.from.id);
    await ctx.reply("🔁 Coaching réinitialisé. Tape /coaching pour recommencer.");
  });

  cleanOldFiles(); // Nettoyage au lancement
};

// 👇 Export de la fonction principale pour index.js
module.exports.handleCoaching = handleCoaching;
