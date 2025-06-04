def carregar_nomes(path):
    with open(path, "r", encoding="utf-8") as f:
        return set(linha.strip().lower() for linha in f if linha.strip())

convertidos = carregar_nomes("identificadores_convertidos.txt")
migrados = carregar_nomes("identificadores_mysql.txt")

faltando = convertidos - migrados

print(f"Nomes presentes no arquivo de convertidos mas ausentes no MySQL ({len(faltando)}):\n")
for nome in sorted(faltando):
    print(nome)
