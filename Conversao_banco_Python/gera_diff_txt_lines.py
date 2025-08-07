import sys
import os
from collections import Counter

def carregar_nomes_lista(path):
    """Carrega nomes preservando duplicatas para checar repetição."""
    with open(path, "r", encoding="utf-8") as f:
        return [linha.strip() for linha in f if linha.strip()]

def carregar_nomes_set(path):
    """Carrega nomes sem duplicatas para comparação."""
    return set(carregar_nomes_lista(path))

def verificar_duplicados(nomes, origem):
    """Verifica duplicatas (case-insensitive)."""
    counter = Counter(n.lower() for n in nomes)
    duplicados = [n for n, count in counter.items() if count > 1]
    
    if duplicados:
        print(f"\n⚠️ Duplicados encontrados em {origem} ({len(duplicados)} valores):")
        for nome in sorted(duplicados):
            print(f"  - {nome}")
    else:
        print(f"\n✅ Nenhum duplicado encontrado em {origem}.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python gera_diff_txt_lines.py <nome_tabela> [inv|dup]")
        sys.exit(1)

    tabela = sys.argv[1]
    modo = sys.argv[2].lower() if len(sys.argv) > 2 else None
    
    arquivo_pg = f"{tabela}_postgres.txt"
    arquivo_mysql = f"{tabela}_mysql.txt"
    
    if not os.path.exists(arquivo_pg):
        print(f"Arquivo não encontrado: {arquivo_pg}")
        sys.exit(1)
    if not os.path.exists(arquivo_mysql):
        print(f"Arquivo não encontrado: {arquivo_mysql}")
        sys.exit(1)
    
    convertidos_lista = carregar_nomes_lista(arquivo_pg)
    migrados_lista = carregar_nomes_lista(arquivo_mysql)
    
    convertidos = set(convertidos_lista)
    migrados = set(migrados_lista)

    if modo == "dup":
        verificar_duplicados(convertidos_lista, "Postgres")
        verificar_duplicados(migrados_lista, "MySQL")
    
    elif modo == "inv":
        faltando = migrados - convertidos
        print(f"Nomes presentes no arquivo do MySQL mas ausentes no Postgres ({len(faltando)}):\n")
        for nome in sorted(faltando):
            print(nome)
    
    else:
        faltando = convertidos - migrados
        print(f"Nomes presentes no arquivo do Postgres mas ausentes no MySQL ({len(faltando)}):\n")
        for nome in sorted(faltando):
            print(nome)
