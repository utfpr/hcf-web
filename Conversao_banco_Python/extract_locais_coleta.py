#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import unicodedata
from pathlib import Path

import fdb

UF_MAP = {
    "acre":"AC","alagoas":"AL","amapá":"AP","amapa":"AP","amazonas":"AM","bahia":"BA","ceará":"CE","ceara":"CE",
    "distrito federal":"DF","espírito santo":"ES","espirito santo":"ES","goiás":"GO","goias":"GO","maranhão":"MA","maranhao":"MA",
    "mato grosso":"MT","mato grosso do sul":"MS","minas gerais":"MG","pará":"PA","para":"PA","paraíba":"PB","paraiba":"PB",
    "paraná":"PR","parana":"PR","pernambuco":"PE","piauí":"PI","piaui":"PI","rio de janeiro":"RJ","rio grande do norte":"RN",
    "rio grande do sul":"RS","rondônia":"RO","rondonia":"RO","roraima":"RR","santa catarina":"SC","são paulo":"SP","sao paulo":"SP",
    "sergipe":"SE","tocantins":"TO", "nao informado":"NI"
}

def slugify(s: str) -> str:
    if not s:
        return ""
    s = s.strip().lower()
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = "".join(ch if ch.isalnum() or ch.isspace() else " " for ch in s)
    s = " ".join(s.split())
    return s

def resolve_uf(raw_estado: str) -> str:
    if not raw_estado:
        return ""
    raw = slugify(raw_estado)
    # Se já vier sigla curta tipo "PR", "RJ"
    if len(raw_estado.strip()) <= 3 and raw_estado.strip().isalpha():
        return raw_estado.strip().upper()
    return UF_MAP.get(raw, "").upper()

def main():
    # Ajuste as credenciais/DSN
    conn = fdb.connect(
        host='127.0.0.1',
        database='./../firebird/data/HERBARIUM.GDB',
        user='SYSDBA',
        password='masterkey',
        charset='WIN1252'
    )
 
    cur = conn.cursor()
    cur.execute("""
        SELECT codigo, cidade, estado
        FROM local_coleta
    """)

    out_path = Path(__file__).parent.parent / "data" / "locais_coleta_city_map.csv"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with out_path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=[
            "codigo","cidade_fb","estado_fb","uf_resolvida","cidade_slug"
        ])
        w.writeheader()

        for codigo, cidade, estado in cur:
            w.writerow({
                "codigo": codigo,
                "cidade_fb": (cidade or "").strip(),
                "estado_fb": (estado or "").strip(),
                "uf_resolvida": resolve_uf(estado),
                "cidade_slug": slugify(cidade or "")
            })

    cur.close()
    conn.close()
    print(f"CSV gerado: {out_path}")

if __name__ == "__main__":
    main()
