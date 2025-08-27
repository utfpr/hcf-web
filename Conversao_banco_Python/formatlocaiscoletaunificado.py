import csv

input_file = "coletas_unificadas_unicas.csv"
updates_file = "updates.csv"
creates_file = "creates.csv"


def is_number(value):
    """Verifica se o valor é puramente numérico"""
    return value.isdigit()


with open(input_file, "r", encoding="utf-8") as infile, \
     open(updates_file, "w", newline="", encoding="utf-8") as update_out, \
     open(creates_file, "w", newline="", encoding="utf-8") as create_out:

    reader = csv.DictReader(infile)
    fieldnames = ["HCF", "LOCAL_COLETA", "DESCRICAO_COLETA"]

    update_writer = csv.DictWriter(update_out, fieldnames=fieldnames)
    create_writer = csv.DictWriter(create_out, fieldnames=fieldnames)

    # Cabeçalhos
    update_writer.writeheader()
    create_writer.writeheader()

    for row in reader:
        hcf = row["HCF"].strip()
        local = row["LOCAL_COLETA"].strip()
        desc = row["DESCRICAO_COLETA"].strip()

        # Somente se HCF também for numérico
        if is_number(hcf) and is_number(local):
            update_writer.writerow({
                "HCF": hcf,
                "LOCAL_COLETA": local,
                "DESCRICAO_COLETA": desc
            })
        else:
            create_writer.writerow({
                "HCF": hcf,
                "LOCAL_COLETA": local,
                "DESCRICAO_COLETA": desc
            })

print(f"✅ Arquivo de UPDATES: {updates_file}")
print(f"✅ Arquivo de CREATES: {creates_file}")
