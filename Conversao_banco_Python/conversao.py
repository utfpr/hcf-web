from __future__ import print_function
import csv
import re
import time
start_time = time.time()
import mysql.connector
from mysql.connector import errorcode
import fdb
import os
from dotenv import load_dotenv
import unicodedata

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path)

latitudesErros, longitudesErros = list(), list()

class Conexao():
    def __init__(self):
        self.__conexao = ''
        self.__cursor = ''

    def conexaoNovoBanco(self, user, password, host):
        print("[CONN] Conectando ao banco MySQL")
        print("[CONN] Conexão realizada com sucesso")
        self.__conexao = mysql.connector.connect(user=user, password=password, host=host, port='3306')
        self.__cursor =  self.__conexao.cursor(dictionary=True)

    def conexaoBancoFirebird(self, database, user, password, power):
        """Cria uma conexão com o banco de dados Firebird usando o módulo fdb."""
        print("[CONN] Conectando ao banco Firebird")
        if (power):
            self.__conexao = fdb.connect(
                dsn=database,
                user=user, 
                password=password,
                charset='UTF8'
            )
            self.__cursor = self.__conexao.cursor()
        print("[CONN] Conexão realizada com sucesso")
    
    def conexaoBancoExistente(self, user, password, banco):
        self.__conexao = mysql.connector.connect(user=user, password=password, database=banco, host='localhost', port='3306')
        self.__cursor =  self.__conexao.cursor(dictionary=True)
    
    def getCursor(self):
        return self.__cursor

    def getConexao(self):
        return self.__conexao

    def closeConexao(self):
        self.__cursor.close()
        self.__conexao.close()

