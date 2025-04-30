import hashlib
import fdb
import mysql.connector
import psycopg2

def gerar_hash_linha(linha):
    return hashlib.sha256(
        '|'.join([str(v) if v is not None else 'NULL' for v in linha]).encode('utf-8')
    ).hexdigest()

def exportar_hashes_firebird():
    conn = fdb.connect(
        host='127.0.0.1',
        database='./../firebird/data/HERBARIUM.GDB',
        user='SYSDBA',
        password='masterkey',
        charset='UTF-8',
    )
    cursor = conn.cursor()
    tabela = 'tombo'
    cursor.execute(f'SELECT * FROM {tabela}')
    hashes = [gerar_hash_linha(row) for row in cursor.fetchall()]
    with open(f"{tabela}_hashes_firebird.txt", "w") as f:
        for h in hashes:
            f.write(h + "\n")
    print(f"{len(hashes)} linhas exportadas do Firebird")
    cursor.close()
    conn.close()

def exportar_hashes_mysql():
    conn = mysql.connector.connect(
        host='localhost',
        user='root',
        password='Test@123',
        database='hcf'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tombos")
    hashes = [gerar_hash_linha(row) for row in cursor.fetchall()]
    with open("tombos_hashes_mysql.txt", "w") as f:
        for h in hashes:
            f.write(h + "\n")
    print(f"{len(hashes)} linhas exportadas do MySQL")
    cursor.close()
    conn.close()

def exportar_hashes_postgres():
    conn = psycopg2.connect(
        host='localhost',
        user='postgres',
        password='password',
        dbname='hcf'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tombos")
    hashes = [gerar_hash_linha(row) for row in cursor.fetchall()]
    with open("tombos_hashes_postgres.txt", "w") as f:
        for h in hashes:
            f.write(h + "\n")
    print(f"{len(hashes)} linhas exportadas do PostgreSQL")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    exportar_hashes_firebird()
    exportar_hashes_mysql()
    exportar_hashes_postgres()
