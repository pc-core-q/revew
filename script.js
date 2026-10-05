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
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
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
    email: 'hello@example.com', phone: '+966 50 000 0000', address: 'شارع الأعمال، مدينتك'
  },
  stats: [
    { id: 1, value: '10+', label: 'مشاريع منجزة' }, { id: 2, value: '100%', label: 'متجاوب مع جميع الشاشات' },
    { id: 3, value: 'حديثة', label: 'تقنيات' }, { id: 4, value: 'العميل', label: 'محور اهتمامنا' }
  ],
  services: [
    { id: 1, icon: 'code', title: 'تطوير مواقع مخصصة', desc: 'مواقع مبنية يدويًا بما يناسب علامتك التجارية وأهدافك.' },
    { id: 2, icon: 'cart', title: 'مواقع التجارة الإلكترونية', desc: 'متاجر إلكترونية سريعة التصفح وسهلة الإدارة.' },
    { id: 3, icon: 'device', title: 'تصميم متجاوب', desc: 'تصاميم تعمل بإتقان على الجوال والتابلت والكمبيوتر.' },
    { id: 4, icon: 'rocket', title: 'صفحات الهبوط', desc: 'صفحات مركّزة تحوّل الزائر إلى عميل.' },
    { id: 5, icon: 'gauge', title: 'تحسين أداء المواقع', desc: 'تحميل أسرع وظهور أفضل في محركات البحث.' },
    { id: 6, icon: 'wrench', title: 'صيانة المواقع', desc: 'تحديثات وإصلاحات ومراقبة ليبقى موقعك بصحة جيدة.' },
    { id: 7, icon: 'layers', title: 'تنفيذ واجهات المستخدم', desc: 'نحوّل التصاميم إلى واجهات دقيقة ويسهل الوصول إليها.' }
  ],
  projects: [
    { id: 1, title: 'متجر أطلس', description: 'متجر إلكتروني سريع مع سلة مشتريات وطلب عبر واتساب.', category: 'تجارة إلكترونية', image: art('أطلس', 210), url: 'https://example.com', technologies: ['HTML', 'CSS', 'JavaScript'] },
    { id: 2, title: 'عيادة بريت لاين', description: 'موقع عيادة أنيق مع حجز المواعيد وصفحات الخدمات.', category: 'أعمال', image: art('بريت لاين', 170), url: 'https://example.com', technologies: ['HTML', 'CSS', 'JavaScript'] },
    { id: 3, title: 'أوربت للإطلاق', description: 'صفحة هبوط لمنتج بنسبة تحويل عالية وأقسام متحركة.', category: 'صفحة هبوط', image: art('أوربت', 260), url: 'https://example.com', technologies: ['HTML', 'CSS'] },
    { id: 4, title: 'استوديو كورا', description: 'موقع أعمال لاستوديو تصميم مع معرض صور قابل للتصفية.', category: 'معرض أعمال', image: art('كورا', 330), url: 'https://example.com', technologies: ['HTML', 'CSS', 'JavaScript'] }
  ],
  social: { github: '', linkedin: '', twitter: '', instagram: '' }
});

/* ========== 4. CLOUD SYNC & FIREBASE INIT ========== */
let DB = makeDefaults();
let dbRef = null;

const isFirebaseConfigured = Boolean(FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('YOUR_'));

if (isFirebaseConfigured && typeof firebase !== 'undefined') {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    dbRef = firebase.database().ref('nexora_data');
    
    dbRef.on('value', snapshot => {
      const val = snapshot.val();
      if (val) {
        DB = Object.assign(makeDefaults(), val);
      } else {
        dbRef.set(makeDefaults());
      }
      render();
      if (!$('#admin').hidden) adminView();
    }, err => {
      console.error('Firebase error:', err);
      toast('تعذر جلب البيانات من السحابة.', 'error');
    });
  } catch (e) {
    console.error('Firebase init failed:', e);
  }
} else {
  try {
    const raw = localStorage.getItem('nexora_site_v3');
    if (raw) DB = Object.assign(makeDefaults(), JSON.parse(raw));
  } catch (e) {}
}

