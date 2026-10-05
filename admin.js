import { list, getSettings, saveSettings, save, remove, uploadImage, esc, toast, DEFAULTS } from "./db.js";
const $ = (id) => document.getElementById(id);

// DEMO AUTH: replace this object with Firebase Authentication (see README).
const auth = {
  HASH: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4", // SHA-256 of the demo password
  async login(pw) {
    const h = [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw)))].map(b => b.toString(16).padStart(2, "0")).join("");
    if (h !== this.HASH) return false; sessionStorage.setItem("adm", "1"); return true;
  },
  isIn: () => sessionStorage.getItem("adm") === "1",
  logout() { sessionStorage.removeItem("adm"); location.reload(); }
};

const F = (key, label, type = "text", extra = {}) => ({ key, label, type, ...extra });
const SCHEMAS = {
  projects: { title: "Projects", cols: ["title", "category"], fields: [F("title", "Title"), F("category", "Category (e.g. Websites, E-Commerce)"), F("description", "Short description", "textarea", { full: 1 }), F("info", "Additional information", "textarea", { full: 1 }), F("technologies", "Technologies (comma separated)"), F("url", "Project URL", "url"), F("github", "GitHub URL (optional)", "url"), F("image", "Project image", "image", { full: 1 }), F("order", "Display order", "number"), F("enabled", "Visible on website", "check")] },
  services: { title: "Services", cols: ["icon", "title"], fields: [F("title", "Title"), F("icon", "Icon (emoji or symbol)"), F("description", "Description", "textarea", { full: 1 }), F("order", "Display order", "number")] },
  socials: { title: "Social / Contact", cols: ["name", "url"], fields: [F("name", "Platform name"), F("icon", "Icon (emoji or symbol)"), F("url", "URL (https://, mailto:, tel:)"), F("order", "Display order", "number"), F("enabled", "Enabled", "check")] },
  process: { title: "Process", cols: ["title", "description"], fields: [F("title", "Step title"), F("description", "Description", "textarea", { full: 1 }), F("order", "Display order", "number")] },
  statistics: { title: "Statistics", cols: ["number", "label"], fields: [F("number", "Number (e.g. 120+)"), F("label", "Label"), F("order", "Display order", "number")] }
};
const SETTINGS_FIELDS = [F("companyName", "Company name"), F("logo", "Logo", "image"), F("favicon", "Favicon", "image"), F("heroLabel", "Hero label"), F("heroTitle", "Hero title", "textarea", { full: 1 }), F("heroSubtitle", "Hero subtitle", "textarea", { full: 1 }), F("heroDescription", "Hero description", "textarea", { full: 1 }), F("ctaText", "CTA text"), F("ctaLink", "CTA link"), F("aboutText", "About text", "textarea", { full: 1 }), F("mission", "Mission", "textarea", { full: 1 }), F("approach", "Approach", "textarea", { full: 1 }), F("whyUs", "Why choose us (separate with |)", "textarea", { full: 1 }), F("contactTitle", "Contact title"), F("contactSub", "Contact subtitle"), F("footerText", "Footer text", "textarea", { full: 1 }), F("seoDescription", "SEO description", "textarea", { full: 1 })];
const APPEARANCE = [F("accent", "Accent color", "color"), F("bg", "Page background", "color"), F("text", "Text color", "color"), F("dark", "Dark section color", "color"), F("logo", "Company logo", "image")];

