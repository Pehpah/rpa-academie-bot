// utils/fileCleaner.js
const fs = require('fs');
const path = require('path');

const DATA_FOLDER = path.join(__dirname, '../data');
const MAX_AGE_DAYS = 22;

function cleanOldFiles() {
  if (!fs.existsSync(DATA_FOLDER)) return;

  const files = fs.readdirSync(DATA_FOLDER);

  files.forEach(file => {
    const filePath = path.join(DATA_FOLDER, file);
    const stats = fs.statSync(filePath);

    const ageInMs = Date.now() - stats.mtimeMs;
    const ageInDays = ageInMs / (1000 * 60 * 60 * 24);

    if (ageInDays > MAX_AGE_DAYS) {
      fs.unlinkSync(filePath);
      console.log(`🧹 Fichier supprimé : ${file}`);
    }
  });
}

module.exports = { cleanOldFiles };
