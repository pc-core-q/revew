import { list, getSettings, DEFAULTS, esc, safeUrl, toast } from "./db.js";

const $ = (id) => document.getElementById(id);
const empty = (t) => `<p class="empty">${t}</p>`;
const skeleton = (n = 3) => Array.from({ length: n }, () => '<div class="sk"></div>').join("");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

["services-list", "projects-list"].forEach(i => $(i).innerHTML = skeleton());

function applySettings(s) {
  const r = document.documentElement.style;
  r.setProperty("--accent", s.accent); r.setProperty("--bg", s.bg); r.setProperty("--text", s.text); r.setProperty("--dark", s.dark);
  document.title = `${s.companyName} | Technology Company`;
  $("metaDesc").content = s.seoDescription;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = s.seoDescription;
  if (s.favicon) $("favicon").href = s.favicon;
  const brand = (cls) => s.logo ? `<img src="${esc(s.logo)}" alt="${esc(s.companyName)}" height="30">` : esc(s.companyName);
  $("brand").innerHTML = brand(); $("fBrand").innerHTML = brand();
  const t = { heroLabel: s.heroLabel, heroTitle: s.heroTitle, heroSub: s.heroSubtitle, heroDesc: s.heroDescription, aboutText: s.aboutText, mission: s.mission, approach: s.approach, contactTitle: s.contactTitle, contactSub: s.contactSub, footerText: s.footerText };
  Object.entries(t).forEach(([k, v]) => $(k).textContent = v);
  [$("heroCta"), $("navCta")].forEach(a => { a.textContent = s.ctaText; a.href = s.ctaLink || "#contact"; });
  $("copy").textContent = `© ${new Date().getFullYear()} ${s.companyName}. All rights reserved.`;
  $("why-list").innerHTML = s.whyUs.split("|").filter(Boolean).map(w => `<li class="rv">${esc(w.trim())}</li>`).join("");
  $("heroTitle").classList.add("in");
}

function renderStats(items) {
  $("stats").innerHTML = items.length ? items.map(i => `<div class="stat"><strong data-n="${parseInt(i.number) || 0}" data-suf="${esc(String(i.number).replace(/[\d\s]/g, ""))}">0</strong><span>${esc(i.label)}</span></div>`).join("") : empty("Statistics coming soon.");
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const n = +e.target.dataset.n, suf = e.target.dataset.suf; if (reduce) { e.target.textContent = n + suf; return; }
    const t0 = performance.now();
    const tick = (t) => { const p = Math.min((t - t0) / 1400, 1); e.target.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  document.querySelectorAll("[data-n]").forEach(el => io.observe(el));
}

const renderServices = (items) => $("services-list").innerHTML = items.length ? items.map(s => `<article class="card rv"><div class="ico">${esc(s.icon || "◆")}</div><h3>${esc(s.title)}</h3><p class="muted">${esc(s.description)}</p></article>`).join("") : empty("No services available yet.");

let projects = [];
function renderProjects(cat = "All") {
  const shown = projects.filter(p => cat === "All" || p.category === cat);
  $("projects-list").innerHTML = shown.length ? shown.map(p => `<article class="proj rv" tabindex="0" data-id="${p.id}">
    <div class="thumb">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" onerror="this.remove()">` : ""}</div>
    <div class="pbody"><span class="tag">${esc(p.category || "Other")}</span><h3>${esc(p.title)}</h3><p class="muted">${esc(p.description)}</p></div></article>`).join("") : empty("No projects available yet.");
  observe();
}
function renderFilters() {
  const cats = ["All", ...new Set(projects.map(p => p.category).filter(Boolean))];
  $("filters").innerHTML = projects.length ? cats.map((c, i) => `<button class="chip${i ? "" : " on"}" role="tab">${esc(c)}</button>`).join("") : "";
}
$("filters").addEventListener("click", (e) => {
  const b = e.target.closest(".chip"); if (!b) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === b));
  const l = $("projects-list"); l.classList.add("fade"); setTimeout(() => { renderProjects(b.textContent); l.classList.remove("fade"); }, 180);
});

const modal = $("modal");
const openProject = (id) => {
  const p = projects.find(x => x.id === id); if (!p) return;
  const url = safeUrl(p.url), gh = safeUrl(p.github);
  $("mBody").innerHTML = `${p.image ? `<img class="mimg" src="${esc(p.image)}" alt="${esc(p.title)}">` : ""}<div class="mtxt"><span class="tag">${esc(p.category || "Other")}</span><h3 id="mTitle">${esc(p.title)}</h3><p>${esc(p.description)}</p>
    ${p.info ? `<p class="muted">${esc(p.info)}</p>` : ""}<div class="techs">${(p.technologies || "").split(",").filter(s => s.trim()).map(t => `<span>${esc(t.trim())}</span>`).join("")}</div>
    <div class="row">${url ? `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Visit Website</a>` : ""}${gh ? `<a class="btn ghost" href="${esc(gh)}" target="_blank" rel="noopener noreferrer">GitHub</a>` : ""}</div></div>`;
  modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); $("mClose").focus();
};
const closeModal = () => { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); };
$("projects-list").addEventListener("click", (e) => { const c = e.target.closest(".proj"); if (c) openProject(c.dataset.id); });
$("projects-list").addEventListener("keydown", (e) => { if (e.key === "Enter") e.target.click?.(); });
$("mClose").onclick = closeModal; modal.addEventListener("click", (e) => e.target === modal && closeModal());
addEventListener("keydown", (e) => e.key === "Escape" && closeModal());

const renderProcess = (items) => $("process-list").innerHTML = items.length ? items.map((s, i) => `<li class="step rv"><b>${String(i + 1).padStart(2, "0")}</b><div><h3>${esc(s.title)}</h3><p class="muted">${esc(s.description)}</p></div></li>`).join("") : empty("Process steps coming soon.");

function renderSocials(items) {
  const on = items.filter(s => s.enabled !== false && safeUrl(s.url));
  const html = on.map(s => `<a class="soc" href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer"><span>${esc(s.icon || "●")}</span>${esc(s.name)}</a>`).join("");
  $("socials-list").innerHTML = on.length ? html : empty("Contact details coming soon.");
  $("footSocials").innerHTML = html;
}

let io;
function observe() {
  io ||= new IntersectionObserver((es) => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), { threshold: .12 });
  document.querySelectorAll(".rv:not(.in)").forEach(el => reduce ? el.classList.add("in") : io.observe(el));
}

$("burger").onclick = () => { const o = $("menu").classList.toggle("open"); $("burger").setAttribute("aria-expanded", o); };
$("menu").addEventListener("click", (e) => e.target.tagName === "A" && $("menu").classList.remove("open"));
let tick = false;
addEventListener("scroll", () => { if (tick) return; tick = true; requestAnimationFrame(() => { $("nav").classList.toggle("scrolled", scrollY > 24); tick = false; }); }, { passive: true });

(async () => {
  applySettings(await getSettings().catch(() => DEFAULTS));
  try {
    const [stats, services, proj, process, socials] = await Promise.all(["statistics", "services", "projects", "process", "socials"].map(list));
    renderStats(stats); renderServices(services); renderProcess(process); renderSocials(socials);
    projects = proj.filter(p => p.enabled !== false); renderFilters(); renderProjects();
  } catch (err) {
    console.error(err); toast("Could not load content. Check the Firebase configuration.", "err");
    ["services-list", "projects-list"].forEach(i => $(i).innerHTML = empty("Content is temporarily unavailable."));
  }
  observe();
})();