const fieldHtml = (f, v) => {
  const val = v ?? ""; const id = "f_" + f.key; const cls = `fld${f.full ? " full" : ""}`;
  if (f.type === "check") return `<div class="fld chk"><input type="checkbox" id="${id}" ${v !== false && (v || v === undefined) ? "checked" : ""}><label for="${id}">${f.label}</label></div>`;
  if (f.type === "textarea") return `<div class="${cls}"><label for="${id}">${f.label}</label><textarea id="${id}" rows="3">${esc(val)}</textarea></div>`;
  if (f.type === "image") return `<div class="${cls}"><label>${f.label}</label><img id="${id}_p" src="${esc(val)}" alt="" ${val ? "" : "hidden"}><input type="file" accept="image/*" data-up="${f.key}"><input type="hidden" id="${id}" value="${esc(val)}"><div class="prog" hidden><i></i></div></div>`;
  return `<div class="${cls}"><label for="${id}">${f.label}</label><input id="${id}" type="${f.type}" value="${esc(val)}"></div>`;
};
const readForm = (root, fields) => Object.fromEntries(fields.map(f => { const el = root.querySelector("#f_" + f.key); return [f.key, f.type === "check" ? el.checked : f.type === "number" ? Number(el.value) || 0 : el.value.trim()]; }));
const validUrl = (u) => { try { return ["http:", "https:", "mailto:", "tel:"].includes(new URL(u).protocol); } catch { return false; } };

function bindUploads(root) {
  root.querySelectorAll("[data-up]").forEach(inp => inp.addEventListener("change", async () => {
    const file = inp.files[0]; if (!file) return;
    const bar = inp.parentElement.querySelector(".prog"), fill = bar.firstElementChild; bar.hidden = false; fill.style.width = "35%";
    try {
      const url = await uploadImage(file); fill.style.width = "100%";
      root.querySelector("#f_" + inp.dataset.up).value = url;
      const p = root.querySelector(`#f_${inp.dataset.up}_p`); p.src = url; p.hidden = false; toast("Image uploaded.");
    } catch (e) { toast(e.message, "err"); }
    setTimeout(() => bar.hidden = true, 600);
  }));
}
const dialog = (html) => { $("mBody").innerHTML = html; $("modal").classList.add("open"); return $("mBody"); };
const closeDialog = () => $("modal").classList.remove("open");
$("modal").addEventListener("click", (e) => e.target.id === "modal" && closeDialog());

async function crud(name) {
  const sc = SCHEMAS[name], view = $("view");
  view.innerHTML = '<div class="sk"></div>';
  let items; try { items = await list(name); } catch (e) { view.innerHTML = `<p class="empty">Could not load ${name}: ${esc(e.message)}</p>`; return; }
  view.innerHTML = `<div class="bar"><span class="muted">${items.length} item(s)</span><button class="btn sm" id="add">Add new</button></div>` +
    (items.length ? `<div class="tw"><table class="tbl"><thead><tr><th>#</th>${sc.cols.map(c => `<th>${c}</th>`).join("")}<th></th></tr></thead><tbody>${items.map(i => `<tr><td>${i.order ?? ""}</td>${sc.cols.map(c => `<td>${esc(i[c])}</td>`).join("")}<td class="acts">${i.enabled === false ? '<span class="badge off">Hidden</span>' : ""}<button class="btn ghost sm" data-e="${i.id}">Edit</button><button class="btn danger sm" data-d="${i.id}">Delete</button></td></tr>`).join("")}</tbody></table></div>` : '<p class="empty">Nothing here yet. Add your first item.</p>');
  $("add").onclick = () => form(null);
  view.querySelectorAll("[data-e]").forEach(b => b.onclick = () => form(items.find(i => i.id === b.dataset.e)));
  view.querySelectorAll("[data-d]").forEach(b => b.onclick = () => {
    const d = dialog(`<h3>Delete this item?</h3><p class="muted">This cannot be undone.</p><div class="row"><button class="btn danger" id="yes">Delete</button><button class="btn ghost" id="no">Cancel</button></div>`);
    d.querySelector("#no").onclick = closeDialog;
    d.querySelector("#yes").onclick = async () => { try { await remove(name, b.dataset.d); toast("Deleted."); closeDialog(); crud(name); } catch (e) { toast("Delete failed: " + e.message, "err"); } };
  });
  function form(item) {
    const d = dialog(`<h3>${item ? "Edit" : "Add"} ${sc.title.toLowerCase()}</h3><div class="fgrid">${sc.fields.map(f => fieldHtml(f, item?.[f.key])).join("")}</div><div class="row"><button class="btn" id="sv">Save changes</button><button class="btn ghost" id="cx">Cancel</button></div>`);
    bindUploads(d); d.querySelector("#cx").onclick = closeDialog;
    d.querySelector("#sv").onclick = async (ev) => {
      const data = readForm(d, sc.fields);
      const first = sc.fields[0].key; if (!String(data[first]).trim()) return toast("Please fill in the first field.", "err");
      for (const f of sc.fields) if (f.type === "url" && data[f.key] && !validUrl(data[f.key])) return toast(`${f.label}: enter a valid URL starting with https://`, "err");
      if (name === "socials" && data.url && !validUrl(data.url)) return toast("Enter a valid URL.", "err");
      ev.target.disabled = true;
      try { await save(name, data, item?.id); toast("Saved."); closeDialog(); crud(name); } catch (e) { toast("Save failed: " + e.message, "err"); ev.target.disabled = false; }
    };
  }
}

