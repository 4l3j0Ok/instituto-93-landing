import { load, type CheerioAPI } from 'cheerio';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export const SITE = 'https://isfdyt93-bue.infd.edu.ar/sitio';
const API = process.env.WP_API ?? `${SITE}/wp-json/wp/v2`;
const SNAPSHOT = resolve(process.cwd(), 'src/data/wp-snapshot.json');

export interface WpPage {
  id: number;
  slug: string;
  title: string;
  link: string;
  modified: string;
  html: string;
}

export interface WpMedia {
  slug: string;
  date: string;
  mime: string;
  url: string;
}

interface Snapshot {
  fetchedAt: string;
  pages: WpPage[];
  media: WpMedia[];
}

const decodeTitle = (raw: string) => load(`<p>${raw}</p>`)('p').text().trim();

async function getJson(url: string): Promise<any> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'isft93-landing-build' },
    signal: AbortSignal.timeout(25_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} en ${url}`);
  return res.json();
}

async function fetchLive(): Promise<Snapshot> {
  const [pages, media] = await Promise.all([
    getJson(`${API}/pages?per_page=100&_fields=id,slug,title,link,modified,content`),
    getJson(`${API}/media?search=calendario&per_page=30&orderby=date&order=desc&_fields=slug,date,mime_type,source_url`),
  ]);
  return {
    fetchedAt: new Date().toISOString(),
    pages: pages.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: decodeTitle(p.title.rendered),
      link: p.link,
      modified: p.modified,
      html: p.content.rendered,
    })),
    media: media.map((m: any) => ({
      slug: m.slug,
      date: m.date,
      mime: m.mime_type,
      url: m.source_url,
    })),
  };
}

let cache: Promise<Snapshot> | undefined;

export function getSnapshot(): Promise<Snapshot> {
  cache ??= (async () => {
    try {
      const live = await fetchLive();
      if (!live.pages.length) throw new Error('La API devolvió 0 páginas');
      mkdirSync(dirname(SNAPSHOT), { recursive: true });
      writeFileSync(SNAPSHOT, JSON.stringify(live));
      console.info(`[wp] ${live.pages.length} páginas leídas desde la API de WordPress`);
      return live;
    } catch (err) {
      if (existsSync(SNAPSHOT)) {
        console.warn(`[wp] API no disponible (${(err as Error).message}); se usa la copia guardada`);
        return JSON.parse(readFileSync(SNAPSHOT, 'utf8')) as Snapshot;
      }
      throw new Error(`[wp] No se pudo leer la API ni existe copia local: ${(err as Error).message}`);
    }
  })();
  return cache;
}

/* ---------- utilidades de texto ---------- */

const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu;

export const clean = (s: string) =>
  s.replace(EMOJI, '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();

const SMALL = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'en', 'a', 'con']);

export function sentenceCase(s: string) {
  const t = clean(s);
  const letters = t.replace(/[^\p{L}]/gu, '');
  if (!letters) return t;
  const upper = letters.replace(/[^\p{Lu}]/gu, '').length;
  if (upper / letters.length < 0.6) return t;
  const lower = t.toLocaleLowerCase('es-AR');
  return lower.charAt(0).toLocaleUpperCase('es-AR') + lower.slice(1);
}

export function titleCase(s: string) {
  const t = clean(s);
  const letters = t.replace(/[^\p{L}]/gu, '');
  if (!letters || t !== t.toLocaleUpperCase('es-AR')) return t;
  return t
    .toLocaleLowerCase('es-AR')
    .split(' ')
    .map((w, i) => (i > 0 && SMALL.has(w) ? w : w.charAt(0).toLocaleUpperCase('es-AR') + w.slice(1)))
    .join(' ');
}

const KEEP = new Set(['PROGRESAR']);

export const capFirst = (s: string) => s.charAt(0).toLocaleUpperCase('es-AR') + s.slice(1);

/** Baja las MAYÚSCULAS sostenidas de títulos y textos del sitio sin tocar siglas cortas. */
export function softenCaps(s: string) {
  const t = clean(s);
  if (!t) return t;
  const whole = sentenceCase(t);
  if (whole !== t) return whole;
  return t
    .replace(/(?<![\p{L}])((?:[\p{Lu}0-9°.]{2,}\s+){2,}[\p{Lu}0-9°.]+)(?![\p{L}])/gu, (m) => titleCase(m))
    .replace(/(?<![\p{L}])\p{Lu}{6,}(?![\p{L}])/gu, (w) => (KEEP.has(w) ? w : capFirst(w.toLocaleLowerCase('es-AR'))));
}

const STOP = new Set(['de', 'del', 'la', 'el', 'en', 'y', 'e', 'con', 'tecnicatura', 'superior']);

export function tokens(s: string): string[] {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !STOP.has(w))
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w));
}

const contains = (haystack: string[], needle: string[]) =>
  needle.length > 0 && needle.every((t) => haystack.includes(t));

/** Texto de un fragmento HTML con <br> como saltos de línea. */
function lines($: CheerioAPI, el: any): string[] {
  const c = $(el).clone();
  c.find('br').replaceWith('\n');
  return c
    .text()
    .split('\n')
    .map((l) => l.replace(/\u00a0/g, ' ').trim())
    .filter(Boolean);
}

export interface Link {
  label: string;
  href: string;
  kind?: string;
}

function kindOf(href: string): string | undefined {
  if (/\.pdf($|\?)/i.test(href)) return 'PDF';
  if (/docs\.google\.com\/spreadsheets/i.test(href)) return 'Planilla';
  if (/\.docx?($|\?)/i.test(href)) return 'Word';
  return undefined;
}

function extractLinks(html: string): Link[] {
  const $ = load(html);
  const seen = new Set<string>();
  const out: Link[] = [];
  $('a[href]').each((_, a) => {
    const href = ($(a).attr('href') ?? '').trim();
    const label = softenCaps($(a).text());
    if (!/^https?:\/\//.test(href) || !label || seen.has(href)) return;
    seen.add(href);
    out.push({ label, href, kind: kindOf(href) });
  });
  return out;
}

/* ---------- datos del sitio ---------- */

export interface Career {
  name: string;
  href: string;
  schedule?: string;
  isNew: boolean;
}

export interface Sede {
  id: string;
  name: string;
  note?: string;
  address: string;
  detail: string;
  careers: Career[];
}

export interface Contact {
  hours: string;
  dependency: string;
  places: { kind: string; locality: string; address: string; postal: string; mapUrl?: string; email?: string }[];
  phones: { label: string; href: string }[];
  social: Link[];
  authorities: { role: string; name: string }[];
}

export interface Step {
  title: string;
  text: string;
  action: { label: string; href: string };
}

const TITLE_OVERRIDES: Record<string, string> = {
  '3627-2': 'Reinscripción de 2° y 3° año',
};

export interface SiteData {
  fetchedAt: string;
  pageLink: (slug: string) => string;
  pageTitle: (slug: string) => string;
  sedes: Sede[];
  formsStudents: Link[];
  formsTeachers: Link[];
  calendar?: string;
  preinscripcion: string;
  contact: Contact;
  steps: Step[];
  enrollSchedule?: string;
  requirements: string[];
  about: { paragraphs: string[]; careersLine?: string; students?: string; founded?: string };
}

export async function getSiteData(): Promise<SiteData> {
  const snap = await getSnapshot();
  const bySlug = new Map(snap.pages.map((p) => [p.slug, p]));
  const need = (slug: string) => {
    const p = bySlug.get(slug);
    if (!p) throw new Error(`[wp] Falta la página "${slug}" en la API`);
    return p;
  };
  const pageLink = (slug: string) => need(slug).link;
  const pageTitle = (slug: string) => TITLE_OVERRIDES[slug] ?? softenCaps(need(slug).title);

  /* Oferta académica por sede (página de inicio) */
  const careerPages = snap.pages.filter((p) => /^tecnicatura-superior/.test(p.slug));
  const newPage = need('carreras-nuevas-2026');
  const $new = load(newPage.html);
  const newLines: string[][] = [];
  $new('p, li').each((_, el) => {
    for (const l of lines($new, el)) newLines.push(tokens(clean(l)));
  });

  const $home = load(need('inicio').html);
  const rows: string[] = [];
  $home('p').each((_, p) => {
    const c = $home(p).clone();
    c.find('br').replaceWith('\n');
    rows.push(...c.text().split('\n'));
  });

  type Draft = { head: string; address: string; items: { name: string; schedule: string }[] };
  const drafts: Draft[] = [];
  let cur: Draft | undefined;
  let schedule = '';
  const PIN = '\u{1F4CD}';
  const CLOCK = '\u{1F552}';
  for (const raw of rows) {
    const text = clean(raw);
    if (!text) continue;
    if (raw.includes(PIN)) {
      const [before, after] = raw.split(PIN);
      const head = clean(before);
      if (head) {
        cur = { head, address: clean(after), items: [] };
        drafts.push(cur);
        schedule = '';
      } else if (cur) {
        cur.address = clean(after);
      }
    } else if (raw.includes(CLOCK)) {
      schedule = clean(raw.split(CLOCK)[1]);
    } else if (/^[●•]/.test(text)) {
      cur?.items.push({ name: text.replace(/^[●•]\s*/, ''), schedule });
    } else if (/^(sede\b|unsav\b|universidad\b)/i.test(text)) {
      cur = { head: text, address: '', items: [] };
      drafts.push(cur);
      schedule = '';
    }
  }

  const fmtSchedule = (s: string) => {
    const [a, b] = s.split(/\s*\|\s*/);
    const first = capFirst(clean(a).toLocaleLowerCase('es-AR'));
    return b ? `${first}, de ${b}` : first;
  };

  const sedes: Sede[] = drafts
    .filter((d) => d.items.length)
    .map((d) => {
      const [h1, h2] = d.head.split(/\s+[–-]\s+/);
      const uniq = [...new Set(d.items.map((i) => i.schedule).filter(Boolean))];
      const multi = uniq.length > 1;
      return {
        id: tokens(h1).join('-') || `sede-${drafts.indexOf(d)}`,
        name: titleCase(h1),
        note: h2 ? sentenceCase(h2) : undefined,
        address: d.address.replace(/\s+[–-]\s+/g, ', '),
        detail: multi ? `${uniq.length} turnos según la carrera` : uniq[0] ? fmtSchedule(uniq[0]) : '',
        careers: d.items.map((i) => {
          const want = tokens(i.name);
          const match = careerPages
            .filter((p) => contains(tokens(p.title), want))
            .sort((a, b) => tokens(a.title).length - tokens(b.title).length)[0];
          const isNew = newLines.some((l) => contains(l, want));
          return {
            name: match ? match.title : i.name,
            href: match ? match.link : isNew ? newPage.link : SITE,
            schedule: multi && i.schedule ? fmtSchedule(i.schedule) : undefined,
            isNew,
          };
        }),
      };
    });
  if (!sedes.length) throw new Error('[wp] No se pudo leer la oferta académica de la página de inicio');

  /* Formularios */
  const formsStudents = extractLinks(need('formularios').html);
  const formsTeachers = extractLinks(need('formularios-2').html);

  /* Calendario: PDF más reciente de la mediateca */
  const calendar = snap.media
    .filter((m) => m.mime === 'application/pdf' && /calendario/i.test(m.slug) && !/\bhorario/i.test(m.slug))
    .sort((a, b) => b.date.localeCompare(a.date))[0]?.url;

  /* Preinscripción y etapas */
  const $pre = load(need('inscribite').html);
  const preinscripcion =
    $pre('a[href*="forms.gle"], a[href*="docs.google.com/forms"]').first().attr('href') ?? need('inscribite').link;
  const preBullets = $pre('li')
    .map((_, li) => clean($pre(li).text()))
    .get()
    .filter(Boolean);

  const $formal = load(need('2o-etapa-inscripcion-formal-2026').html);
  const formalParas = $formal('p')
    .map((_, p) => lines($formal, p))
    .get() as unknown as string[];
  const formalIntro = clean(formalParas.find((l) => /^solo pasan/i.test(clean(l))) ?? '');

  const requirements: string[] = [];
  {
    let on = false;
    for (const line of formalParas) {
      const t = clean(line);
      if (/^requisitos comunes/i.test(t)) on = true;
      else if (/^especificaciones exclusivas/i.test(t)) break;
      else if (on && /^[●•]/.test(t)) {
        const item = t.replace(/^[●•]\s*/, '');
        if (!/^descargar|^se entrega|^enfermer[ií]a tiene/i.test(item)) requirements.push(item.replace(/(?<![A-Z])\.$/, ''));
      }
    }
  }

  const $conf = load(need('3-etapa-confirmacion').html);
  const confText = $conf('p')
    .map((_, p) => lines($conf, p).map(clean).join(' · '))
    .get()
    .filter(Boolean) as unknown as string[];

  const $inst = load(need('el-instituto').html);
  const instP = $inst('p')
    .map((_, p) => clean($inst(p).text()))
    .get()
    .filter((t: string) => t.length > 60) as unknown as string[];
  const instLi = $inst('li')
    .map((_, li) => clean($inst(li).clone().children('ul').remove().end().text()))
    .get()
    .filter(Boolean) as unknown as string[];
  const whenLi = instLi.find((l) => /inscripci[oó]n se realizar/i.test(l));
  const enrollSchedule = whenLi?.replace(/\s*Ver Requisitos\.?$/i, '').trim();

  const stepTitle = (p: WpPage | undefined, fallback: string) => {
    const t = clean(p?.title ?? '');
    const m = t.match(/etapa\s*[–-]\s*(.+)$/i);
    return sentenceCase((m?.[1] ?? fallback).replace(/\s*\d{4}$/, ''));
  };
  const steps: Step[] = [
    {
      title: sentenceCase(clean($pre('p').first().text()).replace(/^.*?etapa\s*[–-]\s*/i, '').replace(/\s*\d{4}.*$/, '')) || 'Preinscripción',
      text: preBullets.join(' '),
      action: { label: 'Completar la preinscripción', href: preinscripcion },
    },
    {
      title: stepTitle(bySlug.get('2o-etapa-inscripcion-formal-2026'), 'Inscripción formal'),
      text: [formalIntro, enrollSchedule].filter(Boolean).join(' '),
      action: { label: 'Ver la documentación requerida', href: need('2o-etapa-inscripcion-formal-2026').link },
    },
    {
      title: stepTitle(bySlug.get('3-etapa-confirmacion'), 'Confirmación'),
      text: confText
        .join(' ')
        .replace(/\s*·\s*/g, '. ')
        .replace(/\.\s*\./g, '.')
        .replace(/([^.:])$/, '$1.'),
      action: { label: 'Más sobre la confirmación', href: need('3-etapa-confirmacion').link },
    },
  ];

  /* Contacto y autoridades (datos institucionales) */
  const $d = load(need('datos-institucionales').html);
  const hoursLi = $d('p:contains("Horario de Atención")').next('ul').find('li').first();
  const hours = capFirst(clean(hoursLi.text()).replace(/^de\s+/i, '').replace(/\s*hs\.?$/i, ''));
  const dependency = clean($d('h6 em').first().text());

  const places: Contact['places'] = [];
  const phones: Contact['phones'] = [];
  const social: Link[] = [];
  const authorities: Contact['authorities'] = [];
  const emails: { text: string; address: string }[] = [];

  $d('li').each((_, li) => {
    const el = $d(li);
    const text = clean(el.text());
    const placeMatch = text.match(/^(SEDE|ANEXO)\s+(.*?)\s*(?:[–-]\s*)?\((\d{4})\)\s*(.*?)\s*(?:\(\s*maps\s*\))?$/i);
    if (placeMatch) {
      places.push({
        kind: titleCase(placeMatch[1]),
        address: placeMatch[2].trim(),
        postal: placeMatch[3],
        locality: placeMatch[4].trim(),
        mapUrl: el.find('a[href]').attr('href'),
      });
      return;
    }
    const ph = text.match(/\(0\d+\)\s*\d+/g);
    if (ph) {
      for (const p of ph) {
        const m = p.match(/\(0(\d+)\)\s*(\d+)/)!;
        phones.push({ label: p, href: `tel:+54${m[1]}${m[2]}` });
      }
      return;
    }
    const roleMatch = text.match(/^(Director|Regente|Secretario|Jefes? de [ÁA]rea|Bibliotecarias?|Preceptores?):\s*(.+)$/i);
    if (roleMatch) authorities.push({ role: roleMatch[1], name: roleMatch[2] });
    el.find('a[href]').each((__, a) => {
      const href = ($d(a).attr('href') ?? '').trim();
      const mail = href.replace(/^mailto:/i, '');
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) emails.push({ text: clean($d(a).text()), address: mail });
      else if (/facebook|instagram|twitter|x\.com/i.test(href)) {
        const net = /facebook/i.test(href) ? 'Facebook' : /instagram/i.test(href) ? 'Instagram' : 'Twitter';
        const handle = href.replace(/\/+$/, '').split('/').pop() ?? '';
        social.push({ label: `${net} · ${handle}`, href });
      }
    });
  });
  // El primer correo corresponde a la sede y el segundo al anexo, según el texto de cada enlace.
  for (const m of emails) {
    const target = /anexo/i.test(m.text) ? places.find((p) => /anexo/i.test(p.kind)) : places.find((p) => /sede/i.test(p.kind));
    if (target) target.email = m.address;
  }

  /* Institucional */
  const students = instLi.concat(instP).join(' ').match(/m[aá]s de\s+(\d[\d.]*)\s+estudiantes/i)?.[1];
  const founded = instP.join(' ').match(/En\s+(?:\w+\s+de\s+)?(\d{4})\s+se cre[oó]/i)?.[1];
  const about = {
    paragraphs: instP.slice(0, 2).map(softenCaps),
    careersLine: instLi.find((l) => /duraci[oó]n de/i.test(l)),
    students,
    founded,
  };

  return {
    fetchedAt: snap.fetchedAt,
    pageLink,
    pageTitle,
    sedes,
    formsStudents,
    formsTeachers,
    calendar,
    preinscripcion,
    contact: { hours, dependency, places, phones, social, authorities },
    steps,
    enrollSchedule,
    requirements,
    about,
  };
}
