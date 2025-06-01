const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { askGPT } = require('../services/openai');
const { format } = require('date-fns');

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
  const file = getUserFilePath(userId);
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, 'utf-8');
    return JSON.parse(data);
  }
  return null;
}

function saveUserProgress(userId, data) {
  fs.writeFileSync(getUserFilePath(userId), JSON.stringify(data, null, 2));
}

function deleteUserProgress(userId) {
  const file = getUserFilePath(userId);
  const pdf = getUserPdfPath(userId);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  if (fs.existsSync(pdf)) fs.unlinkSync(pdf);
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
      content: "Aujourd’hui, vous allez réfléchir à votre posture d’entrepreneur. Quelle est votre vision à long terme ?"
    };
  }
  if (day >= 8 && day <= 14) {
    return {
      title: "Organisation & Objectifs",
      content: "Concentrez-vous sur votre manière de planifier. Quels sont vos objectifs SMART de la semaine ?"
    };
  }
  if (day >= 15 && day <= 21) {
    return {
      title: "Marché & Clients",
      content: "Identifiez précisément votre client idéal. Qui est-il ? Où le trouver ?"
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
    progress.history.forEach((item, i) => {
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
      startDate: new Date().toISOString()
    };
  }

  if (progress.currentDay > COACHING_DAYS) {
    // Coaching terminé, envoi du résumé
    const pdfPath = getUserPdfPath(userId);
    if (!fs.existsSync(pdfPath)) {
      await ctx.reply("📄 Génération de votre résumé, un instant...");
      await generatePdf(userId, progress, ctx);
    }
    await ctx.replyWithDocument({ source: pdfPath, filename: 'resume_coaching_pehpah.pdf' });
    return;
  }

  const currentModule = getModuleForDay(progress.currentDay);
  const intro = `📅 Jour ${progress.currentDay} – *${currentModule.title}*\n\n${currentModule.content}`;
  await ctx.replyWithMarkdown(intro);

  progress.history.push({
    day: progress.currentDay,
    module: currentModule.title,
    date: new Date().toISOString(),
  });

  progress.currentDay += 1;
  saveUserProgress(userId, progress);
}

module.exports = (bot) => {
  // Commande /coaching
  bot.command('coaching', handleCoaching);

  // Commande /reset
  bot.command('reset', async (ctx) => {
    deleteUserProgress(ctx.from.id);
    await ctx.reply('🔁 Coaching réinitialisé. Tapez /coaching pour recommencer.');
  });

  // Nettoyage quotidien à chaque lancement
  cleanOldFiles();
};
 