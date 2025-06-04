
import mysql.connector

def conectar_mysql():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Test@123',
        database='hcf'
    )

def get_mysql_table_content():
    my_conn = conectar_mysql()
    my_cursor = my_conn.cursor()

    # Obtém a lista de tabelas no banco de dados
    table = "identificadores"
    fields = "nome"
    
    my_cursor.execute(f"SELECT {fields} FROM {table}")
    rows = my_cursor.fetchall()
    print(f"\nConteúdo da tabela {table} ({len(rows)} registros):")
    with open('identificadores_mysql.txt', 'w') as file:
        for row in rows:
            nome_identificador = row[0].strip()
            print(f"- {nome_identificador}")
            file.write(f"{nome_identificador}\n")


    my_cursor.close()
    my_conn.close()
    print("Conteúdo das tabelas exibido com sucesso.")
    
    

if __name__ == "__main__":
    get_mysql_table_content()
