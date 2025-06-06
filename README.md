# 🤖 RPA-ACADEMIE-BOT

Un assistant intelligent basé sur Telegram, conçu pour accompagner les membres de l'Académie RPA dans leur apprentissage, leur coaching et leur progression personnalisée via l'IA (OpenAI) et des outils d’automatisation.

---

## 🚀 Fonctionnalités

- 🎓 Accueil automatique des nouveaux membres
- 🧠 Coaching personnalisé via OpenAI (GPT)
- 🗂️ Suivi des progrès (fichiers JSON)
- ✅ Vérification d'abonnement ou d'accès
- 🔘 Boutons interactifs (Telegraf Inline Keyboards)
- 📦 Structure modulaire claire (handlers, services, utils)
- 🛠️ Admin : visualisation des logs via route `/logviewer`

---

## 📁 Structure du projet

/RPA-ACADEMIE-BOT
├── /data # Données utilisateurs (ex: 123456789.json)
├── /handlers # Gestion des commandes et événements Telegram
│ ├── coachHandler.js
│ ├── unknownHandler.js
│ └── welcomeHandler.js
├── /logs # Fichiers logs
├── /progress # Suivi de coaching
├── /routes # Routes Express (logviewer, etc.)
├── /services # Intégrations (ex: OpenAI)
├── /utils # Fonctions utilitaires (Telegram, OpenAI, logs)
├── .env # Variables d'environnement (non versionné)
├── .gitignore
├── index.js # Point d'entrée principal du bot
├── package.json
├── README.md
└── render.yaml # Déploiement Render


---

## 📡 API REST Coach

L'application expose une **API HTTP REST** (via Express) pour interagir avec le système de coaching de façon programmatique.

| Méthode | Route                        | Description                                      |
|--------|-------------------------------|--------------------------------------------------|
| POST   | `/api/coach/message`         | Envoie un message au coach et reçoit une réponse |
| GET    | `/api/coach/challenge/:module` | Récupère un défi du jour par module              |
| GET    | `/api/coach/summary/:userId/:module` | Résumé de la progression d'un utilisateur       |

---

## ⚙️ Installation locale

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/tonpseudo/rpa-academie-bot.git
   cd rpa-academie-bot

