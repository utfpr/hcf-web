import fdb
import mysql.connector
import psycopg2
import csv

# Mapeamento manual baseado nas tabelas que você me passou
tabela_map = [
    "autores", "alteracoes", "cidades", "colecoes_anexas",
    "coletores", "coletores_complementares", "configuracao", "enderecos",
    "especies", "estados", "familias", "fase_sucessional",
    "generos", "herbarios", "historico_acessos", "identificadores",
    "locais_coleta", "paises", "relevos",
    "remessas", "retirada_exsiccata_tombos", "solos",
    "sub_especies", "sub_familias", "telefones", "tipos",
    "tipos_usuarios", "tombo_alteracoes_antigas", "tombos",
    "tombos_fotos", "tombos_identificadores", "usuarios",
    "variedades", "vegetacoes"
]

def conectar_firebird():
    return fdb.connect(
        host='127.0.0.1',
        database='./../firebird/data/HERBARIUM.GDB',
        user='SYSDBA',
        password='masterkey',
        charset='WIN1252'
    )

def conectar_mysql():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Test@123',
        database='hcf'
    )

def conectar_postgres():
    return psycopg2.connect(
        host='localhost',
        user='postgres',
        password='postgres',
        dbname='hcf'
    )

def contar_linhas(cursor, tabela):
    cursor.execute(f"SELECT COUNT(*) FROM {tabela}")
    return cursor.fetchone()[0]

def comparar_tabelas():
    my_conn = conectar_mysql()
    pg_conn = conectar_postgres()

    my_cursor = my_conn.cursor()
    pg_cursor = pg_conn.cursor()

    resultados = []

    for item in tabela_map:
        try:
            my_cursor.execute(f"SELECT COUNT(*) FROM {item}")
            count_mysql = my_cursor.fetchone()[0]

            pg_cursor.execute(f"SELECT COUNT(*) FROM {item}")
            count_pg = pg_cursor.fetchone()[0]

            status = '✅ OK' if count_mysql == count_pg else '❌ Divergente'

            resultados.append({
                "Tabela": item,
                'Registros MySQL': count_mysql,
                'Registros PostgreSQL': count_pg,
                'Status': status
            })
        except Exception as e:
            resultados.append({
                "tabela": item,
                'Registros Firebird': 'erro',
                'Registros MySQL': 'erro',
                'Registros PostgreSQL': 'erro',
                'Status': f'⚠️ {str(e).splitlines()[0]}'
            })

    # Exportar para CSV
    with open("comparacao_registros.csv", "w", newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Tabela','Registros MySQL', 'Registros PostgreSQL', 'Status']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in resultados:
            writer.writerow(row)

    print("📄 Arquivo 'comparacao_registros.csv' gerado com sucesso!")

    # Fechar conexões
    my_cursor.close()
    pg_cursor.close()
    my_conn.close()
    pg_conn.close()

if __name__ == "__main__":
    comparar_tabelas()
