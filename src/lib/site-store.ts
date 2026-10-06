import { useCallback, useEffect, useState } from "react";

export type Project = {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
};

export type SiteTexts = {
  brand: string;
  heroTitle: string;
  heroDescription: string;
  heroCta: string;
  aboutTitle: string;
  aboutText: string;
  servicesTitle: string;
  portfolioTitle: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
};

export const DEFAULT_TEXTS: SiteTexts = {
  brand: "متجرك الرقمي",
  heroTitle: "ننقل تجارتك إلى العالم الرقمي",
  heroDescription:
    "نصمم لك متجرًا إلكترونيًا جاهزًا للاستخدام، احترافيًا وسريعًا، لتبدأ البيع عبر الإنترنت خلال أيام.",
  heroCta: "ابدأ متجرك الآن",
  aboutTitle: "من نحن",
  aboutText:
    "نساعد أصحاب المتاجر المحلية على زيادة مبيعاتهم من خلال الانتقال إلى الإنترنت. نتولى التصميم والإعداد والتدريب، لتركّز أنت على منتجاتك وعملائك.",
  servicesTitle: "لماذا تختارنا؟",
  portfolioTitle: "أعمالنا",
  contactPhone: "+964 770 000 0000",
  contactEmail: "info@example.com",
  contactAddress: "بغداد، العراق",
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "متجر الأناقة",
    description: "متجر أزياء نسائية بتصميم عصري وتجربة شراء سلسة.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=70",
    url: "https://example.com",
  },
  {
    id: "p2",
    name: "بيت العطور",
    description: "متجر عطور فاخرة مع نظام طلبات وتوصيل متكامل.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=70",
    url: "https://example.com",
  },
  {
    id: "p3",
    name: "تقنية بلس",
    description: "متجر إلكترونيات وإكسسوارات مع لوحة تحكم بالمخزون.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=70",
    url: "https://example.com",
  },
];

const TEXTS_KEY = "site_texts";
const PROJECTS_KEY = "site_projects";
const EVENT = "site-data-changed";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}

/** Reads site data from localStorage after mount (SSR-safe) and stays in sync. */
export function useSiteData() {
  const [texts, setTexts] = useState<SiteTexts>(DEFAULT_TEXTS);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);

  useEffect(() => {
    const load = () => {
      setTexts({ ...DEFAULT_TEXTS, ...read<Partial<SiteTexts>>(TEXTS_KEY, {}) });
      setProjects(read<Project[]>(PROJECTS_KEY, DEFAULT_PROJECTS));
    };
    load();
    window.addEventListener(EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const saveTexts = useCallback((t: SiteTexts) => write(TEXTS_KEY, t), []);
  const saveProjects = useCallback((p: Project[]) => write(PROJECTS_KEY, p), []);

  return { texts, projects, saveTexts, saveProjects };
}
