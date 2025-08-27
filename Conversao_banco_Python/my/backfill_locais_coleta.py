
"""
Usage:
  pip install pymysql python-dotenv
  python backfill_locais_coleta.py --csv ./data/tmp_locais_coleta_for_update.csv --commit

Notes:
- grant envs MYSQL_HOST=127.0.0.1 MYSQL_PORT=3306 MYSQL_USER=root MYSQL_PASSWORD=secret MYSQL_DB=hcf
- Default is DRY-RUN (no changes). Use --commit to persist.
- Works whether MySQL is in Docker or not; connects over TCP using the host/port you pass.

"""

import os
import csv
import sys
import math
import argparse
from typing import List, Tuple

# Pure-Python client, avoids native deps
import pymysql
from pymysql.cursors import DictCursor

# Optional: load MySQL credentials from .env (if present)
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    pass


def normalize_uf(uf: str) -> str:
    return (uf or "").strip().upper()


def normalize_city(name: str) -> str:
    # Keep original casing for exact match + collate in SQL; just trim here
    return (name or "").strip()


def read_csv_rows(csv_path: str) -> List[Tuple[int, str, str]]:
    """
    Returns a list of tuples: (id, cidade, uf)
    Accepts multiple header variants.
    """
    rows: List[Tuple[int, str, str]] = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = [h.strip().lower() for h in reader.fieldnames or []]

        # Detect schema
        mode = None
        if {"id", "cidade", "uf"}.issubset(headers):
            mode = "ready"
        elif {"id", "cidade_fb", "uf_resolvida"}.issubset(headers):
            mode = "from_fb_map_id"
        elif {"codigo", "cidade_fb", "uf_resolvida"}.issubset(headers):
            mode = "from_fb_map_codigo"
        else:
            raise ValueError(
                f"CSV headers not recognized: {headers}. "
                "Expected one of: "
                "[id,cidade,uf] or [id,cidade_fb,uf_resolvida] or [codigo,cidade_fb,uf_resolvida]."
            )

        for line in reader:
            try:
                if mode == "ready":
                    _id = int(line["id"])
                    city = normalize_city(line["cidade"])
                    uf = normalize_uf(line["uf"])
                elif mode == "from_fb_map_id":
                    _id = int(line["id"])
                    city = normalize_city(line["cidade_fb"])
                    uf = normalize_uf(line["uf_resolvida"])
                else:  # from_fb_map_codigo
                    _id = int(line["codigo"])
                    city = normalize_city(line["cidade_fb"])
                    uf = normalize_uf(line["uf_resolvida"])

                if not _id or not city or not uf:
                    continue  # skip incomplete
                rows.append((_id, city, uf))
            except Exception:
                # Skip malformed lines
                continue

    return rows


def chunked(iterable, size):
    for i in range(0, len(iterable), size):
        yield iterable[i : i + size]


def connect_mysql():
    host = os.getenv("MYSQL_HOST", "127.0.0.1")
    port = int(os.getenv("MYSQL_PORT", "3306"))
    user = os.getenv("MYSQL_USER", "root")
    password = os.getenv("MYSQL_PASSWORD", "")
    db = os.getenv("MYSQL_DB", "hcf")
    conn = pymysql.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=db,
        charset="utf8mb3",
        autocommit=False,
        cursorclass=DictCursor,
    )
    return conn


def create_tmp_table(cur):
    cur.execute("DROP TABLE IF EXISTS tmp_locais_coleta")
    cur.execute(
        """
        CREATE TEMPORARY TABLE tmp_locais_coleta (
          id INT UNSIGNED NOT NULL,
          cidade VARCHAR(255) NOT NULL,
          uf CHAR(4) NOT NULL,
          PRIMARY KEY (id)
        ) ENGINE=Memory
        """
    )


def insert_tmp_rows(cur, rows: List[Tuple[int, str, str]], chunk_size: int = 2000):
    sql = "INSERT INTO tmp_locais_coleta (id, cidade, uf) VALUES (%s, %s, %s)"
    total = len(rows)
    for chunk in chunked(rows, chunk_size):
        cur.executemany(sql, chunk)
    return total


def update_locais(cur) -> int:
    """
    Returns affected rows count for the UPDATE
    """
    update_sql = """
    UPDATE locais_coleta AS lc
    JOIN tmp_locais_coleta AS t ON t.id = lc.id
    JOIN estados AS e           ON UPPER(e.sigla) = UPPER(t.uf)
    JOIN cidades AS c           ON c.estado_id = e.id
                                AND c.nome COLLATE utf8mb3_unicode_ci = t.cidade COLLATE utf8mb3_unicode_ci
    SET lc.cidade_id = c.id
    WHERE lc.cidade_id IS NULL
    """
    affected = cur.execute(update_sql)
    return affected


def get_unmatched(cur) -> list:
    q = """
    SELECT t.id, t.cidade, t.uf
    FROM tmp_locais_coleta t
    LEFT JOIN estados e ON UPPER(e.sigla) = UPPER(t.uf)
    LEFT JOIN cidades c ON c.estado_id = e.id
      AND c.nome COLLATE utf8mb3_unicode_ci = t.cidade COLLATE utf8mb3_unicode_ci
    WHERE e.id IS NULL OR c.id IS NULL
    """
    cur.execute(q)
    return cur.fetchall()


def save_not_found(rows: list, path: str = "not_found_locais.csv"):
    if not rows:
        return None
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["id", "cidade", "uf"])
        w.writeheader()
        for r in rows:
            w.writerow({"id": r["id"], "cidade": r["cidade"], "uf": r["uf"]})
    return path


def main():
    parser = argparse.ArgumentParser(description="Backfill locais_coleta.cidade_id from a local CSV")
    parser.add_argument("--csv", required=True, help="Path to CSV file")
    parser.add_argument("--commit", action="store_true", help="Apply changes (default is dry-run)")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of CSV rows to process (for testing)")
    parser.add_argument("--chunk-size", type=int, default=2000, help="Batch size for inserts")
    args = parser.parse_args()

    rows = read_csv_rows(args.csv)
    if args.limit and args.limit > 0:
        rows = rows[: args.limit]

    if not rows:
        print("No valid rows found in CSV. Check headers and content.")
        sys.exit(1)

    print(f"Loaded {len(rows)} candidate rows from {args.csv}")

    conn = connect_mysql()
    try:
        with conn.cursor() as cur:
            # Build temp table
            create_tmp_table(cur)
            total_inserted = insert_tmp_rows(cur, rows, chunk_size=args.chunk_size)
            print(f"Inserted {total_inserted} rows into tmp_locais_coleta")

            # Run UPDATE
            affected = update_locais(cur)
            print(f"UPDATE affected rows: {affected}")

            # Report unmatched (if any)
            unmatched = get_unmatched(cur)
            if unmatched:
                out = save_not_found(unmatched)
                print(f"Unmatched rows: {len(unmatched)} (saved to {out})")
            else:
                print("All rows matched successfully.")

            if args.commit:
                conn.commit()
                print("Changes committed ✅")
            else:
                conn.rollback()
                print("Dry-run complete (rolled back). Use --commit to persist.")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
