const express = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit"); // Assure-toi d’avoir installé ce package

const router = express.Router();
const logsDir = path.join(__dirname, "../logs");

// Page principale avec recherche
router.get("/", (req, res) => {
  const search = (req.query.search || "").toLowerCase();

  fs.readdir(logsDir, (err, files) => {
    if (err) return res.status(500).send("Erreur lors de la lecture du dossier logs");

    const filtered = files.filter(f => f.toLowerCase().includes(search));
    const fileList = filtered.length
      ? filtered.map(f => `
        <li>
          <a href="/logs/view?file=${f}">${f}</a> 
          | <a href="/logs/pdf?file=${f}">📥 Télécharger PDF</a> 
          | <a href="/logs/delete?file=${f}" onclick="return confirm('Supprimer ce fichier ?')">🗑 Supprimer</a>
        </li>`).join("")
      : "<li>Aucun fichier trouvé</li>";

    res.send(`
      <h2>📁 Fichiers de logs</h2>
      <form method="get" action="/logs">
        <input type="text" name="search" placeholder="Rechercher..." value="${search}">
        <button type="submit">🔍 Rechercher</button>
      </form>
      <ul>${fileList}</ul>
    `);
  });
});

// Lire le contenu d’un fichier log
router.get("/view", (req, res) => {
  const file = req.query.file;
  const filePath = path.join(logsDir, file);
  if (!fs.existsSync(filePath)) return res.status(404).send("Fichier introuvable.");

  const data = JSON.parse(fs.readFileSync(filePath));
  const html = data.map((entry, i) => `
    <div style="margin-bottom:20px;padding:10px;border:1px solid #ccc;">
      <h4>🔹 Message ${i + 1} - ${new Date(entry.date).toLocaleString()}</h4>
      <b>Utilisateur :</b><br>${entry.userMessage}<br><br>
      <b>Coach :</b><br>${entry.aiReply}
    </div>
  `).join("");

  res.send(`
    <h2>📝 Journal : ${file}</h2>
    ${html}
    <p>
      <a href="/logs">⬅ Retour</a> | 
      <a href="/logs/pdf?file=${file}">📥 Télécharger PDF</a> | 
      <a href="/logs/delete?file=${file}" onclick="return confirm('Supprimer ce fichier ?')">🗑 Supprimer</a>
    </p>
  `);
});

// Télécharger un log en PDF
router.get("/pdf", (req, res) => {
  const file = req.query.file;
  const filePath = path.join(logsDir, file);
  if (!fs.existsSync(filePath)) return res.status(404).send("Fichier introuvable.");

  const data = JSON.parse(fs.readFileSync(filePath));
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${file.replace('.json', '')}.pdf"`);

  doc.pipe(res);
  doc.fontSize(16).text(`📝 Journal : ${file}`, { underline: true });
  doc.moveDown();

  data.forEach((entry, i) => {
    doc.fontSize(12).text(`🔹 Message ${i + 1} - ${new Date(entry.date).toLocaleString()}`, { bold: true });
    doc.text(`Utilisateur : ${entry.userMessage}`);
    doc.moveDown(0.3);
    doc.text(`Coach : ${entry.aiReply}`);
    doc.moveDown();
  });

  doc.end();
});

// Supprimer un fichier log
router.get("/delete", (req, res) => {
  const file = req.query.file;
  const filePath = path.join(logsDir, file);
  if (!fs.existsSync(filePath)) return res.status(404).send("Fichier introuvable.");

  fs.unlinkSync(filePath);
  res.redirect("/logs");
});

module.exports = router;
