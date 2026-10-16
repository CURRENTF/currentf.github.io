let currentLang = "en";

function applyLanguage(lang) {
    currentLang = lang === "zh-CN" ? "zh-CN" : "en";
    document.documentElement.lang = currentLang;
    try { localStorage.setItem("lang", currentLang); } catch {}

    const metadata = document.body?.dataset;
    if (metadata?.titleEn) {
        const english = currentLang === "en";
        const title = english ? metadata.titleEn : metadata.titleZh;
        const description = english ? metadata.descriptionEn : metadata.descriptionZh;
        document.title = `${title} | Jitai Hao`;
        document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
        for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
            document.querySelector(selector)?.setAttribute("content", description);
        }
    }
}

function toggleLanguage() {
    applyLanguage(currentLang === "en" ? "zh-CN" : "en");
}

try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "zh-CN") currentLang = saved;
} catch {}
applyLanguage(currentLang);