async function saveData() {
  if (dbRef) {
    try {
      await dbRef.set(DB);
      toast('تم حفظ التغييرات ومزامنتها سحابياً.');
      return true;
    } catch (e) {
      console.error(e);
      toast('خطأ في مزامنة البيانات السحابية: ' + e.message, 'error');
      return false;
    }
  } else {
    try {
      localStorage.setItem('nexora_site_v3', JSON.stringify(DB));
      render();
      toast('تم الحفظ محلياً.');
      return true;
    } catch (e) {
      toast('تعذّر الحفظ لامتلاء المساحة.', 'error');
      return false;
    }
  }
}

/* ========== 5. CLOUD IMAGE UPLOAD ========== */
async function uploadToCloud(file) {
  if (UPLOAD_PROVIDER === 'imgbb') {
    if (!IMGBB_API_KEY || IMGBB_API_KEY.startsWith('YOUR_')) {
      throw new Error('يرجى التأكد من مفتاح IMGBB_API_KEY داخل script.js');
    }
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: fd
    });
    const json = await res.json();
    if (json && json.success) return json.data.url;
    const msg = (json && json.error && json.error.message) ? json.error.message : 'فشل رفع الصورة إلى ImgBB';
    throw new Error(msg);
  }

  if (UPLOAD_PROVIDER === 'imagekit') {
    if (!IMAGEKIT_PUBLIC_KEY || IMAGEKIT_PUBLIC_KEY.startsWith('YOUR_')) {
      throw new Error('يرجى التأكد من مفتاح IMAGEKIT_PUBLIC_KEY داخل script.js');
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('fileName', file.name ? file.name : `img_${Date.now()}`);
    fd.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: fd
    });
    const json = await res.json();
    if (json && json.url) return json.url;
    const msg = (json && json.message) ? json.message : 'فشل رفع الصورة إلى ImageKit';
    throw new Error(msg);
  }

  throw new Error('مزود خدمة رفع الصور غير مدعوم.');
}

/* ========== 6. WEBSITE RENDERING ========== */
function logoHTML() { return DB.info.logo ? `<img src="${esc(DB.info.logo)}" alt="شعار ${esc(DB.info.name)}">` : DEFAULT_LOGO; }

