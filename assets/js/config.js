/* BAYT AL-ILM بيت العلم — configuration du site (un seul endroit à modifier)
   BAYT_API_BASE : URL de base de l'API Bayt Al-Ilm, sans « / » final (ex. "https://api.baytalilm.info").
   BAYT_API_KEY  : clé gratuite du site (X-API-Key), nécessaire quand BAYT_API_BASE est renseignée.
   Tant que BAYT_API_BASE est vide, le site lit ses données intégrées (assets/data/), qui sont celles de la radio du bot Discord.
   CONTACT_ENDPOINT : URL qui reçoit le formulaire de contact en POST JSON (ex. webhook n8n). Vide = le message est copié et Telegram s'ouvre.
   CONTACT_EMAIL : adresse qui reçoit le formulaire par e-mail (mailto). Vide = non utilisé. */
window.BAYT_CONFIG = window.BAYT_CONFIG || {
  BAYT_API_BASE: "",
  BAYT_API_KEY: "",
  CONTACT_ENDPOINT: "",
  CONTACT_EMAIL: "",
  CONTACT_TELEGRAM: "https://t.me/Baytalilmapp",
  DISCORD_ADD_BOT: "https://discord.com/oauth2/authorize?client_id=1533905375030415541&permissions=277028916288&integration_type=0&scope=bot%20applications.commands"
};
