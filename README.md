# 🤖 RP Académie Bot

Un bot Telegram intelligent pour accueillir les nouveaux membres de l’Académie RPA et coacher les membres du canal public sur 3 modules clés.

RPA Bot est un bot Telegram conçu pour accompagner les entrepreneurs dans leur parcours avec un coaching structuré sur 3 semaines, basé sur 3 modules clés :  
- Mentalité d’entrepreneur  
- Organisation & Objectifs  
- Marché & Clients

Le bot vérifie si l’utilisateur est inscrit à la Rich-Preneur-Académie (RPA), gère la progression du coaching localement via des fichiers sur le serveur, et supprime automatiquement les données de plus de 22 jours pour garder un résumé personnalisé.

---

## 📌 Fonctionnalités

- 🎓 Accueil automatisé des utilisateurs avec un message clair et orienté.
- 🧠 Coaching OpenAI GPT-3.5-turbo sur 3 modules gratuits :
  1. Mentalité d’entrepreneur242
  2. Organisation & Objectifs
  3. Marché & Clients
- - **Vérification d'inscription** dans les canaux RPA (gratuit ou premium) avant de lancer le coaching.
- **Suivi de progression** stocké localement en JSON par utilisateur.
- **Nettoyage automatique** des fichiers de progression après 22 jours, planifié via un cron job.
- **Gestion des inscriptions** à RPA (gratuit et premium) directement depuis le bot avec boutons cliquables.
- **Déploiement simple** sur Render avec Express et Telegraf.

---

## 🚀 Démarrage rapide

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-user/rpa-academie-bot.git
cd rpa-academie-bot
