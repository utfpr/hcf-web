import re
import csv

def normalizar_nome(nome: str) -> str:
    return re.sub(r"\s+", " ", nome.strip())

# 1. Carrega os nomes do Firebird
nomes_firebird_raw = set()
with open("identificadores.txt", encoding="latin1") as f:
    for linha in f:
        parts = re.match(r"\s*\d+\s+(.+)", linha)
        if parts:
            raw = parts.group(1)
            nomes = re.split(r'\s*[;,&]\s*', raw)
            for nome in nomes:
                nome_norm = normalizar_nome(nome)
                if nome_norm:
                    nomes_firebird_raw.add(nome_norm)

# 2. Carrega os nomes que foram para o MySQL
nomes_mysql = set()
with open("identificadores.csv", encoding="utf-8") as f:
    reader = csv.reader(f)
    for row in reader:
        nome = normalizar_nome(row[1])  # coluna 1 é o nome
        nomes_mysql.add(nome)

# 3. Compara
nomes_que_nao_foram = nomes_firebird_raw - nomes_mysql

print(f"Total normalizados no Firebird: {len(nomes_firebird_raw)}")
print(f"Total inseridos no MySQL: {len(nomes_mysql)}")
print(f"Nomes que não estão no MySQL: {len(nomes_que_nao_foram)}")
print("\nExemplos:")
for nome in list(nomes_que_nao_foram)[:10]:
    print("-", nome)
