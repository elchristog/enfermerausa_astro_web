// Convierte los artículos JSON de Ryze (blog/data) en posts del blog de Astro (src/content/posts).
// Sin dependencias. Solo sobrescribe archivos que él mismo generó (marca "# generated-by: ryze").
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = "blog/data";
const OUT_DIR = "src/content/posts";
const MARK = "# generated-by: ryze";
const AUTHOR = "Alejandra Martínez, RN, BSN, IBCLC";
const AUTHOR_ROLE = "Fundadora de Enfermera en Estados Unidos y rnnclex.com";

if (!existsSync(DATA_DIR)) {
  console.log(`No existe ${DATA_DIR}; nada que convertir.`);
  process.exit(0);
}
mkdirSync(OUT_DIR, { recursive: true });

const q = (s) => JSON.stringify(String(s ?? ""));

function pickTag(a) {
  const t = `${a.title ?? ""} ${a.primary_keyword ?? ""}`.toLowerCase();
  if (/salari|gana|sueldo|cobra/.test(t)) return "salarios";
  if (/nclex/.test(t)) return "nclex";
  if (/cgfns|homolog|valid|eval/.test(t)) return "homologacion";
  if (/visa|eb-?3|green card/.test(t)) return "visa";
  return "guias";
}

let written = 0;
let skipped = 0;

// Extrae pares pregunta/respuesta de la sección "## FAQ" (formato **pregunta** + párrafo).
function extractFaqs(md) {
  const m = md.match(/^## +FAQ[^\n]*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m);
  if (!m) return [];
  const out = [];
  const re = /\*\*([^*\n]+\?)\*\*\s*\n+([^\n]+(?:\n(?!\*\*|\n)[^\n]+)*)/g;
  let x;
  while ((x = re.exec(m[1]))) out.push({ question: x[1].trim(), answer: x[2].replace(/\s+/g, " ").trim() });
  return out;
}
for (const file of readdirSync(DATA_DIR)) {
  if (!file.endsWith(".json")) continue;
  let a;
  try {
    a = JSON.parse(readFileSync(join(DATA_DIR, file), "utf8"));
  } catch (e) {
    console.error(`JSON inválido en ${file}: ${e.message}`);
    process.exitCode = 1;
    continue;
  }
  if (a.status !== "published" || !a.slug) {
    skipped++;
    continue;
  }
  const out = join(OUT_DIR, `${a.slug}.md`);
  if (existsSync(out) && !readFileSync(out, "utf8").includes(MARK)) {
    console.log(`Se omite ${a.slug}: ya existe un post manual con ese nombre.`);
    skipped++;
    continue;
  }
  const d = new Date(a.published_at ?? Date.now());
  const pubDate = Number.isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
  const imgUrl = a.image && typeof a.image === "object" && a.image.url ? a.image.url : "/logo.webp";
  const imgAlt = a.image && typeof a.image === "object" && a.image.alt ? a.image.alt : a.title;
  const description = a.meta_description || a.excerpt || a.title;
  const faqs = extractFaqs(a.body_markdown ?? "");
  const faqYaml = faqs.length
    ? ["faqs:", ...faqs.flatMap((f) => [`  - question: ${q(f.question)}`, `    answer: ${q(f.answer)}`])]
    : [];
  const fm = [
    "---",
    MARK,
    `pubDate: ${pubDate}`,
    // La plantilla del blog (BlogLayout) siempre lee este campo; se copia el valor de los posts existentes.
    'team: "david-lee"',
    // Autora visible de todos los artículos.
    `author: ${q(AUTHOR)}`,
    `authorRole: ${q(AUTHOR_ROLE)}`,
    `title: ${q(a.title)}`,
    `description: ${q(description)}`,
    "image:",
    `  url: ${q(imgUrl)}`,
    `  alt: ${q(imgAlt)}`,
    ...faqYaml,
    "tags:",
    `  - ${pickTag(a)}`,
    "---",
    "",
  ].join("\n");
  writeFileSync(out, `${fm}\n${(a.body_markdown ?? "").trim()}\n`);
  written++;
}
console.log(`Posts escritos: ${written}. Omitidos: ${skipped}.`);
