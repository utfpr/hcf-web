
import psycopg2
import hashlib

def conectar_postgres():
    return psycopg2.connect(
        host='localhost',
        user='postgres',
        password='postgres',
        dbname='hcf'
    )
    
def gerar_hash_linha(linha):
    return hashlib.sha256(
        '|'.join([str(v) if v is not None else 'NULL' for v in linha]).encode('utf-8')
    ).hexdigest()

def get_mysql_table_content():
    my_conn = conectar_postgres()
    my_cursor = my_conn.cursor()

    # Obtém a lista de tabelas no banco de dados
    table = "coletores_complementares"
    fields = "hcf, complementares"
    
    # Executa a consulta para obter os dados da tabela
    my_cursor.execute(f"SELECT {fields} FROM {table}")
    
    # Obtém os nomes dos campos (colunas) da tabela
    columns = [desc[0] for desc in my_cursor.description]
    
    rows = my_cursor.fetchall()
    print(f"\nConteúdo da tabela {table} ({len(rows)} registros):")
    
    # Abre o arquivo para escrita
    with open(f'{table}_postgres.txt', 'w') as file:
        # Escreve os nomes dos campos como cabeçalho
        file.write(" | ".join(columns) + "\n")
        
        # Escreve os dados das linhas abaixo do cabeçalho
        for row in rows:
            print(f"- {row}")
            file.write(" | ".join(str(value) for value in row) + "\n")


    my_cursor.close()
    my_conn.close()
    print("Conteúdo das tabelas exibido com sucesso.")
    
    

if __name__ == "__main__":
    get_mysql_table_content()
