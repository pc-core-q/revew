import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { IMGBB_API_KEY } from "./imagebb-config.js";

const db = getFirestore(initializeApp(firebaseConfig));

export const DEFAULTS = {
  companyName: "Nexora", logo: "", favicon: "", accent: "#FF6B2C", bg: "#F7F8FA", text: "#111111", dark: "#111111",
  heroLabel: "TECHNOLOGY • DESIGN • DEVELOPMENT",
  heroTitle: "Building Digital Experiences That Move Businesses Forward.",
  heroSubtitle: "Modern websites, e-commerce platforms and digital products.",
  heroDescription: "We design and engineer fast, reliable and beautiful web experiences for ambitious businesses.",
  ctaText: "Start a Project", ctaLink: "#contact",
  aboutText: "We are a technology studio focused on crafting websites and digital products that perform.",
  mission: "Turn ideas into dependable digital products.", approach: "Clear communication, clean code and measurable results.",
  whyUs: "Modern technology|Clean & scalable code|Responsive design|Fast performance|Transparent communication|Continuous support",
  contactTitle: "Have a project in mind?", contactSub: "Let's build something great.",
  footerText: "A technology studio building modern websites and digital products.", seoDescription: "Professional technology company portfolio."
};

export const list = async (name) => {
  const s = await getDocs(collection(db, name));
  return s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
};
export const getSettings = async () => { const s = await getDoc(doc(db, "settings", "main")); return { ...DEFAULTS, ...(s.exists() ? s.data() : {}) }; };
export const saveSettings = (data) => setDoc(doc(db, "settings", "main"), data, { merge: true });
export const save = (name, data, id) => id ? updateDoc(doc(db, name, id), data) : addDoc(collection(db, name), data);
export const remove = (name, id) => deleteDoc(doc(db, name, id));

export async function uploadImage(file) {
  if (!file || !file.type.startsWith("image/")) throw new Error("Choose an image file.");
  if (file.size > 32 * 1024 * 1024) throw new Error("Image must be under 32 MB.");
  const fd = new FormData(); fd.append("image", file);
  const r = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok || !j.success) throw new Error(j?.error?.message || "ImageBB upload failed. Check your API key.");
  return j.data.url;
}

export const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const safeUrl = (u = "") => { try { const x = new URL(u); return ["http:", "https:", "mailto:", "tel:"].includes(x.protocol) ? x.href : ""; } catch { return ""; } };

export function toast(msg, type = "ok") {
  let box = document.getElementById("toasts");
  if (!box) { box = document.createElement("div"); box.id = "toasts"; box.setAttribute("aria-live", "polite"); document.body.append(box); }
  const t = document.createElement("div"); t.className = "toast " + type; t.textContent = msg; box.append(t);
  setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 3800);
}
