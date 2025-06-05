const express = require("express");
const router = express.Router();

const {
  coachResponse,
  dailyChallenge,
  coachingSummary,
} = require("../utils/openaiCoach"); // ✅ OK

/**
 * ➤ POST /api/coach/message
 * Reçoit un message utilisateur et retourne une réponse coaching personnalisée
 */
router.post("/message", async (req, res) => {
  const { module, message, userId, tone = "neutre", persona = "coach" } = req.body;

  if (!module || !message || !userId) {
    return res.status(400).json({
      success: false,
      error: "❗ Champs requis manquants : 'module', 'message', 'userId'.",
    });
  }

  try {
    const reply = await coachResponse({
      module,
      userMessage: message,
      userId,
      tone,
      persona,
    });

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("❌ Erreur coachHandler (/message):", error);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors du traitement du message coaching.",
    });
  }
});

/**
 * ➤ GET /api/coach/challenge/:module
 * Retourne un défi du jour pour un module spécifique
 */
router.get("/challenge/:module", (req, res) => {
  const { module } = req.params;

  if (!module) {
    return res.status(400).json({
      success: false,
      error: "❗ Module non spécifié.",
    });
  }

  try {
    const challenge = dailyChallenge(module);
    return res.status(200).json({ success: true, challenge });
  } catch (error) {
    console.error("❌ Erreur coachHandler (/challenge):", error);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la génération du défi du jour.",
    });
  }
});

/**
 * ➤ GET /api/coach/summary/:userId/:module
 * Retourne un résumé des échanges de coaching pour un utilisateur donné
 */
router.get("/summary/:userId/:module", (req, res) => {
  const { userId, module } = req.params;

  if (!userId || !module) {
    return res.status(400).json({
      success: false,
      error: "❗ Paramètres requis manquants : 'userId', 'module'.",
    });
  }

  try {
    const summary = coachingSummary(userId, module);
    return res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("❌ Erreur coachHandler (/summary):", error);
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors de la récupération du résumé de coaching.",
    });
  }
});

module.exports = router;
