// fetch_taxa.ts
import fs from "fs";
import path from "path";
import axios from "axios";
import { parse } from "csv-parse";
import pLimit from "p-limit";

type Row = string[];

// Caminho do CSV (arquivo que você enviou)
const CSV_PATH = "querySELECT.csv";

// Pasta de saída
const OUT_DIR = path.resolve(process.cwd(), "output");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Configurações
const CONCURRENCY = 5; // número de requisições simultâneas
const RETRIES = 3; // tentativas em caso de erro
const RETRY_DELAY_MS = 1000; // tempo entre retries
const REQUEST_TIMEOUT = 15000; // timeout axios em ms
const BASE_URL = "https://servicos.jbrj.gov.br/v2/flora/taxon/";

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Extrai genero e especie de uma row do csv.
 * Lógica:
 * - Se existir header com "genero" e "especie" (case-insensitive), usa-os.
 * - Caso contrário, assume que as duas primeiras colunas são genero e especie.
 */
async function readCsv(
  filePath: string
): Promise<{ genero: string; especie: string }[]> {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(filePath);
    const rows: { genero: string; especie: string }[] = [];
    const parser = parse({
      bom: true,
      columns: true, // tenta usar header; se não quiser, fallback abaixo
      skip_empty_lines: true,
      trim: true,
    });

    let usedColumns = true;

    parser.on("readable", () => {
      let record;
      while ((record = parser.read())) {
        // record será um object se columns=true. Precisamos mapear.
        const keys = Object.keys(record);
        // procurar por colunas que pareçam genero/espécie
        const lowerKeys = keys.map((k) => k.toLowerCase());
        const gi = lowerKeys.findIndex(
          (k) =>
            k.includes("gener") || k.includes("gênero") || k.includes("genero")
        );
        const ei = lowerKeys.findIndex(
          (k) =>
            k.includes("espec") ||
            k.includes("espécie") ||
            k.includes("especie") ||
            k.includes("species")
        );
        if (gi !== -1 && ei !== -1) {
          rows.push({
            genero: record[keys[gi]].trim(),
            especie: record[keys[ei]].trim(),
          });
        } else {
          // as keys existem, mas não reconhecemos: fallback para as 2 primeiras colunas
          usedColumns = false;
          // converter record object para array na ordem das keys
          const vals = keys.map((k) => (record[k] ?? "").toString().trim());
          rows.push({ genero: vals[0] ?? "", especie: vals[1] ?? "" });
        }
      }
    });

    parser.on("error", (err) => {
      // fallback: tentar parse sem columns
      if (usedColumns) {
        // tentar parse como CSV regular
        parse(fs.readFileSync(filePath), { bom: true }, (err2, data: Row[]) => {
          if (err2) return reject(err2);
          for (const r of data) {
            if (r.length < 2) continue;
            rows.push({ genero: r[0].trim(), especie: r[1].trim() });
          }
          resolve(rows);
        });
      } else {
        reject(err);
      }
    });

    parser.on("end", () => {
      resolve(rows);
    });

    input.pipe(parser);
  });
}

async function fetchWithRetries(
  url: string,
  triesLeft = RETRIES
): Promise<{ status: number; data: any }> {
  try {
    const resp = await axios.get(url, { timeout: REQUEST_TIMEOUT });
    return { status: resp.status, data: resp.data };
  } catch (err: any) {
    if (triesLeft > 0) {
      await sleep(RETRY_DELAY_MS);
      return fetchWithRetries(url, triesLeft - 1);
    }
    if (err.response) {
      return { status: err.response.status, data: err.response.data };
    }
    throw err;
  }
}

function safeFileName(text: string) {
  return text.replace(/[^a-z0-9_\-\.]/gi, "_");
}

async function main() {
  console.log("Lendo CSV...", CSV_PATH);
  const items = await readCsv(CSV_PATH);
  console.log(`Linhas carregadas: ${items.length}`);

  const limit = pLimit(CONCURRENCY);
  const summaryRows: string[] = [];
  summaryRows.push(
    [
      "genero",
      "especie",
      "taxon_name",
      "url",
      "http_status",
      "output_file",
    ].join(",")
  );

  const tasks = items.map((it, idx) =>
    limit(async () => {
      const genero = (it.genero || "").trim();
      const especie = (it.especie || "").trim();
      if (!genero || !especie) {
        console.warn(`Linha ${idx + 1}: genero/especie vazio, pulando`);
        summaryRows.push([genero, especie, "", "", "SKIPPED", ""].join(","));
        return;
      }
      const taxonPlain = `${genero} ${especie}`;
      const taxonEncoded = encodeURIComponent(taxonPlain);
      const url = BASE_URL + taxonEncoded;

      try {
        const result = await fetchWithRetries(url);
        const fileName = safeFileName(`${genero}_${especie}_${idx + 1}.json`);
        const outPath = path.join(OUT_DIR, fileName);
        fs.writeFileSync(
          outPath,
          JSON.stringify(result.data, null, 2),
          "utf-8"
        );
        console.log(`[OK] ${taxonPlain} -> ${result.status} -> ${fileName}`);
        summaryRows.push(
          [
            genero,
            especie,
            taxonPlain,
            url,
            String(result.status),
            fileName,
          ].join(",")
        );
      } catch (err: any) {
        console.error(`[ERR] ${taxonPlain}:`, err.message ?? err);
        summaryRows.push(
          [genero, especie, taxonPlain, url, "ERROR", ""].join(",")
        );
      }
    })
  );

  await Promise.all(tasks);

  const summaryPath = path.join(OUT_DIR, "summary.csv");
  fs.writeFileSync(summaryPath, summaryRows.join("\n"), "utf-8");
  console.log("Concluído. Saída em:", OUT_DIR);
  console.log("Arquivo resumo:", summaryPath);
}

main().catch((e) => {
  console.error("Erro fatal:", e);
  process.exit(1);
});
