import csv

input_file = "colais de coleta.csv"
output_file = "coletas_unificadas.csv"
output_unique_file = "coletas_unificadas_unicas.csv"


def gerar_csv_completo():
    with open(input_file, "r", encoding="utf-8") as infile, \
         open(output_file, "w", newline="", encoding="utf-8") as outfile:

        reader = csv.DictReader(infile)
        fieldnames = ["HCF", "LOCAL_COLETA", "DESCRICAO_COLETA"]
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)

        writer.writeheader()

        for row in reader:
            hcf = row.get("HCF", "").strip()
            local_coleta = row.get("LOCAL_COLETA", "").strip()

            descricao = " ".join([
                row.get("LOCAL_COLETA_LOCAL", "").strip(),
                row.get("LOCAL_COLETA_REGIAO", "").strip(),
                row.get("LOCAL_COLETA_COMPLEMENTO", "").strip()
            ]).strip()

            writer.writerow({
                "HCF": hcf,
                "LOCAL_COLETA": local_coleta,
                "DESCRICAO_COLETA": descricao
            })

    print(f"✅ Arquivo completo gerado: {output_file}")


def gerar_csv_sem_repeticoes():
    with open(input_file, "r", encoding="utf-8") as infile, \
         open(output_unique_file, "w", newline="", encoding="utf-8") as outfile:

        reader = csv.DictReader(infile)
        fieldnames = ["HCF", "LOCAL_COLETA", "DESCRICAO_COLETA"]
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)

        writer.writeheader()

        descricoes_vistas = set()

        for row in reader:
            hcf = row.get("HCF", "").strip()
            local_coleta = row.get("LOCAL_COLETA", "").strip()

            descricao = " ".join([
                row.get("LOCAL_COLETA_LOCAL", "").strip(),
                row.get("LOCAL_COLETA_REGIAO", "").strip(),
                row.get("LOCAL_COLETA_COMPLEMENTO", "").strip()
            ]).strip()

            if descricao not in descricoes_vistas:
                descricoes_vistas.add(descricao)
                writer.writerow({
                    "HCF": hcf,
                    "LOCAL_COLETA": local_coleta,
                    "DESCRICAO_COLETA": descricao
                })

    print(f"✅ Arquivo sem repetições gerado: {output_unique_file}")


# Executa as duas funções
gerar_csv_completo()
gerar_csv_sem_repeticoes()
