# firebird_ids_file = "firebird_ids.txt"
# mysql_ids_file = "mysql_ids"

file1 = "coletores_complementares_mysql.txt"
file2 = "coletores_complementares_postgres.txt"

# Carrega os IDs do Firebird
with open(file1, "r") as f:
    files1 = set(line.strip() for line in f if line.strip())

# Carrega os IDs do MySQL
with open(file2, "r") as f:
    files2 = set(line.strip() for line in f if line.strip())

# Compara os conjuntos
faltando = sorted(files2 - files1)

print(f"\n🔥 Strings que estão no 1 mas NÃO estão no 2 ({len(faltando)}):")
for id in faltando:
    print(id)
