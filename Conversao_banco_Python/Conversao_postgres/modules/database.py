from psycopg2 import Error

class Database:
    def __init__(self, db_nome, cursor):
        self.__DB_NOME = db_nome
        self.__cursor = cursor

    # Método para buscar conteúdo da tabela
    def getConteudoTabela(self, nome, sql):
        """Obtém conteúdo de uma tabela no banco de dados PostgreSQL"""
        result = "error"
        try:
            print(f"Obtendo conteúdo da tabela {nome}: ", end="")
            self.__cursor.execute(sql)
            result = self.__cursor.fetchall()
            print("OK")
        except Error as err:
            result = str(err)
            print(f"Erro ao obter conteúdo da tabela {nome}: {err}")
        return result

    # Método para inserir dados
    def insertConteudoTabela(self, nome, sql_command, conteudo, conexao):
        """Insere dados na tabela"""
        try:
            self.__cursor.execute(sql_command, conteudo)
            conexao.commit()
            # print(f"Dados inseridos com sucesso na tabela {nome}.")
        except Error as err:
            print(f"Erro ao inserir dados na tabela {nome}: {err}")

    def getNome(self):
        return self.__DB_NOME
