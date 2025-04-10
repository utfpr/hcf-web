import mysql.connector
import psycopg2
from psycopg2 import sql
import fdb

class Conexao:
    def __init__(self):
        self.__conexao = None
        self.__cursor = None

    def conexaoBancoMySQL(self, user, password, banco, host="localhost", port=3306):
        """Conecta ao banco MySQL existente"""
        try:
            self.__conexao = mysql.connector.connect(user=user, password=password, database=banco, host=host, port=port)
            self.__cursor = self.__conexao.cursor()
        except mysql.connector.Error as err:
            print(f"Erro ao conectar ao banco MySQL {banco}: {err}")
            self.__conexao = None
            self.__cursor = None
            
    def conexaoBancoFirebird(self, database, user, password, power):
        """Conecta ao banco Firebird existente"""
        try:
            if (power):
                self.__conexao = fdb.connect(
                    dsn=database,
                    user=user, 
                    password=password,
                    charset='UTF8'
                )
                self.__cursor = self.__conexao.cursor()
        except fdb.Error as err:
            print(f"Erro ao conectar ao banco Firebird: {err}")
            self.__conexao = None
            self.__cursor = None
    
    def conexaoBancoPostgres(self, user, password, banco, host="localhost", port="5432"):
        """Cria um banco de dados no PostgreSQL e se conecta a ele"""
        try:
            # Conectar sem banco para poder criar um novo
            temp_conexao = psycopg2.connect(user=user, password=password, host=host, port=port)
            temp_conexao.autocommit = True  # Necessário para CREATE DATABASE
            temp_cursor = temp_conexao.cursor()

            # Criar banco de dados se não existir
            temp_cursor.execute(sql.SQL("SELECT 1 FROM pg_database WHERE datname = %s"), (banco,))
            if not temp_cursor.fetchone():
                temp_cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(banco)))
                print(f"Banco de dados {banco} criado com sucesso.")

            # Fechar conexão temporária
            temp_cursor.close()
            temp_conexao.close()

            # Conectar ao novo banco
            self.__conexao = psycopg2.connect(user=user, password=password, dbname=banco, host=host, port=port)
            self.__cursor = self.__conexao.cursor()

        except psycopg2.Error as err:
            print(f"Erro ao criar ou conectar ao banco PostgreSQL {banco}: {err}")
            self.__conexao = None
            self.__cursor = None

    def getCursor(self):
        return self.__cursor

    def getConexao(self):
        return self.__conexao

    def closeConexao(self):
        if self.__cursor:
            self.__cursor.close()
        if self.__conexao:
            self.__conexao.close()