function render() {
  const i = DB.info;
  document.title = i.name;
  const defaultFavicon = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#3da5ff"/></svg>');
  $('#favicon').href = i.favicon ? i.favicon : defaultFavicon;   $$('.brand-mark').forEach(e => e.innerHTML = logoHTML());$$('.brand-name').forEach(e => e.textContent = i.name);$('#heroTitle').textContent = i.heroTitle;
  $('#heroText').textContent = i.heroText;
  $('#aboutText').textContent = i.about;
  $('#footDesc').textContent = i.about.slice(0, 140) + (i.about.length > 140 ? '…' : '');
  $('#copy').textContent = `© ${new Date().getFullYear()} ${i.name}. جميع الحقوق محفوظة.`;
  $('#startProject').href = i.email ? 'mailto:' + i.email : '#contact';
  $('#contactInfo').innerHTML = [
    i.email && `<a href="mailto:${esc(i.email)}">${esc(i.email)}</a>`,
    i.phone && `<div><bdi>${esc(i.phone)}</bdi></div>`,
    i.address && `<div>${esc(i.address)}</div>`
  ].filter(Boolean).join('');
  $('#social').innerHTML = Object.entries(DB.social).filter(([, u]) => u).map(([k, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${k}">${k[0].toUpperCase() + k.slice(1)}</a>`).join('');
  $('#stats').innerHTML = DB.stats.map(s => `<div class="stat"><b data-count="${esc(s.value)}">${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('');
  
  const servicesHtml = DB.services.map(s => `<article class="card rv">${icon(s.icon)}<h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></article>`).join('');
  $('#services-list').innerHTML = servicesHtml ? servicesHtml : '<p class="empty">لا توجد خدمات بعد.</p>';
  
  const projectsHtml = DB.projects.map(p => `<article class="proj rv"><div class="thumb"><img src="${esc(p.image)}" alt="لقطة من موقع ${esc(p.title)}" loading="lazy"><div class="ov"><span class="cat">${esc(p.category)}</span></div></div><div class="body"><span class="cat">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="tags">${(p.technologies || []).map(t => `<span>${esc(t)}</span>`).join('')}</div><a class="btn small" href="${esc(p.url)}" target="_blank" rel="noopener">زيارة الموقع</a></div></article>`).join('');
  $('#project-list').innerHTML = projectsHtml ? projectsHtml : '<p class="empty">لا توجد مشاريع بعد.</p>';
  observe();
}

/* ========== 7. PROJECT MANAGEMENT ========== */
const PROJECT_FIELDS = [
  { k: 'title', label: 'اسم المشروع', req: 1 }, { k: 'description', label: 'الوصف', type: 'textarea', req: 1 },
  { k: 'category', label: 'التصنيف', req: 1 }, { k: 'url', label: 'رابط الموقع', type: 'url', req: 1 },
  { k: 'image', label: 'صورة المشروع', type: 'image' }, { k: 'technologies', label: 'التقنيات المستخدمة (مفصولة بفواصل)', type: 'tags' }
];
function editProject(id) {
  const p = DB.projects.find(x => x.id === id);
  openForm({ title: p ? 'تعديل المشروع' : 'إضافة مشروع', fields: PROJECT_FIELDS, values: p ? p : { technologies: [] }, async onSave(v) {
    if (!v.image) v.image = art(v.title.slice(0, 10), 200);
    if (p) Object.assign(p, v); else DB.projects.push({ id: uid(), ...v });
    if (!await saveData()) return false;
    adminView(); return true;
  } });
}
function deleteProject(id) {
  confirmBox('هل تريد حذف هذا المشروع؟ لا يمكن التراجع عن ذلك.', async () => {
    DB.projects = DB.projects.filter(x => x.id !== id);
    await saveData();
    adminView();
  });
}

/* ========== 8. SERVICE MANAGEMENT ========== */
const SERVICE_FIELDS = [
  { k: 'title', label: 'العنوان', req: 1 }, { k: 'desc', label: 'الوصف', type: 'textarea', req: 1 },
  { k: 'icon', label: 'الأيقونة', type: 'select', opts: Object.keys(ICONS) }
];
function editService(id) {
  const s = DB.services.find(x => x.id === id);
  openForm({ title: s ? 'تعديل الخدمة' : 'إضافة خدمة', fields: SERVICE_FIELDS, values: s ? s : { icon: 'code' }, async onSave(v) {
    if (s) Object.assign(s, v); else DB.services.push({ id: uid(), ...v });
    if (!await saveData()) return false;
    adminView(); return true;
  } });
}
function deleteService(id) {
  confirmBox('هل تريد حذف هذه الخدمة؟', async () => {
    DB.services = DB.services.filter(x => x.id !== id);
    await saveData();
    adminView();
  });
}

/* ========== 9. ADMIN AUTHENTICATION ========== */
const isAuthed = () => sessionStorage.getItem('nexora_admin') === '1';
function openLogin() {
  if (isAuthed()) return openAdmin();
  openForm({ title: 'تسجيل دخول المشرف', submit: 'دخول', fields: [{ k: 'user', label: 'اسم المستخدم', req: 1 }, { k: 'pass', label: 'كلمة المرور', type: 'password', req: 1 }], values: {},
    note: 'المصادقة محمية لجلسة التصفح الحالية.',
    onSave(v) {
      if (v.user === AUTH.user && v.pass === AUTH.pass) { sessionStorage.setItem('nexora_admin', '1'); toast('مرحبًا بعودتك.'); openAdmin(); return true; }
      toast('اسم المستخدم أو كلمة المرور غير صحيحة.', 'error'); return false;
    } });
}
function logout() { sessionStorage.removeItem('nexora_admin'); $('#admin').hidden = true; document.body.style.overflow = ''; toast('تم تسجيل الخروج.'); }

/* ========== 10. ADMIN DASHBOARD ========== */
let current = 'dash', query = '';
const NAV = [['dash', 'لوحة التحكم'], ['projects', 'المشاريع'], ['services', 'الخدمات'], ['website', 'الموقع'], ['social', 'روابط التواصل'], ['settings', 'الإعدادات']];
function openAdmin() { $('#admin').hidden = false; document.body.style.overflow = 'hidden'; current = 'dash'; adminView(); }
function adminView() {
  const A = $('#admin');
  A.innerHTML = `<aside class="side"><a class="brand" href="#" data-go="exit"><span class="brand-mark">${logoHTML()}</span>الإدارة</a>${NAV.map(([k, l]) => `<button data-go="${k}" class="${k === current ? 'on' : ''}">${l}</button>`).join('')}<button data-go="exit">عرض الموقع</button><button data-go="logout">تسجيل الخروج</button></aside><section class="amain" id="amain">${VIEWS[current]()}</section>`;
  const s = $('.search', A);
  if (s) {
    s.value = query;
    s.addEventListener('input', e => {
      query = e.target.value;
      const pos = e.target.selectionStart;
      adminView();
      const n = $('.search');
      if (n) { n.focus(); n.setSelectionRange(pos, pos); }
    });
  }
}
const q = t => !query || t.toLowerCase().includes(query.toLowerCase());
const VIEWS = {
  dash: () => `<div class="ahead"><h2>لوحة التحكم</h2></div><div class="acards"><div class="acard"><b>${DB.projects.length}</b><span>المشاريع</span></div><div class="acard"><b>${DB.services.length}</b><span>الخدمات</span></div><div class="acard"><b>${Object.values(DB.social).filter(Boolean).length}</b><span>روابط التواصل المضافة</span></div><div class="acard"><b>${DB.stats.length}</b><span>الإحصائيات</span></div></div><div class="panel"><h3>إجراءات سريعة</h3><p>المزامنة سحابية وتظهر التعديلات مباشرة على الموقع لكل المستخدمين.</p><button class="btn" data-act="add-project">إضافة مشروع</button> <button class="btn ghost" data-act="add-service">إضافة خدمة</button></div>`,
  projects: () => { 
    const l = DB.projects.filter(p => q(p.title + p.category)); 
    const rows = l.map(p => `<div class="row"><img src="${esc(p.image)}" alt=""><div class="grow"><b>${esc(p.title)}</b><small>${esc(p.category)} · ${esc(p.url)}</small></div><button class="btn small ghost" data-act="edit-project" data-id="${p.id}">تعديل</button><button class="btn small danger" data-act="del-project" data-id="${p.id}">حذف</button></div>`).join('');
    return `<div class="ahead"><h2>المشاريع</h2><input class="search" style="max-width:240px" placeholder="ابحث في المشاريع" aria-label="ابحث في المشاريع"><button class="btn" data-act="add-project">إضافة مشروع</button></div>${rows ? rows : '<p class="empty">لا توجد مشاريع. أضف أول مشروع ليظهر في الموقع.</p>'}`; 
  },
  services: () => { 
    const l = DB.services.filter(s => q(s.title)); 
    const rows = l.map(s => `<div class="row"><span class="ic">${icon(s.icon)}</span><div class="grow"><b>${esc(s.title)}</b><small>${esc(s.desc)}</small></div><button class="btn small ghost" data-act="edit-service" data-id="${s.id}">تعديل</button><button class="btn small danger" data-act="del-service" data-id="${s.id}">حذف</button></div>`).join('');
    return `<div class="ahead"><h2>الخدمات</h2><input class="search" style="max-width:240px" placeholder="ابحث في الخدمات" aria-label="ابحث في الخدمات"><button class="btn" data-act="add-service">إضافة خدمة</button></div>${rows ? rows : '<p class="empty">لا توجد خدمات.</p>'}`; 
  },
  website: () => `<div class="ahead"><h2>الموقع</h2></div><div class="panel"><h3>الشركة والقسم الرئيسي والتواصل</h3><p>اسم الشركة ونصوص الواجهة ونبذة عنا والبريد والهاتف والعنوان.</p><button class="btn" data-act="edit-info">تعديل معلومات الموقع</button></div><div class="panel"><h3>الشعار والأيقونة</h3><p>استخدم رابط صورة أو ارفع ملفًا مباشرة عبر السحابة.</p><button class="btn" data-act="edit-brand">تغيير الشعار والأيقونة</button></div><div class="panel"><h3>الإحصائيات</h3><p>${DB.stats.map(s => esc(s.value + ' ' + s.label)).join(' · ')}</p><button class="btn" data-act="edit-stats">تعديل الإحصائيات</button> <button class="btn ghost" data-act="add-stat">إضافة إحصائية</button></div>`,
  social: () => `<div class="ahead"><h2>روابط التواصل</h2></div><div class="panel"><p>الروابط الفارغة لا تظهر في الموقع.</p><button class="btn" data-act="edit-social">تعديل روابط التواصل</button></div>`,
  settings: () => `<div class="ahead"><h2>الإعدادات</h2></div><div class="panel"><h3>إعادة البيانات الافتراضية</h3><p>تحذف كل تغييراتك من السحابة وتستعيد المحتوى المبدئي.</p><button class="btn danger" data-act="reset">إعادة البيانات الافتراضية</button></div>`
};
const INFO_FIELDS = [['name', 'اسم الشركة'], ['heroTitle', 'عنوان القسم الرئيسي'], ['heroText', 'وصف القسم الرئيسي', 'textarea'], ['about', 'نبذة عن الشركة', 'textarea'], ['email', 'البريد الإلكتروني', 'email'], ['phone', 'رقم الهاتف'], ['address', 'العنوان']].map(([k, label, type]) => ({ k, label, type, req: k === 'name' || k === 'heroTitle' }));

function adminAction(a, id) {
  const acts = {
    'add-project': () => editProject(), 'edit-project': () => editProject(id), 'del-project': () => deleteProject(id),
    'add-service': () => editService(), 'edit-service': () => editService(id), 'del-service': () => deleteService(id),
    'edit-info': () => openForm({ title: 'معلومات الموقع', fields: INFO_FIELDS, values: DB.info, onSave: async v => await saved(() => Object.assign(DB.info, v)) }),
    'edit-brand': () => openForm({ title: 'الشعار والأيقونة', fields: [{ k: 'logo', label: 'الشعار', type: 'image' }, { k: 'favicon', label: 'أيقونة الموقع', type: 'image' }], values: DB.info, onSave: async v => await saved(() => Object.assign(DB.info, v)) }),
    'edit-social': () => openForm({ title: 'روابط التواصل', fields: Object.keys(DB.social).map(k => ({ k, label: 'رابط ' + k[0].toUpperCase() + k.slice(1), type: 'url' })), values: DB.social, onSave: async v => await saved(() => Object.assign(DB.social, v)) }),
    'edit-stats': () => openForm({ title: 'الإحصائيات', fields: DB.stats.flatMap((s, n) => [{ k: 'v' + n, label: `القيمة ${n + 1}`, req: 1 }, { k: 'l' + n, label: `الوصف ${n + 1}`, req: 1 }]), values: Object.fromEntries(DB.stats.flatMap((s, n) => [['v' + n, s.value], ['l' + n, s.label]])), onSave: async v => await saved(() => DB.stats.forEach((s, n) => { s.value = v['v' + n]; s.label = v['l' + n]; })) }),
    'add-stat': () => openForm({ title: 'إضافة إحصائية', fields: [{ k: 'value', label: 'القيمة (مثال: 25+)', req: 1 }, { k: 'label', label: 'الوصف', req: 1 }], values: {}, onSave: async v => await saved(() => DB.stats.push({ id: uid(), ...v })) }),
    reset: () => confirmBox('هل تريد إعادة كل بيانات الموقع إلى الوضع الافتراضي؟ ستُفقد تغييراتك.', async () => { DB = makeDefaults(); await saveData(); adminView(); })
  };
  if (acts[a]) acts[a]();
}
async function saved(fn) { fn(); const ok = await saveData(); if (ok) adminView(); return ok; }

/* ========== 11. MODALS, TOASTS, FORMS ========== */
function toast(msg, type = '') {
  const t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg; $('#toasts').append(t); setTimeout(() => t.remove(), 3500);
}
function modal(html) {
  const bg = document.createElement('div'); bg.className = 'mbg'; bg.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  const prev = document.activeElement;
  const close = () => { bg.remove(); document.removeEventListener('keydown', esc_); if (prev && prev.focus) prev.focus(); };
  const esc_ = e => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', esc_); bg.addEventListener('mousedown', e => { if (e.target === bg) close(); });
  document.body.append(bg); (bg.querySelector('input,textarea,select,button') || bg).focus();
  return { bg, close };
}
function confirmBox(msg, onYes) {
  const m = modal(`<h3>تأكيد الإجراء</h3><p>${esc(msg)}</p><div class="acts"><button class="btn ghost" data-n>إلغاء</button><button class="btn danger" data-y>تأكيد</button></div>`);
  $('[data-n]', m.bg).onclick = m.close; $('[data-y]', m.bg).onclick = () => { m.close(); onYes(); };
}
function openForm({ title, fields, values, onSave, submit = 'حفظ التغييرات', note = '' }) {
  const uploads = {};
  const field = f => {
    const v = (values[f.k] !== undefined && values[f.k] !== null) ? values[f.k] : '';
    const id = 'f_' + f.k;
    let input;
    if (f.type === 'textarea') input = `<textarea id="${id}" rows="4">${esc(v)}</textarea>`;
    else if (f.type === 'select') input = `<select id="${id}">${f.opts.map(o => `<option value="${o}" ${o === v ? 'selected' : ''}>${ICON_AR[o] ? ICON_AR[o] : o}</option>`).join('')}</select>`;
    else if (f.type === 'tags') input = `<input id="${id}" value="${esc((v || []).join(', '))}">`;
    else if (f.type === 'image') input = `<input id="${id}" dir="ltr" placeholder="رابط الصورة المباشر" value="${esc(v)}"><input type="file" accept="image/*" data-file="${f.k}" aria-label="رفع صورة إلى السحابة" style="margin-top:.5rem"><img class="pv" src="${esc(v)}" alt="معاينة" ${v ? '' : 'hidden'}>`;
    else input = `<input id="${id}" type="${f.type ? f.type : 'text'}" value="${esc(v)}">`;
    return `<div class="f"><label for="${id}">${f.label}${f.req ? ' *' : ''}</label>${input}<span class="err"></span></div>`;
  };
  const m = modal(`<h3>${title}</h3><form novalidate>${fields.map(field).join('')}${note ? `<p class="demo">${note}</p>` : ''}<div class="acts"><button type="button" class="btn ghost" data-n>إلغاء</button><button class="btn">${submit}</button></div></form>`);
  const form = $('form', m.bg);$('[data-n]', m.bg).onclick = m.close;
  const imgOf = k => uploads[k] ? uploads[k] : $('#f_' + k, m.bg).value.trim();    $$('[data-file]', m.bg).forEach(inp => inp.addEventListener('change', async () => {
    const file = inp.files[0];
    if (!file) return;

    const key = inp.dataset.file;
    const urlInput = $('#f_' + key, m.bg);     const pv = inp.parentNode.querySelector('.pv');      try {       inp.disabled = true;       toast('جاري رفع الصورة إلى السحابة...', 'info');       const cloudUrl = await uploadToCloud(file);       uploads[key] = cloudUrl;       if (urlInput) urlInput.value = cloudUrl;       if (pv) { pv.src = cloudUrl; pv.hidden = false; }       toast('تم رفع الصورة بنجاح!');     } catch (err) {       console.error(err);       toast(err.message, 'error');       inp.value = '';     } finally {       inp.disabled = false;     }   }));    $$('input[id^=f_]', m.bg).forEach(inp => inp.addEventListener('input', () => {
    const f = fields.find(x => 'f_' + x.k === inp.id);
    if (f && f.type === 'image') {
      delete uploads[f.k];
      const pv = inp.parentNode.querySelector('.pv');
      pv.src = inp.value;
      pv.hidden = !inp.value;
    }
  }));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    const out = {};
    fields.forEach(f => {
      const el = $('#f_' + f.k, m.bg), box = el.closest('.f');
      let val = f.type === 'image' ? imgOf(f.k) : el.value.trim(), msg = '';
      if (f.req && !val) msg = 'هذا الحقل مطلوب.';
      else if (f.type === 'url' && val && !/^https?:\/\//i.test(val)) msg = 'أدخل رابطًا كاملًا يبدأ بـ http:// أو https://';
      else if (f.type === 'email' && val && !/^\S+@\S+\.\S+$/.test(val)) msg = 'أدخل بريدًا إلكترونيًا صحيحًا.';
      box.classList.toggle('bad', Boolean(msg));
      $('.err', box).textContent = msg;       if (msg) ok = false;       out[f.k] = f.type === 'tags' ? val.split(',').map(t => t.trim()).filter(Boolean) : val;     });      if (ok) {       const savedOk = await onSave(out);       if (savedOk !== false) m.close();     }   }); }  /* ========== 12. ANIMATIONS & SCROLL ========== */ const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; let io, counted = new WeakSet(); function observe() {   if (!io) {     io = new IntersectionObserver(es => es.forEach(e => {       if (!e.isIntersecting) return;       e.target.classList.add('in');       io.unobserve(e.target);       $$('[data-count]', e.target).forEach(countUp);
    }), { threshold: .15 });
  }
  $$('.rv:not(.in)').forEach(el => io.observe(el));$$
('[data-count]').forEach(el => {
    if (!el.closest('.rv') && !counted.has(el)) io.observe(el.parentNode);
  });
}

function countUp(el) {
  if (counted.has(el)) return;
  counted.add(el);
  const m = /^(\d+)(.*)$/.exec(el.dataset.count);
  if (!m || reduce) return;
  const end = +m[1], t0 = performance.now();
  (function tick(t) {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + m[2];
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

function onScroll() {
  $('#nav').classList.toggle('scrolled', scrollY > 30);
  const h = document.documentElement;
  $('#progress').style.width = (scrollY / (h.scrollHeight - h.clientHeight || 1) * 100) + '%';
}

/* ========== 13. EVENT LISTENERS & LIFECYCLE ========== */
$('#burger').addEventListener('click', () => {
  const o = $('#menu').classList.toggle('open');
  $('#burger').classList.toggle('open', o);
  $('#burger').setAttribute('aria-expanded', o);
});

$('#menu').addEventListener('click', e => {
  if (e.target.tagName === 'A') {
    $('#menu').classList.remove('open');
    $('#burger').classList.remove('open');
  }
});

$('#adminBtn').addEventListener('click', openLogin);

$('#admin').addEventListener('click', async e => {
  const go = e.target.closest('[data-go]'), act = e.target.closest('[data-act]');
  if (go) {
    e.preventDefault();
    const k = go.dataset.go;
    if (k === 'logout') logout();
    else if (k === 'exit') { $('#admin').hidden = true; document.body.style.overflow = ''; }
    else { current = k; query = ''; adminView(); }
  }
  if (act) adminAction(act.dataset.act, +act.dataset.id);
});

addEventListener('scroll', onScroll, { passive: true });

function hideLoader() {
  const l = $('#loader');
  if (l) l.classList.add('done');
}

if (document.readyState === 'complete') hideLoader();
else addEventListener('load', hideLoader);
setTimeout(hideLoader, 1500);

render();
onScroll();
