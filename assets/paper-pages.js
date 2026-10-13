let currentLang = "en";

function applyLanguage(lang) {
    currentLang = lang === "zh-CN" ? "zh-CN" : "en";
    document.documentElement.lang = currentLang;
    try { localStorage.setItem("lang", currentLang); } catch {}
}

function toggleLanguage() {
    applyLanguage(currentLang === "en" ? "zh-CN" : "en");
}

try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "zh-CN") currentLang = saved;
} catch {}
applyLanguage(currentLang);