async function settingsView(fields, title) {
  const s = await getSettings().catch(() => DEFAULTS);
  $("view").innerHTML = `<div class="panelx"><div class="fgrid">${fields.map(f => fieldHtml(f, s[f.key])).join("")}</div><button class="btn" id="ss">Save changes</button></div>`;
  bindUploads($("view"));
  $("ss").onclick = async (ev) => { ev.target.disabled = true; try { await saveSettings(readForm($("view"), fields)); toast(title + " saved."); } catch (e) { toast("Save failed: " + e.message, "err"); } ev.target.disabled = false; };
}

async function dashboard() {
  $("view").innerHTML = '<div class="sk"></div>';
  try {
    const [p, s, so] = await Promise.all(["projects", "services", "socials"].map(list));
    $("view").innerHTML = `<div class="kpis"><div class="kpi"><strong>${p.length}</strong>Projects</div><div class="kpi"><strong>${s.length}</strong>Services</div><div class="kpi"><strong>${so.filter(x => x.enabled !== false).length}</strong>Enabled social links</div><div class="kpi"><strong>Online</strong>Website status</div></div>
    <p class="demo"><b>Demo authentication.</b> The password is checked in the browser and is not secure. Move to Firebase Authentication and Firestore rules before production (see README).</p>`;
  } catch (e) { $("view").innerHTML = `<p class="empty">Firebase connection failed: ${esc(e.message)}. Check js/firebase-config.js.</p>`; }
}

const TABS = [["Dashboard", "Dashboard", dashboard], ["Website settings", "Website Settings", () => settingsView(SETTINGS_FIELDS, "Settings")], ["Projects", "Projects", () => crud("projects")], ["Services", "Services", () => crud("services")], ["Social / Contact", "Social / Contact", () => crud("socials")], ["About & statistics", "Statistics", () => crud("statistics")], ["Process", "Process", () => crud("process")], ["Appearance", "Appearance", () => settingsView(APPEARANCE, "Appearance")]];
function start() {
  $("login").hidden = true; $("app").hidden = false;
  $("tabs").innerHTML = TABS.map((t, i) => `<button data-i="${i}">${t[0]}</button>`).join("");
  $("tabs").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; open(+b.dataset.i); $("side").classList.remove("open"); };
  const open = (i) => { [...$("tabs").children].forEach((c, j) => c.classList.toggle("on", i === j)); $("title").textContent = TABS[i][1]; TABS[i][2](); };
  $("sb").onclick = () => $("side").classList.toggle("open"); $("out").onclick = () => auth.logout(); open(0);
}
$("lf").addEventListener("submit", async (e) => { e.preventDefault(); (await auth.login($("pw").value)) ? start() : toast("Incorrect password.", "err"); });
auth.isIn() ? start() : ($("login").hidden = false);
