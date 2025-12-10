// jsons_to_xlsx.js
import fs from "fs";
import path from "path";
import { globSync } from "glob";
import XLSX from "xlsx";

const OUT_DIR = path.resolve(process.cwd(), "output");
const GLOB_PATTERN = path.join(OUT_DIR, "*.json");
const REPORT_PATH = path.join(OUT_DIR, "report.xlsx");

function safeString(v) {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") return v.trim();
  return String(v);
}

function parseNameFromFilename(filename) {
  const base = path.basename(filename, path.extname(filename));
  const cleaned = base.replace(/_\d+$/, "");
  const parts = cleaned.replace(/[_\-]+/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return { genero: parts[0], especie: parts[1] };
  }
  return { genero: "", especie: "" };
}

function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erro lendo/parsing JSON:", filePath, err.message);
    return null;
  }
}

function extractAuthorsFromString(authStr) {
  if (!authStr) return [];
  // remover tags html e -- opcional: manter o texto simples
  let s = authStr.replace(/<\/?[^>]+(>|$)/g, " ");
  // remover parênteses em excesso (mas preserva conteúdo dentro se for autor)
  s = s.replace(/[()]/g, " ");
  // split por separadores comuns: comma, semicolon, ampersand, " and ", " e ", slash
  const parts = s.split(/,|;|&|\band\b|\be\b|\//i).map(p => p.trim()).filter(Boolean);
  // normalizar espaços e remover duplicatas locais
  const cleaned = parts.map(p => p.replace(/\s+/g, " ").trim());
  return cleaned;
}

function normalizeRecord(filePath, data) {
  let taxon = null;

  if (Array.isArray(data) && data[0]?.taxon) {
    taxon = data[0].taxon;
  } else if (data?.taxon) {
    taxon = data.taxon;
  } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && data[0].taxon === undefined) {
    taxon = data[0];
  }

  let genero = taxon?.genus || "";
  let especie = taxon?.specificepithet || "";

  if (!genero || !especie) {
    const parsed = parseNameFromFilename(filePath);
    genero = genero || parsed.genero;
    especie = especie || parsed.especie;
  }

  const nomenclaturalstatus = safeString(taxon?.nomenclaturalstatus);
  const taxonomicstatus = safeString(taxon?.taxonomicstatus);
  const scientificnameauthorship = safeString(taxon?.scientificnameauthorship);
  const scientificname = safeString(taxon?.scientificname);
  const taxonid = taxon?.taxonid ?? "";

  return {
    genero,
    especie,
    scientificname,
    taxonid,
    nomenclaturalstatus,
    taxonomicstatus,
    scientificnameauthorship,
    source_file: path.basename(filePath),
  };
}

function gatherAllAuthors(rows) {
  const set = new Set();
  for (const r of rows) {
    const authField = r.scientificnameauthorship || "";
    const parts = extractAuthorsFromString(authField);
    for (const p of parts) {
      if (p) set.add(p);
    }

    const sn = r.scientificname || "";
    if (sn) {
      const m = sn.match(/^[A-Z][a-zA-Z-]+(?:\s+[a-z-]+)?\s+[a-z-]+(.*)$/);
      if (m && m[1]) {
        const tail = m[1].replace(/[()]/g, " ").trim();
        const tailParts = extractAuthorsFromString(tail);
        for (const p of tailParts) if (p) set.add(p);
      }
    }
  }

  return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function main() {
  const files = globSync(GLOB_PATTERN);
  if (!files.length) {
    console.error("Nenhum arquivo JSON encontrado em:", OUT_DIR);
    process.exit(1);
  }
  console.log(`Arquivos JSON encontrados: ${files.length}`);

  const rows = [];
  for (const f of files) {
    const data = readJsonFile(f);
    if (!data) {
      rows.push({
        genero: "",
        especie: "",
        scientificname: "",
        taxonid: "",
        nomenclaturalstatus: "",
        taxonomicstatus: "",
        scientificnameauthorship: "",
        source_file: path.basename(f),
      });
      continue;
    }
    const rec = normalizeRecord(f, data);
    rows.push(rec);
  }

  const header = [
    "genero",
    "especie",
    "scientificname",
    "taxonid",
    "nomenclaturalstatus",
    "taxonomicstatus",
    "scientificnameauthorship",
    "source_file"
  ];
  const worksheet = XLSX.utils.json_to_sheet(rows, { header });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Taxa");

  const authors = gatherAllAuthors(rows);
  const authorsRows = authors.map(a => ({ author: a }));
  const wsAuth = XLSX.utils.json_to_sheet(authorsRows, { header: ["author"] });
  XLSX.utils.book_append_sheet(workbook, wsAuth, "Authors");

  XLSX.writeFile(workbook, REPORT_PATH);
  console.log("Planilha gerada em:", REPORT_PATH);
}

main();