class Database():
    def __init__(self, db_nome, cursor):
        self.__DB_NOME = db_nome
        self.__cursor = cursor

    def create_database(self):
        try:
            self.__cursor.execute(
                "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(self.__DB_NOME))
        except mysql.connector.Error as err:
            print("Failed creating database: {}".format(err))
            exit(1)

    def drop_table(self, nome):
        try:
            self.__cursor.execute('DROP TABLE IF EXISTS `{}`;'.format(nome))
            print('DROP TABLE IF EXISTS `{}`: '.format(nome), end='')
        except mysql.connector.Error as err:
            print(err.msg)
        else:
            print("OK")

    def create_table(self, nome, sql):
        
        try:
            print("[INFO] Creating table {}: ".format(nome), end='')
            self.__cursor.execute(sql)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print("already exists.")
            else:
                print(err.msg)
        else:
            print("OK")
            
    def getNome(self):
        return self.__DB_NOME

    def getConteudoTabelaFirebird(self, nome, sql):
        result = []
        try:
            print(f"[INFO] Getting table content {nome}: ", end='')
            self.__cursor.execute(sql)
            rows = self.__cursor.fetchall()
            if rows:
                columns = [desc[0].lower() for desc in self.__cursor.description]
                result = [dict(zip(columns, row)) for row in rows]
            else:
                print("No data found.")
        except mysql.connector.Error as err:
            print(f"Error: {err.msg}")
        else:
            print("OK")
        return result
    
    def getConteudoTabelaMySql(self, nome, sql):
        result = []
        try:
            print(f"[INFO] Getting table content {nome}: ", end='')
            self.__cursor.execute(sql)
            result = self.__cursor.fetchall()
        except mysql.connector.Error as err:
            print(f"Error: {err.msg}")
        else:
            print("OK")
        return result


    def insertConteudoTabela(self, nome, sql, conteudo, conexao, tombo = 0, dia = 0, mes = 0, ano = 0):
        try:
            # # print("Inserting table content {}: ".format(nome), end='')
            self.__cursor.execute(sql, conteudo)
            conexao.commit()
        except mysql.connector.Error as err:
            print(err.msg, tombo, dia, mes, ano)       
        # # else:
        # #     print("OK")
    
def padronizaNomeAutor(nome):
    nomeFinal = ""
    for i in range(0, len(nome)):
        if (nome[i] != '(' and nome[i] != ')'):
            if (nome[i] == '&'):
                nomeFinal += " & "
            elif (ord(nome[i]) >= 65 and ord(nome[i]) <= 90): # é maiusculo
                if (i + 1 < len(nome)):
                    if (nome[i + 1] == '&'):
                        nomeFinal += nome[i] + ". "
                    elif (ord(nome[i + 1]) >= 65 and ord(nome[i + 1]) <= 90):
                        nomeFinal += nome[i] + ". "
                    elif (i - 1 >= 0 and ord(nome[i - 1]) >= 97 and ord(nome[i - 1]) <= 122):
                        nomeFinal += " " + nome[i]
                    else :
                        nomeFinal += nome[i]
            else:
                nomeFinal += nome[i]
        else:
            nomeFinal += nome[i]
    return nomeFinal

def getIniciaisAutores(nome: str) -> str:
    partes = nome.replace("&", "").split()
    iniciais = [p[0].upper() + "." for p in partes if p and p[0].isalpha()]
    return " ".join(iniciais)

def buscaCidadeId(listaCidade, listaEstados, listaPaises, cidadeAntiga):
    pais_nome = cidadeAntiga.get("pais", "").upper()
    cidade_nome = cidadeAntiga.get("cidade", "")
    estado_sigla = cidadeAntiga.get("estado", "")

    if pais_nome in ['BRASIL', 'BR']:
        for cidade in listaCidade:
            cidade_id, cidade_nome_lista, estado_id_cidade = cidade
            if cidade_nome_lista == cidade_nome:
                for estado in listaEstados:
                    estado_id, estado_nome, estado_sigla_lista, pais_id_estado = estado
                    if estado_id_cidade == estado_id and estado_sigla_lista == estado_sigla:
                        return cidade_id
    else:
        for pais in listaPaises:
            pais_id, pais_nome_lista, pais_sigla = pais
            if pais_nome_lista.upper() == pais_nome:
                for estado in listaEstados:
                    estado_id, estado_nome, estado_sigla, pais_id_estado = estado
                    if pais_id_estado == pais_id:
                        return estado_id * 100000


    # # gerar lista de cidades que nao estao sendo inseridas select * from _.local_coleta where codigo in (SELECT id FROM hcf.locais_coleta where cidade_id is NULL);

def unique(list):
    # # initialize a null list
    unique_list = []
     
    # traverse for all elements
    for x in list:
        # # check if exists in unique_list or not
        if x not in unique_list:
            unique_list.append(x)
    return unique_list

def padronizaCoordenada(coordenada):
    coordenada = coordenada.replace(" ","")
    coordenada = coordenada.replace("k","")
    coordenada = coordenada.replace("º","°")
    coordenada = coordenada.replace("\'\'","\"")
    # # se nao tiver graus e minutos coordenada invalida 
    if(coordenada.find("°") == -1):
        coordenada = "0°" + coordenada
    if(coordenada.find("\'") == -1):
        coordenada = coordenada.replace("°", "°0\"")
    if(coordenada.find("\"") == -1):
        coordenada = coordenada.replace("\'", "\'0\"")
    
    return coordenada
    
def convertLatitude(latitude, hcf=0):
    if not latitude:  # Se latitude for NULL ou vazia
        return None

    dadoReal = latitude
    latitude = padronizaCoordenada(latitude)

    # Substitui possíveis caracteres errados
    latitude = latitude.replace(chr(176), '°')

    try:
        if '°' in latitude and "'" in latitude and '"' in latitude:
            partes = latitude.split('°')
            graus = partes[0].strip()
            resto = partes[1].split("'")
            minutos = resto[0].strip()
            segundos_direcao = resto[1].split('"')
            segundos = segundos_direcao[0].strip()
            direcao = segundos_direcao[1].strip()

            # Conversão para float
            latitudeConvertida = float(graus.replace(",", ".")) + \
                                 float(minutos.replace(",", ".")) / 60 + \
                                 float(segundos.replace(",", ".")) / 3600

            # Se for Sul (S), o valor deve ser negativo
            if direcao.upper() == 'S':
                latitudeConvertida *= -1

            return latitudeConvertida

        else:
            print(f"[INFO] Formato inesperado de latitude no HCF - {hcf}: {dadoReal}. Usando NULL")
            return None

    except (ValueError, IndexError) as e:
        print(f"[INFO] Erro ao converter latitude no HCF - {hcf}: {dadoReal}. Usando NULL")
        return None
    

def convertLongitude(longitude, hcf=0):
    if not longitude:  # Se longitude for NULL ou vazia
        return None

    dadoReal = longitude
    longitude = padronizaCoordenada(longitude)

    # Substitui possíveis caracteres errados
    longitude = longitude.replace(chr(176), '°')

    try:
        if '°' in longitude and "'" in longitude and '"' in longitude:
            partes = longitude.split('°')
            graus = partes[0].strip()
            resto = partes[1].split("'")
            minutos = resto[0].strip()
            segundos_direcao = resto[1].split('"')
            segundos = segundos_direcao[0].strip()
            direcao = segundos_direcao[1].strip()

            # Conversão para float
            longitudeConvertida = float(graus.replace(",", ".")) + \
                                  float(minutos.replace(",", ".")) / 60 + \
                                  float(segundos.replace(",", ".")) / 3600

            # Se for Oeste (W), o valor deve ser negativo
            if direcao.upper() in ['W', 'O']:  # Aceita 'O' para Oeste
                longitudeConvertida *= -1

            return longitudeConvertida

        else:
            print(f"[INFO] Formato inesperado de longitude no HCF - {hcf}: {dadoReal}. Usando NULL")
            return None

    except (ValueError, IndexError) as e:
        print(f"[INFO] Erro ao converter longitude no HCF - {hcf}: {dadoReal}. Usando NULL")
        return None

def normalizar_nome(nome: str) -> str:
    """Remove acentos, espaços duplicados"""
    return ' '.join(nome.strip().split())

def converteAltitude(altitude):
    # # encontrar altitudes erradas
    # # print(altitude)
    if(altitude):
        return int(re.sub('[^0-9]', '', altitude))
    return None

def roman_to_int(s):
    roman_dict = {
        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
        'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9,
        'X': 10, 'XI': 11, 'XII': 12
    }
    return roman_dict.get(s.upper())

def splitData(data):
    dia, mes, ano = None, None, None

    # Tratar os diferentes cenários com base na contagem de componentes
    if len(data) == 1:
        if len(data[0]) == 4 and data[0].isdigit():
            ano = int(data[0])
        elif data[0].isnumeric():
            dia = int(data[0])
        else:
            mes = roman_to_int(data[0])
            
    elif len(data) == 2:
        if len(data[1]) == 4 and data[1].isdigit():
            if data[0].isnumeric():
                dia = int(data[0])
            else:
                mes = roman_to_int(data[0])
            ano = int(data[1])
        else:
            dia, mes = int(data[0]), roman_to_int(data[1])

    elif len(data) == 3:
        dia, mes, ano = int(data[0]), roman_to_int(data[1]), int(data[2])

    return dia, mes, ano

def get_state_name_by_id(conexao, estado_id):
    cursor = conexao.cursor()
    cursor.execute("SELECT nome FROM estados WHERE id = %s", (estado_id,))
    result = cursor.fetchone()
    return result[0] if result else "Estado não existe."

def format_coordinate(coord):
    if coord.startswith('-'):
        return '-' + coord[1:3] + '.' + coord[3:]
    else:
        return coord[0:2] + '.' + coord[2:]

def get_coordinates_from_city(city, state):
    with open('./Cidades_Estados_Paises/coordenadas.csv', newline='', encoding='UTF-8') as csvfile:
        csvReader = csv.reader(csvfile, delimiter=';')

        next(csvReader)
        for row in csvReader:
            municipio = row[1].strip()
            estado = row[6].strip() 
            if municipio == city and estado == state:
                latitude = format_coordinate(row[2])
                longitude = format_coordinate(row[3])
                return latitude, longitude
    return None, None

# Caso use a função para ler arquivos relacionados ao banco firebird, adicionar o database no último argumento, se for o sql, pode deixar vazio.
def executar_sqls(nome_arquivo, conexao, database=None):
    print(f"\n\n---- Executando SQLs do arquivo {nome_arquivo} ... ----")
    cursor = None
    
    if not database:
        cursor = conexao.cursor()
    
    with open(nome_arquivo, 'r') as sql_file:
        sql_queries = sql_file.read()
    
    for query in sql_queries.split(';'):
        if query.strip():
            if database:
                database.insertConteudoTabela('Execução de SQLs', query.strip(), (), conexao)
            else:
                cursor.execute(query.strip())
    
    conexao.commit()
    if not database:
        cursor.close()
    print(f"Execução do arquivo {nome_arquivo} concluída com sucesso.")

def buildTables(arquivoSql):
    tabelas = {}
    with open(arquivoSql, 'r', encoding='utf-8') as f:
        sqlContent = f.read()
            
    # Expressão regular para capturar blocos de CREATE TABLE
    matches = re.findall(r'CREATE TABLE `(\w+)` \((.*?)\) ENGINE=.*?;', sqlContent, re.S)
    
    for nome, estrutura in matches:
        tabelas[nome] = f"CREATE TABLE `{nome}` ({estrutura}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;"
    
    return tabelas

def importarSql():
    caminho_script = os.path.dirname(__file__)

    caminho_arquivo_sql = os.path.join(caminho_script, 'BuildTabelas.sql')
    
    return buildTables(caminho_arquivo_sql)

def main():
    conexaoFirebird = Conexao()
    conexaoFirebird.conexaoBancoFirebird(os.getenv("FIREBIRD_DB_PATH"), os.getenv("FIREBIRD_USER"), os.getenv("FIREBIRD_PASSWORD"), True)

    conexaoNova = Conexao()
    conexaoNova.conexaoNovoBanco(os.getenv("MYSQL_USER"), os.getenv("MYSQL_PASSWORD"), os.getenv("MYSQL_HOST"))

    TABLES = importarSql()

    databaseNova = Database("hcf", conexaoNova.getCursor()) #nome da nova base de dados

    try:
        conexaoNova.getCursor().execute("USE {}".format(databaseNova.getNome()))
    except mysql.connector.Error as err:
        print("[INFO] Banco de dados {} não existe".format(databaseNova.getNome()))
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            databaseNova.create_database()
            print("[INFO] {} criado com sucesso.".format(databaseNova.getNome()))
            conexaoNova.getConexao().database = databaseNova.getNome()
        else:
            print(err)
            exit(1)
    
    # Criação das tabelas
    for nome, sql in TABLES.items():
        databaseNova.create_table(nome, sql)

    bancoFirebird = Database('~/Desktop/test.fdb', conexaoFirebird.getCursor())    

    
    print("\n\n --- INICIANDO MIGRAÇÃO DE DADOS ... ----")
    print("\n\n --- INSERINDO REINOS ... ----")
    
    print("[OTHER] Criando dados: reinos")
    reinosData = [
        (1, 'Plantae'),
        (2, 'Fungi')
    ]
    print("[DB_MYSQL] Inserindo dados para tabela: reinos")
    sql = ("INSERT INTO reinos "
           "(id, nome) "
              "VALUES (%s, %s)")
    conexaoReinos = conexaoNova.getConexao()
    for reino in reinosData:
        commitReinosData = (reino[0], reino[1])
        databaseNova.insertConteudoTabela("reinos", sql, commitReinosData, conexaoReinos)
    print("[DB_MYSQL] Inserção concluída com sucesso")
    

    print("\n\n---- COLETORES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: coletor")
    coletorData = bancoFirebird.getConteudoTabelaFirebird("coletor", "SELECT num_coletor, nome_coletor FROM coletor")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    coletorNumero = bancoFirebird.getConteudoTabelaFirebird("tombo", "SELECT tombo_coletor, max(num_coleta) as max_coleta FROM tombo GROUP BY tombo_coletor;")
    print("[DB_MYSQL] Migrando dados para tabela: coletores")

    commitColetorData = ()
    sql = ("INSERT INTO coletores "
           "(id, nome, email, numero, ativo) "
           "VALUES (%s, %s, %s, %s, %s)")

    sql_select = "SELECT nome FROM coletores WHERE nome = %s"

    conexaoColetor = conexaoNova.getConexao()
    cursor = conexaoColetor.cursor()
    idColetor = 0

    for coletor in coletorData:
        # Busca o max_coleta para esse coletor, se existir
        max_coleta = None
        for numero in coletorNumero:
            if numero["tombo_coletor"] == coletor["num_coletor"]:
                max_coleta = numero["max_coleta"]
                break

        idColetor = coletor["num_coletor"]
        commitColetorData = (
            idColetor,
            coletor["nome_coletor"],
            None,
            max_coleta,
            1
        )
        databaseNova.insertConteudoTabela("coletores", sql, commitColetorData, conexaoColetor)


    cursor.close()
    print("[DB_MYSQL] Migração concluída com sucesso")

    print("\n\n---- RELEVOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: relevo")
    relevosData = bancoFirebird.getConteudoTabelaFirebird("relevo", "SELECT cod_relevo, tp_relevo FROM relevo")
    print("[DB_MYSQL] Migrando dados para tabela: relevos")

    commitRelevosData = ()
    sql = ("INSERT INTO relevos "
           "(id, nome) "
           "VALUES (%s, %s)")

    conexaoRelevos = conexaoNova.getConexao()
    for relevos in relevosData:
        commitRelevosData = (relevos["cod_relevo"], relevos["tp_relevo"])
        databaseNova.insertConteudoTabela("relevos", sql, commitRelevosData, conexaoRelevos)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- SOLOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: solo")
    solosData = bancoFirebird.getConteudoTabelaFirebird("solo", "SELECT cod_solo, tp_solo FROM solo")
    print("[DB_MYSQL] Migrando dados para tabela: solos")
    commitSolosData = ()
    sql = ("INSERT INTO solos "
           "(id, nome) "
           "VALUES (%s, %s)")
    conexaoSolos = conexaoNova.getConexao()
    for solos in solosData:
        commitSolosData = (solos["cod_solo"], solos["tp_solo"])
        databaseNova.insertConteudoTabela("solos", sql, commitSolosData, conexaoSolos)
    print("[DB_MYSQL] Migração concluída com sucesso")
    

    print("\n\n---- VEGETACOES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: vegetacao")
    vegetacoesData = bancoFirebird.getConteudoTabelaFirebird("vegetacao", "SELECT cod_vegetacao, tp_vegetacao FROM vegetacao")
    print("[DB_MYSQL] Migrando dados para tabela: vegetacoes")

    commitVegetacoesData = ()
    sql = ("INSERT INTO vegetacoes "
           "(id, nome) "
           "VALUES (%s, %s)")

    conexaoVegetacoes = conexaoNova.getConexao()
    for vegetacoes in vegetacoesData:
        commitVegetacoesData = (vegetacoes["cod_vegetacao"], vegetacoes["tp_vegetacao"])
        databaseNova.insertConteudoTabela("vegetacoes", sql, commitVegetacoesData, conexaoVegetacoes)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- FASE_SUCESSIONAL ... ----")
    print("[OTHER] Criando dados: fase_sucessional")
    fase_sucessionalData = [
        (1, '1º fase sucessão vegetal'),
        (2, '2º fase sucessão vegetal'),
        (3, '3º fase ou capoeirinhia'),
        (4, '4º fase capoeira'),
        (5, '5º fase capoeirão'),
        (6, '6º fase floresta secundária')
    ]

    print("[DB_MYSQL] Inserindo dados para tabela: fase_sucessional")
    sql = ("INSERT INTO fase_sucessional "
           "(numero, nome) "
           "VALUES (%s, %s)")

    conexaoFase_sucessional = conexaoNova.getConexao()
    for numero, nome in fase_sucessionalData:
        commitFase_sucessionalData = (numero, nome)
        databaseNova.insertConteudoTabela("fase_sucessional", sql, commitFase_sucessionalData, conexaoFase_sucessional)
    print("[DB_MYSQL] Inserção concluída com sucesso")



    print("\n\n---- PAISES ... ----")
    print("[OTHER] Criando dados: países")
    paisesData = ''
    with open('./Cidades_Estados_Paises/paises.csv', newline='', encoding="utf8") as csvfile:
        csvReader = csv.reader(csvfile, delimiter = ';')
        next(csvReader)
        paisesData = list(csvReader)
    print("[DB_MYSQL] Inserindo dados para tabela: paises")
    sql = ("INSERT INTO paises "
           "(id, nome, sigla) "
           "VALUES (%s, %s, %s)")

    conexaoPaises = conexaoNova.getConexao()
    for pais in paisesData:
        id_pais, sigla, nome = pais
        commitPaisesData = (id_pais, nome, sigla)
        databaseNova.insertConteudoTabela("paises", sql, commitPaisesData, conexaoPaises)
    print("[DB_MYSQL] Inserção concluída com sucesso")



    print("\n\n---- ESTADOS ... ----")
    print("[OTHER] Criando dados: estados")
    estadosData = ''
    with open('./Cidades_Estados_Paises/estados.csv', newline='', encoding="utf8") as csvfile:
        csvReader = csv.reader(csvfile, delimiter = ';')
        next(csvReader)
        estadosData = list(csvReader)
    print("[DB_MYSQL] Inserindo dados para tabela: estados")
    sql = ("INSERT INTO estados "
           "(id, nome, sigla, codigo_telefone, pais_id) "
           "VALUES (%s, %s, %s, %s, %s)")

    conexaoEstados = conexaoNova.getConexao()
    for estado in estadosData:
        id_estado, sigla, nome, pais_id = estado
        commitEstadosData = (id_estado, nome, sigla, None, pais_id)
        databaseNova.insertConteudoTabela("estados", sql, commitEstadosData, conexaoEstados)

    print("[DB_MYSQL] Inserção concluída com sucesso")



    print("\n\n---- CIDADES ... ----")
    print("[OTHER] Criando dados: cidades")
    cidadesData = ''
    with open('./Cidades_Estados_Paises/municipios.csv', newline='', encoding='utf8') as csvfile:
        csvReader = csv.reader(csvfile, delimiter=';')
        next(csvReader)
        cidadesData = list(csvReader)
    print("[DB_MYSQL] Inserindo dados para tabela: cidades")
    sql = ("INSERT INTO cidades "
           "(id, estado_id, nome, latitude, longitude) "
           "VALUES (%s, %s, %s, %s, %s)")

    conexaoCidades = conexaoNova.getConexao()
    for cidade in cidadesData:
        cidade_id, nome_cidade, estado_id = cidade[0], cidade[1], cidade[2]
        
        nome_estado = get_state_name_by_id(conexaoCidades, estado_id)
        latitude, longitude = get_coordinates_from_city(nome_cidade, nome_estado)

        commitCidadesData = (cidade_id, estado_id, nome_cidade, latitude, longitude)
        databaseNova.insertConteudoTabela("cidades", sql, commitCidadesData, conexaoCidades)
    print("[DB_MYSQL] Inserção concluída com sucesso")



    print("\n\n---- CORRECAO LON - LAT CIDADES ... ----")
    print("[DB_MYSQL] Corrigindo latitudes e longitudes das cidades")
    conexaoSql = conexaoNova.getConexao()
    cursorNova = conexaoSql.cursor()

    executar_sqls('./Cidades_Estados_Paises/updated_cities_coordinates.sql', conexaoSql)

    print("\n\n---- LOCAIS_COLETA ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: local_coleta")
    locaisColetaData = bancoFirebird.getConteudoTabelaFirebird(
        "local_coleta",
        "SELECT codigo, local, regiao_do_local, cidade, estado, pais FROM local_coleta"
    )

    print("[DB_MYSQL] Migrando dados para tabela: locais_coleta")
    sql = (
        "INSERT INTO locais_coleta "
        "(id, descricao, cidade_id, fase_sucessional_id, complemento, fase_numero) "
        "VALUES (%s, %s, %s, %s, %s, %s)"
    )

    cidadeLista = databaseNova.getConteudoTabelaMySql("cidades", "SELECT id, nome, estado_id FROM cidades")
    estadoLista = databaseNova.getConteudoTabelaMySql("estados", "SELECT id, nome, sigla, pais_id FROM estados")
    paisLista = databaseNova.getConteudoTabelaMySql("paises", "SELECT id, nome, sigla FROM paises")

    conexaoLocaisColeta = conexaoNova.getConexao()
    for local in locaisColetaData:
        local_id = local.get("codigo")
        local_nome = local.get("local") or ""
        local_regiao = local.get("regiao_do_local") or ""
        cidade_id = buscaCidadeId(cidadeLista, estadoLista, paisLista, local)

        commitLocaisColetaData = (
            local_id,
            f"{local_nome}{local_regiao}",
            cidade_id,
            None,  
            None,  
            None   
        )
        databaseNova.insertConteudoTabela("locais_coleta", sql, commitLocaisColetaData, conexaoLocaisColeta)

    print("[DB_MYSQL] Migração concluída com sucesso")


    print("\n\n---- FAMILIAS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: familia")
    familiasData = bancoFirebird.getConteudoTabelaFirebird("familia", "SELECT cod_familia, familia FROM familia")

    print("[DB_MYSQL] Migrando dados para tabela: familias")
    sql = (
        "INSERT INTO familias "
        "(id, nome, ativo, reino_id) "
        "VALUES (%s, %s, %s, %s)"
    )

    conexaoFamilias = conexaoNova.getConexao()
    for familia in familiasData:
        commitFamiliasData = (
            familia.get("cod_familia"),
            familia.get("familia"),
            1,
            1
        )
        databaseNova.insertConteudoTabela("familias", sql, commitFamiliasData, conexaoFamilias)

    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- GENEROS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    generosData = bancoFirebird.getConteudoTabelaFirebird("especie", "SELECT especie, cd_familia FROM especie")
    print("[DB_MYSQL] Migrando dados para tabela: generos")
    sql = (
        "INSERT INTO generos "
        "(id, nome, familia_id, ativo) "
        "VALUES (%s, %s, %s, %s)"
    )

    conexaogeneros = conexaoNova.getConexao()
    id = 0
    for genero in generosData:
        id += 1
        commitgenerosData = (
            id,
            genero.get("especie"),
            genero.get("cd_familia"),
            1
        )
        databaseNova.insertConteudoTabela("generos", sql, commitgenerosData, conexaogeneros)

    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- AUTORES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")

    query_autores = """
        SELECT DISTINCT especie_especie_autor AS nome_autor FROM tombo
        UNION
        SELECT DISTINCT especie_subspecie_autor AS nome_autor FROM tombo
        UNION
        SELECT DISTINCT especie_variedade_autor AS nome_autor FROM tombo
    """

    autoresData = bancoFirebird.getConteudoTabelaFirebird("tombo", query_autores)

    print("[DB_MYSQL] Migrando dados para tabela: autores")

    nomePadronizado = []
    for autor in autoresData:
        if autor["nome_autor"]:
            nomePadronizado.append(padronizaNomeAutor(autor["nome_autor"])) 

    nomePadronizado = list(set(nomePadronizado))
    nomePadronizado = unique(nomePadronizado)
    sql_select = "SELECT nome FROM autores WHERE nome = %s"
    sql_insert = (
        "INSERT INTO autores "
        "(id, nome, iniciais, ativo) "
        "VALUES (%s, %s, %s, %s)"
    )

    conexaoAutores = conexaoNova.getConexao()
    cursor = conexaoAutores.cursor()
    id = 0

    for autor in nomePadronizado:
        cursor.execute(sql_select, (autor,))
        resultado = cursor.fetchone()
        if resultado is None:
            id += 1
            iniciais = getIniciaisAutores(autor)
            commitAutoresData = (id, autor, iniciais, 1)
            databaseNova.insertConteudoTabela("autores", sql_insert, commitAutoresData, conexaoAutores)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- ESPECIES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    tomboData = bancoFirebird.getConteudoTabelaFirebird("tombo", """
        SELECT DISTINCT 
            especie_especie_2 AS especie, 
            especie_especie_autor AS autor_especie, 
            codigo_familia, 
            codigo_especie 
        FROM tombo
    """)

    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    especieData = bancoFirebird.getConteudoTabelaFirebird("especie", """
        SELECT 
            cd_familia, 
            codigo_especie, 
            especie 
        FROM especie
    """)

    print("[DB_MYSQL] Obtendo dados da tabela: autores")
    autorData = databaseNova.getConteudoTabelaMySql("autor", "SELECT id, nome FROM autores")

    print("[DB_MYSQL] Obtendo dados da tabela: generos")
    generoData = databaseNova.getConteudoTabelaMySql("generos", "SELECT id, nome, familia_id FROM generos")

    print("[DB_MYSQL] Migrando dados para tabela: especies")
    sql = (
        "INSERT INTO especies "
        "(nome, autor_id, genero_id, familia_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s)"
    )

    conexaoEspecies = conexaoNova.getConexao()

    for tombo in tomboData:
        if tombo["especie"]:
            if tombo["autor_especie"]:
                for autor in autorData:
                    if autor["nome"] == padronizaNomeAutor(tombo["autor_especie"]):
                        for especie in especieData:
                            if especie["cd_familia"] == tombo["codigo_familia"] and especie["codigo_especie"] == tombo["codigo_especie"]:
                                for genero in generoData:
                                    if especie["especie"] == genero["nome"] and especie["cd_familia"] == genero["familia_id"]:
                                        commitEspeciesData = (
                                            tombo["especie"],
                                            autor["id"],
                                            genero["id"],
                                            tombo["codigo_familia"],
                                            1
                                        )
                                        databaseNova.insertConteudoTabela("especies", sql, commitEspeciesData, conexaoEspecies)
            else:
                for especie in especieData:
                    if especie["cd_familia"] == tombo["codigo_familia"] and especie["codigo_especie"] == tombo["codigo_especie"]:
                        for genero in generoData:
                            if especie["especie"] == genero["nome"] and especie["cd_familia"] == genero["familia_id"]:
                                commitEspeciesData = (
                                    tombo["especie"],
                                    None,
                                    genero["id"],
                                    tombo["codigo_familia"],
                                    1
                                )
                                databaseNova.insertConteudoTabela("especies", sql, commitEspeciesData, conexaoEspecies)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- VARIEDADES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    tomboData = bancoFirebird.getConteudoTabelaFirebird("tombo", """
        SELECT DISTINCT 
            especie_variedade AS variedade,
            especie_variedade_autor AS variedade_autor,
            codigo_familia,
            codigo_especie,
            especie_especie_2
        FROM tombo
    """)

    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    especieData = bancoFirebird.getConteudoTabelaFirebird("especie", """
        SELECT 
            cd_familia,
            codigo_especie,
            especie
        FROM especie
    """)

    print("[DB_MYSQL] Obtendo dados da tabela: autores")
    autorData = databaseNova.getConteudoTabelaMySql("autor", "SELECT id, nome FROM autores")

    print("[DB_MYSQL] Obtendo dados da tabela: generos")
    generoData = databaseNova.getConteudoTabelaMySql("generos", "SELECT id, nome FROM generos")

    print("[DB_MYSQL] Obtendo dados da tabela: especies")
    especiesData = databaseNova.getConteudoTabelaMySql("especies", "SELECT id, nome FROM especies")

    print("[DB_MYSQL] Migrando dados para tabela: variedades")

    sql = (
        "INSERT INTO variedades "
        "(nome, autor_id, especie_id, genero_id, familia_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s)"
    )

    conexaoEspecies = conexaoNova.getConexao()

    for tombo in tomboData:
        if tombo["variedade"]:
            if tombo["variedade_autor"]: 
                for autor in autorData:
                    if autor["nome"] == padronizaNomeAutor(tombo["variedade_autor"]):
                        for especieNova in especiesData:
                            if especieNova["nome"] == tombo["especie_especie_2"]:
                                for especie in especieData:
                                    if especie["cd_familia"] == tombo["codigo_familia"] and especie["codigo_especie"] == tombo["codigo_especie"]:
                                        for genero in generoData:
                                            if especie["especie"] == genero["nome"]:
                                                commitEspeciesData = (
                                                    tombo["variedade"],
                                                    autor["id"],
                                                    especieNova["id"],
                                                    genero["id"],
                                                    tombo["codigo_familia"],
                                                    1
                                                )
                                                databaseNova.insertConteudoTabela("variedades", sql, commitEspeciesData, conexaoEspecies)
            else:  
                for especieNova in especiesData:
                    if especieNova["nome"] == tombo["especie_especie_2"]:
                        for especie in especieData:
                            if especie["cd_familia"] == tombo["codigo_familia"] and especie["codigo_especie"] == tombo["codigo_especie"]:
                                for genero in generoData:
                                    if especie["especie"] == genero["nome"]:
                                        commitEspeciesData = (
                                            tombo["variedade"],
                                            None,
                                            especieNova["id"],
                                            genero["id"],
                                            tombo["codigo_familia"],
                                            1
                                        )
                                        databaseNova.insertConteudoTabela("variedades", sql, commitEspeciesData, conexaoEspecies)

    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- SUB_ESPECIES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    tomboData = bancoFirebird.getConteudoTabelaFirebird("tombo", """
        SELECT DISTINCT 
            especie_subspecie AS subEspecie,
            especie_subspecie_autor AS autor_subEspecie,
            codigo_familia,
            codigo_especie,
            especie_especie_2
        FROM tombo
    """)

    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    especieData = bancoFirebird.getConteudoTabelaFirebird("especie", """
        SELECT 
            cd_familia,
            codigo_especie,
            especie
        FROM especie
    """)

    print("[DB_MYSQL] Obtendo dados da tabela: autores")
    autorData = databaseNova.getConteudoTabelaMySql("autor", "SELECT id, nome FROM autores")

    print("[DB_MYSQL] Obtendo dados da tabela: generos")
    generoData = databaseNova.getConteudoTabelaMySql("generos", "SELECT id, nome FROM generos")

    print("[DB_MYSQL] Obtendo dados da tabela: especies")
    especiesData = databaseNova.getConteudoTabelaMySql("especies", "SELECT id, nome FROM especies")

    print("[DB_MYSQL] Migrando dados para tabela: sub_especies")

    sql = (
        "INSERT INTO sub_especies "
        "(nome, especie_id, genero_id, familia_id, autor_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s)"
    )

    conexaoSubEspecies = conexaoNova.getConexao()

    for tombo in tomboData:
        if tombo["subespecie"]:
            autor_id = None

            if tombo["autor_subespecie"]:
                for autor in autorData:
                    if autor["nome"] == padronizaNomeAutor(tombo["autor_subespecie"]):
                        autor_id = autor["id"]
                        break 

            for especieNova in especiesData:
                if especieNova["nome"] == tombo["especie_especie_2"]:
                    for especie in especieData:
                        if especie["cd_familia"] == tombo["codigo_familia"] and especie["codigo_especie"] == tombo["codigo_especie"]:
                            for genero in generoData:
                                if especie["especie"] == genero["nome"]:
                                    commitSubEspeciesData = (
                                        tombo["subespecie"],
                                        especieNova["id"],
                                        genero["id"],
                                        tombo["codigo_familia"],
                                        autor_id,
                                        1
                                    )
                                    databaseNova.insertConteudoTabela("sub_especies", sql, commitSubEspeciesData, conexaoSubEspecies)
                                    break

    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- SUB_FAMILIAS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: subfamilia")
    subFamiliaData = bancoFirebird.getConteudoTabelaFirebird("subfamilia", """
        SELECT 
            cd_familiasub AS id_familia, 
            subfamilia AS nome 
        FROM subfamilia
    """)

    print("[DB_MYSQL] Migrando dados para tabela: sub_familias")

    sql = (
        "INSERT INTO sub_familias "
        "(id, nome, familia_id, autor_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s)"
    )

    conexaoSubFamilias = conexaoNova.getConexao()
    id = 0

    for subFamilia in subFamiliaData:
        id += 1
        commitSubFamiliasData = (
            id,
            subFamilia["nome"],
            subFamilia["id_familia"],
            None,
            1
        )
        databaseNova.insertConteudoTabela("sub_familias", sql, commitSubFamiliasData, conexaoSubFamilias)

    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- HERBARIOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: instituicao_identificadora")
    conexaoHerbariosAntiga = conexaoFirebird.getConexao()

    executar_sqls('updated_herbarios.sql', conexaoHerbariosAntiga, bancoFirebird)

    herbariosData = bancoFirebird.getConteudoTabelaFirebird("instituicao_identificadora", "SELECT codigo, nome_instituicao FROM instituicao_identificadora")
    print("[DB_MYSQL] Migrando dados para tabela: herbarios")
    commitHerbariosData = ()
    sql = ("INSERT INTO herbarios "
        "(id, nome, caminho_logotipo, sigla, email, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s)")  
    
    conexaoHerbarios = conexaoNova.getConexao()
    
    for herb in herbariosData:
        nome = herb["nome_instituicao"].replace(" - ", "-", 1)
        partes = nome.split("-", 1)
    
        if len(partes) > 1:
            sigla, nomeFormatado = partes[0], partes[1].strip()
        else:
            sigla, nomeFormatado = None, partes[0].strip()
    
        commitHerbariosData = (
            herb["codigo"],
            nomeFormatado,
            None,   # caminho_logotipo
            sigla,
            None,   # email
            1       # ativo
        )
    
        databaseNova.insertConteudoTabela("herbarios", sql, commitHerbariosData, conexaoHerbarios)
    
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- TIPOS ... ----")

    print("[DB_FIREBIRD] Obtendo dados da tabela: tipo")
    tipoData = bancoFirebird.getConteudoTabelaFirebird("tipo", """
        SELECT cod_tipo AS id, tp_descricao AS nome
        FROM tipo
    """)

    print("[DB_MYSQL] Migrando dados para tabela: tipos")

    sql = (
        "INSERT INTO tipos "
        "(id, nome) "
        "VALUES (%s, %s)"
    )

    conexaoTipo = conexaoNova.getConexao()

    for tipo in tipoData:
        commitTipoData = (tipo["id"], tipo["nome"])
        databaseNova.insertConteudoTabela("herbarios", sql, commitTipoData, conexaoTipo)

    print("[DB_MYSQL] Migração concluída com sucesso")

    print("\n\n---- IDENTIFICADORES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: identificador")
    identificadorData = bancoFirebird.getConteudoTabelaFirebird(
        "identificador", 
        "SELECT nome FROM identificador"
    )

    print("[DB_MYSQL] Migrando dados para tabela: identificadores")

    sql_insert = (
        "INSERT INTO identificadores (nome) VALUES (%s)"
    )
    sql_check = (
        "SELECT COUNT(*) FROM identificadores WHERE nome = %s"
    )

    conexaoIdentificador = conexaoNova.getConexao()
    cursor = conexaoIdentificador.cursor()

    for registro in identificadorData:
        print(registro)
        nomes_raw = registro['nome'] or ''
        # Separar por vírgula, ponto e vírgula, ou &
        nomes = re.split(r'\s*(?:&|;|,| e )\s*', nomes_raw)
        
        for nome in nomes:
            nome_normalizado = normalizar_nome(nome)
            if nome_normalizado:
                cursor.execute(sql_check, (nome_normalizado,))
                if cursor.fetchone()[0] == 0:
                    # print(f"Inserindo identificador: {nome_normalizado}")
                    cursor.execute(sql_insert, (nome_normalizado,))
                    conexaoIdentificador.commit()
                else:
                    print(f"Identificador já existe: {nome_normalizado}")

    cursor.close()
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- TOMBOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    tombosData = bancoFirebird.getConteudoTabelaFirebird("tombo", """
        SELECT hcf, data_tombo, data_coleta, observacao, nomes_populares, num_coleta, latitude, longitude, 
               altitude, tombo_instituicao, local_coleta, especie_variedade, tipo, especie_especie_2, 
               codigo_familia, codigo_especie, tombo_familia_sub, especie_subspecie, nome_especie, 
               vermelho, verde, azul, codigo_solo, codigo_relevo, codigo_vegetacao, 
               data_identificacao, tombo_coletor 
        FROM tombo
    """)

    print("[DB_MYSQL] Obtendo dados da tabela: variedades")
    variedadesData = databaseNova.getConteudoTabelaMySql("variedades", "SELECT id, nome FROM variedades")

    print("[DB_MYSQL] Obtendo dados da tabela: especies")
    especiesData = databaseNova.getConteudoTabelaMySql("especies", "SELECT id, nome, genero_id FROM especies")

    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    especieData = bancoFirebird.getConteudoTabelaFirebird("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")

    print("[DB_MYSQL] Obtendo dados da tabela: generos")
    generoData = databaseNova.getConteudoTabelaMySql("generos", "SELECT id, nome, familia_id FROM generos")

    print("[DB_MYSQL] Obtendo dados da tabela: sub_familias")
    sub_familiasData = databaseNova.getConteudoTabelaMySql("sub_familias", "SELECT id, nome FROM sub_familias")

    print("[DB_MYSQL] Obtendo dados da tabela: sub_especies")
    sub_especiesData = databaseNova.getConteudoTabelaMySql("sub_especies", "SELECT id, nome FROM sub_especies")

    print("[DB_MYSQL] Migrando dados para tabela: tombos")

    sql = ("INSERT INTO tombos "
           "(hcf, data_tombo, data_coleta_dia, observacao, nomes_populares, numero_coleta, latitude, longitude, "
           "altitude, entidade_id, local_coleta_id, variedade_id, tipo_id, data_identificacao_dia, data_identificacao_mes, data_identificacao_ano, situacao, especie_id, genero_id, "
           "familia_id, sub_familia_id, sub_especie_id, nome_cientifico, colecao_anexa_id, cor, data_coleta_mes, "
           "data_coleta_ano, solo_id, relevo_id, vegetacao_id, ativo, taxon, rascunho, coletor_id) "
           "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

    conexaoTombo = conexaoNova.getConexao()
    cursorNovo = conexaoTombo.cursor()

    conexaoAntigaTombo = conexaoFirebird.getConexao()
    cursorAntigo = conexaoAntigaTombo.cursor()

    coletor_id_map = {}

    sql_nome_coletor_antiga = "SELECT nome_coletor FROM coletor WHERE num_coletor = ?"
    sql_id_coletor_nova = "SELECT id FROM coletores WHERE nome = %s"

    for tombo in tombosData:
        dataSplit = str(tombo["data_coleta"]).split('-') if tombo["data_coleta"] else [None, None, None]
        if dataSplit == ['None']:
            dataSplit = [None, None, None]

        variedadeFinal = None
        if tombo["especie_variedade"]:
            for variedade in variedadesData:
                if variedade["nome"] == tombo["especie_variedade"]:
                    variedadeFinal = variedade["id"]

        generoFinal = None
        if tombo["codigo_familia"] and tombo["codigo_especie"]:
            for especie in especieData:
                if especie["cd_familia"] == tombo["codigo_familia"] and especie["codigo_especie"] == tombo["codigo_especie"]:
                    for genero in generoData:
                        if especie["especie"] == genero["nome"] and especie["cd_familia"] == genero["familia_id"]:
                            generoFinal = genero["id"]

        especieFinal = None
        if tombo["especie_especie_2"]:
            for especie in especiesData:
                if especie["nome"] == tombo["especie_especie_2"] and especie["genero_id"] == generoFinal:
                    especieFinal = especie["id"]

        sub_familiasFinal = None
        if tombo["tombo_familia_sub"]:
            for subFamilia in sub_familiasData:
                if tombo["tombo_familia_sub"] == subFamilia["nome"]:
                    sub_familiasFinal = subFamilia["id"]

        sub_especiesFinal = None
        if tombo["especie_subspecie"]:
            for subEspecie in sub_especiesData:
                if tombo["especie_subspecie"] == subEspecie["nome"]:
                    sub_especiesFinal = subEspecie["id"]

        corFinal = None
        if tombo["vermelho"] == 1:
            corFinal = 1
        elif tombo["verde"] == 1:
            corFinal = 2
        elif tombo["azul"] == 1:
            corFinal = 3

        coletor_id = None
        if tombo["tombo_coletor"]:
            tombo_coletor = tombo["tombo_coletor"]
            if tombo_coletor in coletor_id_map:
                coletor_id = coletor_id_map[tombo_coletor]
            else:
                cursorAntigo.execute(sql_nome_coletor_antiga, (tombo_coletor,))
                nome_coletor = cursorAntigo.fetchone()
                cursorAntigo.fetchall()  # Garante consumo total
                if nome_coletor:
                    # nome_coletor retorna apenas uma tupla com o nome, só pode acessar usando índice numérico
                    nome_coletor = nome_coletor[0]
                    cursorNovo.execute(sql_id_coletor_nova, (nome_coletor,))
                    resultado = cursorNovo.fetchone()
                    cursorNovo.fetchall()  # Garante consumo total
                    if resultado:
                        # resultado retorna uma tupla com o id, só pode acessar usando índice numérico
                        coletor_id = resultado[0]
                        coletor_id_map[tombo_coletor] = coletor_id

        dataIdentificacao = re.split(r'[-/,.]', str(tombo["data_identificacao"]))
        data_identificacao_dia, data_identificacao_mes, data_identificacao_ano = splitData(dataIdentificacao)

        commitTombosData = (
            tombo["hcf"], tombo["data_tombo"], dataSplit[2], tombo["observacao"], tombo["nomes_populares"], tombo["num_coleta"],
            convertLatitude(tombo["latitude"], tombo["hcf"]),
            convertLongitude(tombo["longitude"], tombo["hcf"]),
            converteAltitude(tombo["altitude"]),
            tombo["tombo_instituicao"], tombo["local_coleta"], variedadeFinal, tombo["tipo"],
            data_identificacao_dia, data_identificacao_mes, data_identificacao_ano, 'REGULAR',
            especieFinal, generoFinal, tombo["codigo_familia"], sub_familiasFinal, sub_especiesFinal,
            tombo["nome_especie"], None, corFinal, dataSplit[1], dataSplit[0],
            tombo["codigo_solo"], tombo["codigo_relevo"], tombo["codigo_vegetacao"],
            1, None, 0, coletor_id
        )

        databaseNova.insertConteudoTabela("tombos", sql, commitTombosData, conexaoTombo, tombo["hcf"], data_identificacao_dia, data_identificacao_mes, data_identificacao_ano)

    cursorAntigo.close()
    cursorNovo.close()
    print("[DB_MYSQL] Migração concluída com sucesso")

    print("\n\n---- COLETORES_COMPLEMENTARES ... ----")
    print("[INFO] Obtendo dados da tabela: tombo")
    conexaoTombo = conexaoNova.getConexao()
    cursorNovo = conexaoTombo.cursor()

    sql_tombo_complementares = "SELECT hcf, complemento_coletor FROM tombo WHERE complemento_coletor IS NOT NULL AND complemento_coletor != ''"
    cursorAntigo = conexaoAntigaTombo.cursor()
    cursorAntigo.execute(sql_tombo_complementares)
    tombos_complementares = cursorAntigo.fetchall()

    print("[DB_MYSQL] Migrando dados para tabela: coletores_complementares")
    sql_insert_coletor_complementar = "INSERT INTO coletores_complementares (hcf, complementares) VALUES (%s, %s)"
    for tombo in tombos_complementares:
        hcf, complemento_coletor = tombo
        cursorNovo.execute("SELECT COUNT(*) FROM tombos WHERE hcf = %s", (hcf,))
        result = cursorNovo.fetchone()
        if result[0] == 0:
            print(f"Erro: O valor hcf={hcf} não existe na tabela tombos.")
            continue

        cursorNovo.execute(sql_insert_coletor_complementar, (hcf, complemento_coletor.strip()))
        conexaoTombo.commit()
        
    cursorAntigo.close()
    cursorNovo.close()
    print("[DB_MYSQL] Migração concluída com sucesso")


    print("\n\n---- TOMBOS_IDENTIFICADORES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    tombos_identificadorData = bancoFirebird.getConteudoTabelaFirebird("tombo", "SELECT hcf, tombo_identificador FROM tombo")
    print("[DB_MYSQL] Migrando dados para tabela: tombos_identificadores")

    sql_insert = ("INSERT INTO tombos_identificadores "
                  "(identificador_id, tombo_hcf, ordem) "
                  "VALUES (%s, %s, %s)")

    sql_get_nome_identificador_antigo = ("SELECT nome FROM identificador WHERE num_identificador = ?")
    sql_get_identificador_novo = ("SELECT id FROM identificadores WHERE LOWER(TRIM(nome)) = %s")

    conexaoIdentificadorTombo = conexaoNova.getConexao()
    conexaoIdentificadorTomboAntigo = conexaoFirebird.getConexao()
    cursorNova = conexaoIdentificadorTombo.cursor()
    cursorAntiga = conexaoIdentificadorTomboAntigo.cursor()

    for tombo in tombos_identificadorData:
        hcf = tombo["hcf"]
        identificador_antigo_id = tombo["tombo_identificador"]

        cursorAntiga.execute(sql_get_nome_identificador_antigo, (identificador_antigo_id,))
        result = cursorAntiga.fetchone()
        if not result:
            continue

        nomes_brutos = result[0]
        nomes_identificadores = re.split(r'[&;,]| e ', nomes_brutos)

        for ordem, nome in enumerate(nomes_identificadores, 1):
            nome_normalizado = normalizar_nome(nome)
            if not nome_normalizado:
                continue

            cursorNova.execute(sql_get_identificador_novo, (nome_normalizado,))
            id_novo_result = cursorNova.fetchone()
            if id_novo_result:
                identificador_id_novo = id_novo_result[0]
                databaseNova.insertConteudoTabela("tombos_identificadores", sql_insert, (identificador_id_novo, hcf, ordem), conexaoIdentificadorTombo)
            else:
                print(f"[!] Identificador não encontrado para nome: '{nome_normalizado}' (HCF: {hcf})")

    print("[DB_MYSQL] Migração concluída com sucesso")


    print("\n\n---- TOMBO_FOTOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo_exsicata")
    tombos_fotosData = bancoFirebird.getConteudoTabelaFirebird(
        "tombo_exsicata",
        "SELECT num_tombo, sequencia, cod_barra, num_barra FROM tombo_exsicata"
    )
    print("[DB_MYSQL] Migrando dados para tabela: tombo_fotos")

    tombos_com_sequencia = set()
    for tombos_fotos in tombos_fotosData:
        if tombos_fotos["sequencia"] > 1:
            tombos_com_sequencia.add(tombos_fotos["num_tombo"])

    sql = ("INSERT INTO tombos_fotos "
           "(tombo_hcf, codigo_barra, num_barra, caminho_foto, em_vivo, sequencia, ativo) "
           "VALUES (%s, %s, %s, %s, %s, %s, %s)")

    conexaoTombos_fotos = conexaoNova.getConexao()
    verifyTomboCursor = conexaoTombos_fotos.cursor()

    for tombos_fotos in tombos_fotosData:
        num_tombo = tombos_fotos["num_tombo"]
        if num_tombo != 0:
            if num_tombo in tombos_com_sequencia:
                caminho_foto = f'{tombos_fotos["cod_barra"]}_{tombos_fotos["sequencia"]}.JPG'
            else:
                caminho_foto = f'{tombos_fotos["cod_barra"]}.JPG'

            commitTombos_fotosData = (
                num_tombo,
                tombos_fotos["cod_barra"],
                tombos_fotos["num_barra"],
                caminho_foto,
                1,
                tombos_fotos["sequencia"],
                1
            )
            
            verifyTomboCursor.execute("SELECT hcf FROM tombos WHERE hcf = %s", (num_tombo,))
            if verifyTomboCursor.fetchone() is None:
                print(f"Tombo com hcf {num_tombo} não encontrado na tabela 'tombos'. Inserção em 'tombos_fotos' não permitida.")
            else:
                databaseNova.insertConteudoTabela("tombos_fotos", sql, commitTombos_fotosData, conexaoTombos_fotos)

        else: 
            print(f"Tombo {num_tombo} não inserido, pois é zero.")
            print(f"Dados: {tombos_fotos}")
            
    print("[DB_MYSQL] Migração concluída com sucesso")

    print("\n\n---- TIPO_USUARIOS ... ----")
    print("[OTHER] Criando dados: tipo dos usuários")
    print("[DB_MYSQL] Inserindo dados para tabela: tipos_usuarios")
    sql = ("INSERT INTO tipos_usuarios "
           "(id, tipo) "
           "VALUES (%s, %s)")  

    conexaoTipos_usuarios = conexaoNova.getConexao()

    tipos = ["CURADOR", "OPERADOR", "IDENTIFICADOR"]

    for i, tipo in enumerate(tipos, start=1):
        databaseNova.insertConteudoTabela("tipos_usuarios", sql, (i, tipo), conexaoTipos_usuarios)
    print("[DB_MYSQL] Inserção concluída com sucesso")

    end_time = time.time()
    elapsed_time = (end_time - start_time)/60
    print(f"Tempo de execução: {elapsed_time:.2f} minutos")

    conexaoNova.closeConexao()
    conexaoFirebird.closeConexao()

if __name__ == "__main__":
    main()
