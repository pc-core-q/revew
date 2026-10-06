import { useEffect, useState } from "react";
import { X, Trash2, Plus, LogOut } from "lucide-react";
import type { Project, SiteTexts } from "@/lib/site-store";

const ADMIN_PASSWORD = "1234";

const TEXT_FIELDS: { key: keyof SiteTexts; label: string; long?: boolean }[] = [
  { key: "brand", label: "اسم الموقع" },
  { key: "heroTitle", label: "العنوان الرئيسي" },
  { key: "heroDescription", label: "وصف الواجهة", long: true },
  { key: "heroCta", label: "نص الزر" },
  { key: "aboutTitle", label: "عنوان من نحن" },
  { key: "aboutText", label: "نص من نحن", long: true },
  { key: "servicesTitle", label: "عنوان الخدمات" },
  { key: "portfolioTitle", label: "عنوان الأعمال" },
  { key: "contactPhone", label: "رقم الهاتف" },
  { key: "contactEmail", label: "البريد الإلكتروني" },
  { key: "contactAddress", label: "العنوان" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  texts: SiteTexts;
  projects: Project[];
  saveTexts: (t: SiteTexts) => void;
  saveProjects: (p: Project[]) => void;
};

const input =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function AdminPanel({ open, onClose, texts, projects, saveTexts, saveProjects }: Props) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"projects" | "texts">("projects");
  const [draft, setDraft] = useState<SiteTexts>(texts);
  const [saved, setSaved] = useState(false);
  const [np, setNp] = useState({ name: "", description: "", image: "", url: "" });

  useEffect(() => setDraft(texts), [texts]);
  useEffect(() => {
    if (!open) { setPw(""); setError(""); }
  }, [open]);

  if (!open) return null;

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) { setAuthed(true); setError(""); }
    else setError("كلمة المرور غير صحيحة");
  };

  const addProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!np.name || !np.url) return;
    saveProjects([...projects, { id: crypto.randomUUID(), ...np }]);
    setNp({ name: "", description: "", image: "", url: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm animate-in fade-in">
      <div className={`relative w-full rounded-2xl bg-card shadow-lift animate-in zoom-in-95 ${authed ? "max-w-4xl" : "max-w-sm"} max-h-[90vh] overflow-y-auto`}>
        <button onClick={onClose} aria-label="إغلاق" className="absolute left-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted">
          <X className="h-5 w-5" />
        </button>

        {!authed ? (
          <form onSubmit={login} className="space-y-4 p-8">
            <h2 className="text-xl font-bold">تسجيل دخول المسؤول</h2>
            <input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} placeholder="أدخل كلمة المرور" className={input} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button className="w-full rounded-lg bg-gradient-primary py-2.5 font-semibold text-primary-foreground hover:opacity-90">دخول</button>
          </form>
        ) : (
          <div className="p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 pl-8">
              <h2 className="text-2xl font-bold">لوحة التحكم</h2>
              <button onClick={() => { setAuthed(false); onClose(); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" /> خروج
              </button>
            </div>
            <div className="mb-6 flex gap-2 rounded-xl bg-muted p-1">
              {(["projects", "texts"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${tab === t ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}>
                  {t === "projects" ? "المشاريع" : "نصوص الموقع"}
                </button>
              ))}
            </div>

            {tab === "projects" ? (
              <div className="space-y-6">
                <form onSubmit={addProject} className="grid gap-3 rounded-xl border p-4 md:grid-cols-2">
                  <input required placeholder="اسم المشروع" value={np.name} onChange={(e) => setNp({ ...np, name: e.target.value })} className={input} />
                  <input required type="url" dir="ltr" placeholder="رابط المتجر https://" value={np.url} onChange={(e) => setNp({ ...np, url: e.target.value })} className={`${input} text-right`} />
                  <input type="url" dir="ltr" placeholder="رابط الصورة https://" value={np.image} onChange={(e) => setNp({ ...np, image: e.target.value })} className={`${input} text-right md:col-span-2`} />
                  <textarea placeholder="وصف المشروع" value={np.description} onChange={(e) => setNp({ ...np, description: e.target.value })} className={`${input} md:col-span-2`} rows={2} />
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-primary py-2.5 font-semibold text-primary-foreground hover:opacity-90 md:col-span-2">
                    <Plus className="h-4 w-4" /> إضافة مشروع
                  </button>
                </form>
                <ul className="space-y-2">
                  {projects.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                      {p.image && <img src={p.image} alt="" className="h-12 w-16 rounded-md object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground" dir="ltr">{p.url}</p>
                      </div>
                      <button onClick={() => saveProjects(projects.filter((x) => x.id !== p.id))} aria-label="حذف" className="rounded-lg p-2 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                  {projects.length === 0 && <p className="text-center text-sm text-muted-foreground">لا توجد مشاريع بعد.</p>}
                </ul>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); saveTexts(draft); setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="grid gap-4 md:grid-cols-2">
                {TEXT_FIELDS.map((f) => (
                  <label key={f.key} className={`space-y-1 text-sm font-medium ${f.long ? "md:col-span-2" : ""}`}>
                    <span>{f.label}</span>
                    {f.long ? (
                      <textarea rows={3} value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} className={input} />
                    ) : (
                      <input value={draft[f.key]} onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })} className={input} />
                    )}
                  </label>
                ))}
                <button className="rounded-lg bg-gradient-primary py-2.5 font-semibold text-primary-foreground hover:opacity-90 md:col-span-2">
                  {saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
