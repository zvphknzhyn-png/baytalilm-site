/* BAYT AL-ILM بيت العلم — configuration du site (un seul endroit à modifier)
   BAYT_API_BASE : URL de base de l'API Bayt Al-Ilm, sans « / » final, par exemple "https://api.baytalilm.info/v1".
   Tant qu'elle est vide, le site utilise les données Bayt Al-Ilm intégrées (assets/data/), qui sont celles des bots.
   CONTACT_ENDPOINT : URL qui reçoit le formulaire de contact en POST JSON (webhook n8n par exemple). Vide = envoi par Telegram ou e-mail. */
window.BAYT_CONFIG = {
  BAYT_API_BASE: "",
  CONTACT_ENDPOINT: "",
  CONTACT_TELEGRAM: "https://t.me/Baytalilmapp"
};
