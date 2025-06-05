import fdb
import mysql.connector
import psycopg2
import csv

# Mapeamento manual baseado nas tabelas que você me passou
tabela_map = {
    'COLETOR': 'coletores',
    'DOACAO': None,  # não foi migrada explicitamente
    'ESPECIE': 'generos',  # gêneros vêm de especie (Firebird)
    'FAMILIA': 'familias',
    'IDENTIFICADOR': 'identificadores',
    'INSTITUICAO_IDENTIFICADORA': 'herbarios',
    'LOCAL_COLETA': 'locais_coleta',
    'PARAMETROS': 'configuracao',
    'RELEVO': 'relevos',
    'REMESSA': 'remessas',
    'SOLO': 'solos',
    'SUBFAMILIA': 'sub_familias',
    'TIPO': 'tipos',
    'TOMBO': 'tombos',
    'TOMBO_EXSICATA': 'tombos_fotos',
    'TOMBO_FOTOS': 'tombos_fotos',  # mesma origem
    'TOMBO_REG_ALT': 'tombo_alteracoes_antigas',
    'USUARIO': 'usuarios',
    'VEGETACAO': 'vegetacoes'
}

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
    fb_conn = conectar_firebird()
    my_conn = conectar_mysql()
    pg_conn = conectar_postgres()

    fb_cursor = fb_conn.cursor()
    my_cursor = my_conn.cursor()
    pg_cursor = pg_conn.cursor()

    resultados = []

    for fb_nome, destino_nome in tabela_map.items():
  
        try:
            fb_cursor.execute(f"SELECT COUNT(*) FROM {fb_nome}")
            count_fb = fb_cursor.fetchone()[0]

            my_cursor.execute(f"SELECT COUNT(*) FROM {destino_nome}")
            count_mysql = my_cursor.fetchone()[0]

            pg_cursor.execute(f"SELECT COUNT(*) FROM {destino_nome}")
            count_pg = pg_cursor.fetchone()[0]

            status = '✅ OK' if count_mysql == count_pg else '❌ Divergente'

            resultados.append({
                'Tabela Firebird': fb_nome,
                'Tabela Destino': destino_nome,
                'Registros Firebird': count_fb,
                'Registros MySQL': count_mysql,
                'Registros PostgreSQL': count_pg,
                'Status': status
            })
        except Exception as e:
            resultados.append({
                'Tabela Firebird': fb_nome,
                'Tabela Destino': destino_nome,
                'Registros Firebird': 'erro',
                'Registros MySQL': 'erro',
                'Registros PostgreSQL': 'erro',
                'Status': f'⚠️ {str(e).splitlines()[0]}'
            })

    # Exportar para CSV
    with open("comparacao_registros.csv", "w", newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Tabela Firebird', 'Tabela Destino', 'Registros Firebird', 'Registros MySQL', 'Registros PostgreSQL', 'Status']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in resultados:
            writer.writerow(row)

    print("📄 Arquivo 'comparacao_registros.csv' gerado com sucesso!")

    # Fechar conexões
    fb_cursor.close()
    my_cursor.close()
    pg_cursor.close()
    fb_conn.close()
    my_conn.close()
    pg_conn.close()

if __name__ == "__main__":
    comparar_tabelas()
