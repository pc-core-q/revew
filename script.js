'use strict';

/* ========== 1. CONFIGURATION & CLOUD SETTINGS ========== */

const AUTH = { user: 'admin', pass: '1234' };

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDIEYaEcIrnJSEBhm-7wWijmoOPM_QHYjU",
  authDomain: "revew-f8136.firebaseapp.com",
  databaseURL: "https://revew-f8136-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "revew-f8136",
  storageBucket: "revew-f8136.firebasestorage.app",
  messagingSenderId: "775725909156",
  appId: "1:775725909156:web:952c856e306b94ac84d231"
};

const UPLOAD_PROVIDER = 'imgbb';
const IMGBB_API_KEY = "820a1a52d1b835874a9200fe7d3bb6b3";
const IMAGEKIT_PUBLIC_KEY = "YOUR_IMAGEKIT_PUBLIC_KEY";
const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/YOUR_IMAGEKIT_ID";

/* ========== 2. UTILS & HELPERS ========== */
const $ = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s !== null && s !== undefined ? s : '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Date.now() + Math.floor(Math.random() * 1000);

const ICONS = {
  code: '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>',
  cart: '<path d="M3 4h2l2 11h11l2-8H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/>',
  device: '<rect x="3" y="4" width="14" height="11" rx="2"/><rect x="15" y="9" width="6" height="11" rx="1.5"/>',
  rocket: '<path d="M5 19c0-4 2-6 4-7M12 12c2-6 6-8 9-8 0 3-2 7-8 9zM9 15l-2 4 4-2"/>',
  gauge: '<path d="M4 17a8 8 0 1116 0"/><path d="M12 17l4-6"/>',
  wrench: '<path d="M14 6a4 4 0 005 5l-9 9a2 2 0 01-3-3l9-9a4 4 0 00-2-2z"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>'
};
const ICON_AR = { code: 'برمجة', cart: 'سلة', device: 'أجهزة', rocket: 'صاروخ', gauge: 'أداء', wrench: 'صيانة', layers: 'طبقات' };
const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] ? ICONS[n] : ICONS.code}</svg>`;
const art = (t, h) => 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},85%,62%)"/><stop offset="1" stop-color="hsl(${h + 45},80%,42%)"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/><g stroke="#fff" stroke-opacity=".45" fill="none"><path d="M0 300h640M0 340h640M120 0v400M240 0v400"/><rect x="60" y="70" width="520" height="260" rx="14"/></g><text x="320" y="225" text-anchor="middle" font-family="Segoe UI,sans-serif" font-size="56" font-weight="600" fill="#fff">${t}</text></svg>`);
const DEFAULT_LOGO = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M16 3l11 6.5v13L16 29 5 22.5v-13z"/><path d="M11 21V11l10 10V11"/></svg>';

/* ========== 3. DEFAULT DATA ========== */
const makeDefaults = () => ({
  info: {
    name: 'نكسورا للتقنية', logo: '', favicon: '',
    heroTitle: 'نبني تجارب رقمية تدفع أعمالك إلى الأمام.',
    heroText: 'نصمّم ونطوّر مواقع إلكترونية حديثة وسريعة وحلولًا رقمية للشركات التي تريد التميّز والنمو.',
    about: 'نكسورا شركة متخصصة في تطوير المواقع الإلكترونية والتجارب الرقمية الحديثة. نجمع بين الهندسة النظيفة والتصميم الدقيق ليكون كل مشروع سريعًا وموثوقًا وسهل الصيانة.',
    email: 'hello@example.com', phone: '+966 50 000 0000', address: 'شار
