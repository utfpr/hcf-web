import fdb

def conectar_firebird():
    return fdb.connect(
        host='127.0.0.1',
        database='./../firebird/data/HERBARIUM.GDB',
        user='SYSDBA',
        password='masterkey',
        charset='WIN1252'
    )

def get_firebird_table_content():
    my_conn = conectar_firebird()
    my_cursor = my_conn.cursor()

    # Obtém a lista de tabelas no banco de dados
    table = "tombo"
    fields = "*"
    
    # Executa a consulta para obter os dados da tabela
    my_cursor.execute(f"SELECT {fields} FROM {table}")
    
    # Obtém os nomes dos campos (colunas) da tabela
    columns = [desc[0] for desc in my_cursor.description]
    
    rows = my_cursor.fetchall()
    print(f"\nConteúdo da tabela {table} ({len(rows)} registros):")
    
    # Abre o arquivo para escrita
    with open(f'{table}_firebird.txt', 'w') as file:
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
    get_firebird_table_content()
