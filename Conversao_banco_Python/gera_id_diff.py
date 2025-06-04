# firebird_ids_file = "firebird_ids.txt"
# mysql_ids_file = "mysql_ids"

firebird_ids_file = "coletor_firebird.txt"
mysql_ids_file = "coletor_mysql.txt"

# Carrega os IDs do Firebird
with open(firebird_ids_file, "r") as f:
    firebird_ids = set(line.strip() for line in f if line.strip())

# Carrega os IDs do MySQL
with open(mysql_ids_file, "r") as f:
    mysql_ids = set(line.strip() for line in f if line.strip())

# Compara os conjuntos
faltando = sorted(firebird_ids - mysql_ids)

print(f"\n🔥 IDs que estão no Firebird mas NÃO estão no MySQL ({len(faltando)}):")
for id in faltando:
    print(id)
