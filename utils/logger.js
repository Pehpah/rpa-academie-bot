const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

// Crée le dossier logs s'il n'existe pas
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const getTimestamp = () => new Date().toISOString();

function logToFile(level, message) {
  const logMessage = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}\n`;
  const logFile = path.join(logDir, `${new Date().toISOString().slice(0,10)}.log`);
  fs.appendFile(logFile, logMessage, err => {
    if (err) console.error('Erreur écriture log:', err);
  });
}

module.exports = {
  info: (msg) => {
    console.log(`[INFO] ${msg}`);
    logToFile('info', msg);
  },
  warn: (msg) => {
    console.warn(`[WARN] ${msg}`);
    logToFile('warn', msg);
  },
  error: (msg) => {
    console.error(`[ERROR] ${msg}`);
    logToFile('error', msg);
  }
};
