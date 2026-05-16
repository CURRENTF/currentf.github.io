let currentLang = "en";

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    try { localStorage.setItem("lang", lang); } catch {}
}

function toggleLanguage() {
    currentLang = currentLang === "en" ? "zh-CN" : "en";
    applyLanguage(currentLang);
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        const saved = localStorage.getItem("lang");
        if (saved === "en" || saved === "zh-CN") currentLang = saved;
    } catch {}

    applyLanguage(currentLang);

    const sections = document.querySelectorAll(".section-reveal");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
    }, { threshold: 0.08 });

    sections.forEach(section => observer.observe(section));
});
