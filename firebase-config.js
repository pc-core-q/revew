import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDIEyaEcIrnJSEBhm-7wWijmoOPM_QHYjU",
  authDomain: "revew-f8136.firebaseapp.com",
  databaseURL: "https://revew-f8136-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "revew-f8136",
  storageBucket: "revew-f8136.firebasestorage.app",
  messagingSenderId: "775725909156",
  appId: "1:775725909156:web:952c856e306b94ac84d231"
};

// تهيئة تطبيق فايربيس وقاعدة البيانات
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
