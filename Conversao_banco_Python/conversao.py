from __future__ import print_function
import csv
import re
import time
start_time = time.time()
import mysql.connector
from mysql.connector import errorcode
import fdb

latitudesErros, longitudesErros = list(), list()

class Conexao():
    def __init__(self):
        self.__conexao = ''
        self.__cursor = ''

    def conexaoNovoBanco(self, user, password, host):
        print("[CONN] Conectando ao banco MySQL")
        print("[CONN] Conexão realizada com sucesso")
        self.__conexao = mysql.connector.connect(user=user, password=password, host=host, port='3306')
        self.__cursor =  self.__conexao.cursor()

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
        self.__cursor =  self.__conexao.cursor()
    
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

    def getConteudoTabela(self, nome, sql):

        result = 'error'
        try:
            print("[INFO] Geting table content {}: ".format(nome), end='')
            self.__cursor.execute(sql)

            result = self.__cursor.fetchall()

        except mysql.connector.Error as err:
                result = err.msg
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

def getIniciaisAutores(nome) :
    iniciais = ""
    for i in range(0, len(nome)):
        if (nome[i] == '&'):
            iniciais += " & "
        elif (ord(nome[i]) >= 65 and ord(nome[i]) <= 90): # é maiusculo
            iniciais += nome[i] + "."
    return iniciais

def buscaCidadeId(listaCidade, listaEstados, listaPaises, cidadeAntiga):
    if(cidadeAntiga[5] == 'Brasil' or cidadeAntiga[5] == 'BR'):
        for cidade in listaCidade:
            if(cidade[1] == cidadeAntiga[3]):
                for estado in listaEstados:
                    if(cidade[2] == estado[0] and estado[2] == cidadeAntiga[4]):
                        return cidade[0]
    else:
        for pais in listaPaises:
            if(pais[1] == cidadeAntiga[5].upper()):
                for estado in listaEstados:
                    if(estado[3] == pais[0]):
                        return estado[0] * 100000

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
    
def convertLatitude(latitude, tombo = 0):
    if(not latitude):
        return None
    dadoReal = latitude
    latitude = padronizaCoordenada(latitude)
    # print(tombo)
    if '°' in latitude and "'" in latitude and '"' in latitude:
        latitudeSplit = []
        latitudeSplit.append(latitude.split('°')[0])
        latitudeSplit.append(latitude.split('°')[1].split("'")[0])
        latitudeSplit.append(latitude.split('°')[1].split("'")[1].split('"')[0])
        # # print(latitude.split('°')[1].split("'")[1].split('"'))
        latitudeSplit.append(latitude.split('°')[1].split("'")[1].split('"')[1].strip())
        # latitudeSplit.append(latitude.split('°')[1].split("'")[1].split('"')[0])
    else:
        latitudesErros.append(latitude)
        latitudesErros.append(dadoReal)
        print(f"Formato de latitude inesperado: {dadoReal}")
        return None
    
    try:
        latitudeConvertida = (float(latitudeSplit[0].replace(",","."))) + (float(latitudeSplit[1].replace(",","."))/60) + (float(latitudeSplit[2].replace(",","."))/3600)

        if(latitudeSplit[3] == 'S'):
            latitudeConvertida = latitudeConvertida * -1
    except ValueError:
        latitudesErros.append(latitude)
        latitudesErros.append(dadoReal)
        print(f"Erro ao converter a latitude: {tombo}: '{dadoReal}'. Verifique os valores.'. Verifique os valores.")
        return None

    return latitudeConvertida
    
def convertLongitude(longitude, tombo = 0):
    if(not longitude):
        return None
    dadoReal = longitude
    longitude = padronizaCoordenada(longitude)
    if '°' in longitude and "'" in longitude and '"' in longitude:
        longitudeSplit = []
        longitudeSplit.append(longitude.split('°')[0])
        longitudeSplit.append(longitude.split('°')[1].split("'")[0])
        longitudeSplit.append(longitude.split('°')[1].split("'")[1].split('"')[0])
        longitudeSplit.append(longitude.split('°')[1].split("'")[1].split('"')[1].strip())
    else:
        longitudesErros.append(longitude)
        longitudesErros.append(dadoReal)
        print(f"Formato de longitude inesperado: {tombo}: {dadoReal}")
        return None
    
    try:
        longitudeConvertida = (float(longitudeSplit[0].replace(",","."))) + (float(longitudeSplit[1].replace(",","."))/60) + (float(longitudeSplit[2].replace(",","."))/3600)

        if(longitudeSplit[3] == 'W'):
            longitudeConvertida = longitudeConvertida * -1

    except ValueError:
        longitudesErros.append(longitude)
        longitudesErros.append(dadoReal)
        print(f"Erro ao converter a longitude: {tombo}: '{dadoReal}'. Verifique os valores.")
        return None

    return longitudeConvertida
    
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
    with open('coordenadas.csv', newline='', encoding='ISO-8859-1') as csvfile:
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

def updateHerbariosFirebird(conexaoHerbariosAntiga, commitHerbariosDataAntiga, databaseAntiga):
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='UEC - Herbário do Instituto de Biologia da UNICAMP' WHERE codigo=20;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='CTES - Herbário del Instituto de Botânica del Nordeste, Corrientes, Argentina' WHERE codigo=49;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='CVRD - Herbário da Reserva Natural Vale' WHERE codigo=19;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='EVB - Herbário Evaldo Buturra (UNILA)' WHERE codigo=43;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='FLOR - Herbário da Universidade Federal de Santa Catarina ' WHERE codigo=18;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='FUEL - Herbário da Universidade Estadual de Londrina' WHERE codigo=11;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='G - Herbarium Genavense' WHERE codigo=16;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='HBR - Herbário Barbosa Rodrigues' WHERE codigo=54;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='HCF - Herbário da Universidade Tecnológica Federal do Paraná Campus Campo Mourão' WHERE codigo=2;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='IBGE - Herbário' WHERE codigo=3;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='HI - Herbário Integrado' WHERE codigo=5;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='HUEM - Herbário da Universidade Estadual de Maringá' WHERE codigo=21;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='ICN - Herbário da Universidade Federal do Rio Grande do Sul' WHERE codigo=10;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='MBM - Museu Botânico Municipal de Curitiba' WHERE codigo=1;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='MEXU - Herbario Nacional de Mexico' WHERE codigo=47;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='MO - Missouri Botanical Garden' WHERE codigo=52;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='RB - Herbário do Jardim Botânico do Rio de Janeiro' WHERE codigo=17;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='UNOP - Herbário da Universidade Estadual do Oeste do Paraná' WHERE codigo=14;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='UFPE - Laboratório Biologia de Briófitas' WHERE codigo=12;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='UNOP - Herbário da Universidade Estadual do Oeste do Paraná' WHERE codigo=13;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='UPCB - Herbário do Depto de Botânica da Universidade Federal do Paraná' WHERE codigo=4;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='VIC - Herbário da Universidade Federal de Viçosa' WHERE codigo=58;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='VIES - Herbário Central da Universidade Federal do Espírito Santo' WHERE codigo=44;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='INPA -  Herbário Instituto Nacional de Pesquisas da Amazônia' WHERE codigo=6;"
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    

def buildTables(arquivoSql):
    # Lê o arquivo .sql de criação de tabelas em SQL
    tabelas = {}
    with open(arquivoSql, 'r', encoding='utf-8') as f:
        sqlContent = f.read()
    
    # Expressão regular para capturar blocos de CREATE TABLE
    matches = re.findall(r'CREATE TABLE `(\w+)` \((.*?)\) ENGINE=.*?;', sqlContent, re.S)
    
    for nome, estrutura in matches:
        tabelas[nome] = f"CREATE TABLE `{nome}` ({estrutura}) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;"
    
    return tabelas

def importarSql():
    arquivoSql = 'BuildTabelas.sql'

    return buildTables(arquivoSql)

def main():
    conexaoFirebird = Conexao()
    conexaoFirebird.conexaoBancoFirebird('/firebird/data/HERBARIUM.GDB', 'SYSDBA', 'masterkey', True)
    conexaoNova = Conexao()
    conexaoNova.conexaoNovoBanco('root', 'Test@123', 'my-mysql') # nickname, password

    TABLES = importarSql()

    databaseNova = Database("hcf", conexaoNova.getCursor())  #nome da nova base de dados

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

    print("\n\n---- COLETORES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: coletor")
    coletorData = bancoFirebird.getConteudoTabela("coletor", "SELECT num_coletor, nome_coletor FROM coletor")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    coletorNumero = bancoFirebird.getConteudoTabela("tombo", "SELECT tombo_coletor, max(num_coleta) FROM tombo GROUP BY tombo_coletor;")
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
        for numero in coletorNumero:
            if(numero[0] == coletor[0]):
                cursor.execute(sql_select, (coletor[1],))
                resultado = cursor.fetchone()
                cursor.fetchall()
                if resultado is None:
                    idColetor = coletor[0]
                    commitColetorData = (idColetor, coletor[1], None, numero[1], 1)
                    databaseNova.insertConteudoTabela("coletores", sql, commitColetorData, conexaoColetor )
    cursor.close()
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- RELEVOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: relevo")
    relevosData = bancoFirebird.getConteudoTabela("relevo", "SELECT cod_relevo, tp_relevo FROM relevo")
    print("[DB_MYSQL] Migrando dados para tabela: relevos")
    commitRelevosData = ()
    sql = ("INSERT INTO relevos "
        "(id, nome) "
        "VALUES (%s, %s)")
    
    conexaoRelevos = conexaoNova.getConexao()
    for relevos in relevosData:
        commitRelevosData = (relevos[0], relevos[1])
        databaseNova.insertConteudoTabela("relevos", sql, commitRelevosData, conexaoRelevos)
    print("[DB_MYSQL] Migração concluída com sucesso")


    
    print("\n\n---- SOLOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: solo")
    solosData = bancoFirebird.getConteudoTabela("solo", "SELECT cod_solo, tp_solo  FROM solo")
    print("[DB_MYSQL] Migrando dados para tabela: solos")
    commitSolosData = ()
    sql = ("INSERT INTO solos "
        "(id, nome) "
        "VALUES (%s, %s)")
    
    conexaoSolos = conexaoNova.getConexao()
    for solos in solosData:
        commitSolosData = (solos[0], solos[1])
        databaseNova.insertConteudoTabela("solos", sql, commitSolosData, conexaoSolos)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- VEGETACOES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: vegetacao")
    vegetacoesData = bancoFirebird.getConteudoTabela("vegetacao", "SELECT cod_vegetacao, tp_vegetacao FROM vegetacao")
    print("[DB_MYSQL] Migrando dados para tabela: vegetacoes")
    commitVegetacoesData = ()
    sql = ("INSERT INTO vegetacoes "
        "(id, nome) "
        "VALUES (%s, %s)")
    
    conexaoVegetacoes = conexaoNova.getConexao()
    for vegetacoes in vegetacoesData:
        commitVegetacoesData = (vegetacoes[0], vegetacoes[1])
        databaseNova.insertConteudoTabela("vegetacoes", sql, commitVegetacoesData, conexaoVegetacoes)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- FASE_SUCESSIONAL ... ----")
    print("[OTHER] Criando dados: fase_sucessional")
    fase_sucessionalData = [(1, '1º fase sucessão vegetal'), (2, '2º fase sucessão vegetal'), (3, '3º fase ou capoeirinhia'), (4, '4º fase capoeira'), (5, '5º fase capoeirão'), (6, '6º fase floresta secundária')]
    print("[DB_MYSQL] Inserindo dados para tabela: fase_sucessional")
    commitFase_sucessionalData = ()
    sql = ("INSERT INTO fase_sucessional "
        "(numero, nome) "
        "VALUES (%s, %s)")
    
    conexaoFase_sucessional = conexaoNova.getConexao()
    for fase_sucessional in fase_sucessionalData:
        commitFase_sucessionalData = (fase_sucessional[0], fase_sucessional[1])
        databaseNova.insertConteudoTabela("fase_sucessional", sql, commitFase_sucessionalData, conexaoFase_sucessional)
    print("[DB_MYSQL] Inserção concluída com sucesso")



    print("\n\n---- PAISES ... ----")
    print("[OTHER] Criando dados: países")
    paisesData = ''
    with open('paises.csv', newline='', encoding="utf8") as csvfile:
        csvReader = csv.reader(csvfile, delimiter = ';')
        next(csvReader)
        paisesData = list(csvReader)
    print("[DB_MYSQL] Inserindo dados para tabela: paises")
    commitPaisesData = ()
    sql = ("INSERT INTO paises "
        "(id, nome, sigla) "
        "VALUES (%s, %s, %s)")
    
    conexaoPaises = conexaoNova.getConexao()
    for pais in paisesData:
        commitPaisesData = (pais[0], pais[2], pais[1])
        databaseNova.insertConteudoTabela("paises", sql, commitPaisesData, conexaoPaises)
    print("[DB_MYSQL] Inserção concluída com sucesso")



    print("\n\n---- ESTADOS ... ----")
    print("[OTHER] Criando dados: estados")
    estadosData = ''
    with open('estados.csv', newline='', encoding="utf8") as csvfile:
        csvReader = csv.reader(csvfile, delimiter = ';')
        next(csvReader)
        estadosData = list(csvReader)
    print("[DB_MYSQL] Inserindo dados para tabela: estados")
    commitEstadosData = ()
    sql = ("INSERT INTO estados "
        "(id, nome, sigla, codigo_telefone, pais_id) "
        "VALUES (%s, %s, %s, %s, %s)")
    
    conexaoEstados = conexaoNova.getConexao()
    for estado in estadosData:
        commitEstadosData = (estado[0], estado[2], estado[1], None, estado[3])
        databaseNova.insertConteudoTabela("estados", sql, commitEstadosData, conexaoEstados )
    print("[DB_MYSQL] Inserção concluída com sucesso")



    print("\n\n---- CIDADES ... ----")
    print("[OTHER] Criando dados: cidades")
    cidadesData = ''
    with open('municipios.csv', newline='', encoding='UTF-8') as csvfile:
        csvReader = csv.reader(csvfile, delimiter=';')
        next(csvReader)
        cidadesData = list(csvReader)
    print("[DB_MYSQL] Inserindo dados para tabela: cidades")
    commitCidadesData = ()
    sql = ("INSERT INTO cidades "
        "(id, estado_id, nome, latitude, longitude) "
        "VALUES (%s, %s, %s, %s, %s)")

    conexaoCidades = conexaoNova.getConexao()
    for cidade in cidadesData:
        city_name = cidade[1]
        state_id = cidade[2]
        
        state_name = get_state_name_by_id(conexaoCidades, state_id)
        latitude, longitude = get_coordinates_from_city(city_name, state_name)

        commitCidadesData = (cidade[0], cidade[2], city_name, latitude, longitude)
        databaseNova.insertConteudoTabela("cidades", sql, commitCidadesData, conexaoCidades)
    print("[DB_MYSQL] Inserção concluída com sucesso")



    print("\n\n---- CORRECAO LON - LAT CIDADES ... ----")
    print("[DB_MYSQL] Corrigindo latitudes e longitudes das cidades")
    conexaoSql = conexaoNova.getConexao()
    cursorNova = conexaoSql.cursor()

    with open('updated_cities_coordinates.sql', 'r') as sql_file:
        sql_queries = sql_file.read()

    for query in sql_queries.split(';'):
        if query.strip():
            cursorNova.execute(query)

    conexaoSql.commit()
    print("[DB_MYSQL] Correção concluída com sucesso")



    print("\n\n---- LOCAIS_COLETA ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: local_coleta")
    locais_coletaData = bancoFirebird.getConteudoTabela("local_coleta", "SELECT codigo, local, regiao_do_local, cidade, estado, pais FROM local_coleta")
    print("[DB_MYSQL] Migrando dados para tabela: locais_coleta")
    commitLocais_coletaData = ()
    sql = ("INSERT INTO locais_coleta "
        "(id, descricao, cidade_id, fase_sucessional_id, complemento, fase_numero) "
        "VALUES (%s, %s, %s, %s, %s, %s)")

    cidadeLista = databaseNova.getConteudoTabela("cidades", "select id, nome, estado_id from cidades")

    estadoLista = databaseNova.getConteudoTabela("estado", "select id, nome, sigla, pais_id from estados")

    paisLista = databaseNova.getConteudoTabela("pais", "select id, nome, sigla from paises")

    conexaoLocais_coleta = conexaoNova.getConexao()
    for locais_coleta in locais_coletaData:
        cidadeId = buscaCidadeId(cidadeLista, estadoLista, paisLista, locais_coleta)
        commitLocais_coletaData = (locais_coleta[0], (locais_coleta[1] if locais_coleta[1] else "") + (locais_coleta[2] if locais_coleta[2] else ""), cidadeId, None, None, None)
        databaseNova.insertConteudoTabela("locais_coleta", sql, commitLocais_coletaData, conexaoLocais_coleta)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- FAMILIAS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: familia")
    familiasData = bancoFirebird.getConteudoTabela("familia", "SELECT cod_familia, familia FROM familia")
    print("[DB_MYSQL] Migrando dados para tabela: familias")
    commitFamiliasData = ()
    sql = ("INSERT INTO familias "
        "(id, nome, ativo) "
        "VALUES (%s, %s, %s)")  
    
    conexaoFamilias = conexaoNova.getConexao()
    for familias in familiasData:
        commitFamiliasData = (familias[0], familias[1], 1)
        databaseNova.insertConteudoTabela("familias", sql, commitFamiliasData, conexaoFamilias)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- GENEROS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    generosData = bancoFirebird.getConteudoTabela("especie", "SELECT especie, cd_familia FROM especie")
    print("[DB_MYSQL] Migrando dados para tabela: generos")
    commitgenerosData = ()
    sql = ("INSERT INTO generos "
        "(id, nome, familia_id, ativo) "
        "VALUES (%s, %s, %s, %s)")  
    
    conexaogeneros = conexaoNova.getConexao()
    id = 0
    for generos in generosData:
        id += 1
        commitgenerosData = (id, generos[0], generos[1], 1)
        databaseNova.insertConteudoTabela("generos", sql, commitgenerosData, conexaogeneros )
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- AUTORES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    autoresData = bancoFirebird.getConteudoTabela("tombo", "SELECT distinct especie_especie_autor FROM tombo union SELECT distinct especie_subspecie_autor FROM tombo union SELECT distinct especie_variedade_autor FROM tombo")
    print("[DB_MYSQL] Migrando dados para tabela: autores")
    nomePadronizado = list()
    for autor in autoresData:
        if(autor[0]):
            nomePadronizado.append(padronizaNomeAutor(autor[0]))

    nomePadronizado = list(set(nomePadronizado))

    nomePadronizado = unique(nomePadronizado)
    sql_select = "SELECT nome FROM autores WHERE nome = %s"
    sql_insert = ("INSERT INTO autores "
        "(id, nome, iniciais, ativo) "
        "VALUES (%s, %s, %s, %s)")  

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
    tomboData = bancoFirebird.getConteudoTabela("tombo", "SELECT distinct especie_especie_2 as especie, especie_especie_autor as autor_especie, codigo_familia, codigo_especie FROM tombo")
    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    especieData = bancoFirebird.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")
    print("[DB_MYSQL] Obtendo dados da tabela: autores")
    autorData = databaseNova.getConteudoTabela("autor", "SELECT id, nome FROM autores")
    print("[DB_MYSQL] Obtendo dados da tabela: generos")
    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")
    print("[DB_MYSQL] Migrando dados para tabela: especies")
    commitEspeciesData = ()
    sql = ("INSERT INTO especies "
        "(nome, autor_id, genero_id, familia_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s)")  
    
    conexaoEspecies = conexaoNova.getConexao()
    #id = 0
    for tombo in tomboData:
        if(tombo[0]):
            #id += 1
            if(tombo[1]): # insere quando especie tem um autor
                for autor in autorData:
                    if(autor[1] == padronizaNomeAutor(tombo[1])): #verifica se o nome do autor bate com o do tombo
                        for especie in especieData:
                            if(especie[0] == tombo[2] and especie[1] == tombo[3]): #procura o nome do genero na tabela especie
                                for genero in generoData: #procura o id do genero com o nome encontrado
                                    if(especie[2] == genero[1]):
                                        commitEspeciesData = (tombo[0], autor[0], genero[0], tombo[2], 1)
                                        databaseNova.insertConteudoTabela("especies", sql, commitEspeciesData, conexaoEspecies )
            else: #insere quando especie nao tem um autor
                for especie in especieData:
                    if(especie[0] == tombo[2] and especie[1] == tombo[3]): #procura o nome do genero na tabela especie
                        for genero in generoData: #procura o id do genero com o nome encontrado
                            if(especie[2] == genero[1]):
                                commitEspeciesData = (tombo[0], None, genero[0], tombo[2], 1)
                                databaseNova.insertConteudoTabela("especies", sql, commitEspeciesData, conexaoEspecies )
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- VARIEDADES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    tomboData = bancoFirebird.getConteudoTabela("tombo", "SELECT distinct especie_variedade as variedade, especie_variedade_autor as variedade_autor, codigo_familia, codigo_especie, especie_especie_2 FROM tombo")
    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    especieData = bancoFirebird.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")
    print("[DB_MYSQL] Obtendo dados da tabela: autores")
    autorData = databaseNova.getConteudoTabela("autor", "SELECT id, nome FROM autores")
    print("[DB_MYSQL] Obtendo dados da tabela: generos")
    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")
    print("[DB_MYSQL] Obtendo dados da tabela: especies")
    especiesData = databaseNova.getConteudoTabela("especies", "SELECT id, nome FROM especies")
    print("[DB_MYSQL] Migrando dados para tabela: variedades")
    commitEspeciesData = ()
    sql = ("INSERT INTO variedades "
        "(nome, autor_id, especie_id, genero_id, familia_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s)")  
    
    conexaoEspecies = conexaoNova.getConexao()
    #id = 0
    for tombo in tomboData:
        if(tombo[0]):
            #id += 1
            if(tombo[1]): # insere quando variedade tem um autor
                for autor in autorData:                
                    if(autor[1] == padronizaNomeAutor(tombo[1])): #verifica se o nome do autor bate com o do tombo
                        for especieNova in especiesData:
                            if(especieNova[1] == tombo[4]): # procura id da especie gerado
                                for especie in especieData: 
                                    if(especie[0] == tombo[2] and especie[1] == tombo[3]): #procura o nome do genero na tabela especie
                                        for genero in generoData: #procura o id do genero com o nome encontrado
                                            if(especie[2] == genero[1]):
                                                commitEspeciesData = (tombo[0], autor[0], especieNova[0], genero[0], tombo[2], 1)
                                                databaseNova.insertConteudoTabela("variedades", sql, commitEspeciesData, conexaoEspecies )
            else: # insere quando variedade nao tem um autor
                for especieNova in especiesData:
                    if(especieNova[1] == tombo[4]): # procura id da especie gerado
                        for especie in especieData: 
                            if(especie[0] == tombo[2] and especie[1] == tombo[3]): #procura o nome do genero na tabela especie
                                for genero in generoData: #procura o id do genero com o nome encontrado
                                    if(especie[2] == genero[1]):
                                        commitEspeciesData = (tombo[0], None, especieNova[0], genero[0], tombo[2], 1)
                                        databaseNova.insertConteudoTabela("variedades", sql, commitEspeciesData, conexaoEspecies )
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- SUB_ESPECIES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    tomboData = bancoFirebird.getConteudoTabela("tombo", "SELECT distinct especie_subspecie as subEspecie, especie_subspecie_autor as autor_subEspecie, codigo_familia, codigo_especie, especie_especie_2 FROM tombo")
    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    especieData = bancoFirebird.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")
    print("[DB_MYSQL] Obtendo dados da tabela: autores")
    autorData = databaseNova.getConteudoTabela("autor", "SELECT id, nome FROM autores")
    print("[DB_MYSQL] Obtendo dados da tabela: generos")
    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")
    print("[DB_MYSQL] Obtendo dados da tabela: especies")
    especiesData = databaseNova.getConteudoTabela("especies", "SELECT id, nome FROM especies")
    print("[DB_MYSQL] Migrando dados para tabela: sub_especies")
    commitSubEspeciesData = ()
    sql = ("INSERT INTO sub_especies "
        "(nome, especie_id, genero_id, familia_id, autor_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s)")  
    
    conexaoSub_especies = conexaoNova.getConexao()
    #id = 0
    for tombo in tomboData:
        if(tombo[0]):
            #id += 1
            if(tombo[1]): # insere quando subEspecie tem um autor
                for autor in autorData:
                    if(autor[1] == padronizaNomeAutor(tombo[1])): #verifica se o nome do autor bate com o do tombo
                        for especieNova in especiesData:
                            if(especieNova[1] == tombo[4]): # procura id da especie gerado
                                for especie in especieData:
                                    if(especie[0] == tombo[2] and especie[1] == tombo[3]): #procura o nome do genero na tabela especie
                                        for genero in generoData: #procura o id do genero com o nome encontrado
                                            if(especie[2] == genero[1]):
                                                commitSubEspeciesData = (tombo[0], especieNova[0], genero[0],  tombo[2], autor[0], 1)
                                                databaseNova.insertConteudoTabela("sub_especies", sql, commitSubEspeciesData, conexaoSub_especies )
            else: #insere quando especie nao tem um autor
                for especieNova in especiesData:
                    if(especieNova[1] == tombo[4]): # procura id da especie gerado
                        for especie in especieData:
                            if(especie[0] == tombo[2] and especie[1] == tombo[3]): #procura o nome do genero na tabela especie
                                for genero in generoData: #procura o id do genero com o nome encontrado
                                    if(especie[2] == genero[1]):
                                        commitSubEspeciesData = (tombo[0], especieNova[0], genero[0],  tombo[2], None, 1)
                                        databaseNova.insertConteudoTabela("sub_especies", sql, commitSubEspeciesData, conexaoSub_especies )
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- SUB_FAMILIAS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: subfamilia")
    subFamiliaData = bancoFirebird.getConteudoTabela("subfamilia", "SELECT cd_familiasub, subfamilia FROM subfamilia")
    print("[DB_MYSQL] Migrando dados para tabela: sub_familias")
    commitSubFamiliasData = ()
    sql = ("INSERT INTO sub_familias "
        "(id, nome, familia_id, autor_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s)")  
    
    conexaoSub_familias = conexaoNova.getConexao()
    id = 0
    for subFamilia in subFamiliaData:
        id += 1
        commitSubFamiliasData = (id, subFamilia[1], subFamilia[0], None, 1)
        databaseNova.insertConteudoTabela("sub_familias", sql, commitSubFamiliasData, conexaoSub_familias )
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- HERBARIOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: instituicao_identificadora")
    conexaoHerbariosAntiga = conexaoFirebird.getConexao()
    commitHerbariosDataAntiga = ()

    updateHerbariosFirebird(conexaoHerbariosAntiga, commitHerbariosDataAntiga, bancoFirebird)
    herbariosData = bancoFirebird.getConteudoTabela("instituicao_identificadora", "SELECT codigo, nome_instituicao FROM instituicao_identificadora")
    print("[DB_MYSQL] Migrando dados para tabela: herbarios")
    commitHerbariosData = ()
    sql = ("INSERT INTO herbarios "
        "(id, nome, caminho_logotipo, sigla, email, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s)")  
    
    conexaoHerbarios = conexaoNova.getConexao()
    for herbarios in herbariosData:
        nome = herbarios[1].replace(" - ","-", 1)
        nomeSplit = nome.split('-', 1)
        if(len(nomeSplit) > 1):
            commitHerbariosData = (herbarios[0], nomeSplit[1], None, nomeSplit[0], None, 1)
            databaseNova.insertConteudoTabela("herbarios", sql, commitHerbariosData, conexaoHerbarios )
        else:
            commitHerbariosData = (herbarios[0], nomeSplit[0], None, None, None, 1)
            databaseNova.insertConteudoTabela("herbarios", sql, commitHerbariosData, conexaoHerbarios )
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- TIPOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tipo")
    tipoData = bancoFirebird.getConteudoTabela("tipo", "SELECT cod_tipo, tp_descricao FROM tipo")
    print("[DB_MYSQL] Migrando dados para tabela: tipos")
    commitTipoData = ()
    sql = ("INSERT INTO tipos "
        "(id, nome) "
        "VALUES (%s, %s)")  
    
    conexaoTipo = conexaoNova.getConexao()
    for tipo in tipoData:
        commitTipoData = (tipo[0], tipo[1])
        databaseNova.insertConteudoTabela("herbarios", sql, commitTipoData, conexaoTipo )
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- IDENTIFICADORES ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: identificador")
    identificadorData = bancoFirebird.getConteudoTabela("identificador", "SELECT nome FROM identificador")
    print("[DB_MYSQL] Migrando dados para tabela: identificadores")
    sql = ("INSERT INTO identificadores "
        "(nome) "
        "VALUES (%s)")

    sql_check = ("SELECT COUNT(*) FROM identificadores WHERE nome = %s")

    conexaoIdentificador = conexaoNova.getConexao()
    cursor = conexaoIdentificador.cursor()

    for identificadores in identificadorData:
        identificadorSplit = re.split(r'[&;,]', identificadores[0])
        for identificador in identificadorSplit:
            identificador = identificador.strip()  # Remove os espaços em branco
            cursor.execute(sql_check, (identificador,))
            if cursor.fetchone()[0] == 0:  # Se não existir o identificador
                commitIdentificadorData = (identificador, )
                databaseNova.insertConteudoTabela("identificador", sql, commitIdentificadorData, conexaoIdentificador)
    # cursor close
    cursor.close()
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- TOMBOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo")
    tombosData = bancoFirebird.getConteudoTabela("tombo", "SELECT hcf, data_tombo, data_coleta, observacao, nomes_populares, num_coleta, latitude, longitude, altitude, tombo_instituicao, local_coleta, especie_variedade, tipo, especie_especie_2, codigo_familia, codigo_especie, tombo_familia_sub, especie_subspecie, nome_especie, vermelho, verde, azul, codigo_solo, codigo_relevo, codigo_vegetacao, data_identificacao, tombo_coletor FROM tombo")
    print("[DB_MYSQL] Obtendo dados da tabela: variedades")
    variedadesData = databaseNova.getConteudoTabela("variedades", "SELECT id, nome FROM variedades")
    print("[DB_MYSQL] Obtendo dados da tabela: especies")
    especiesData = databaseNova.getConteudoTabela("especies", "SELECT id, nome FROM especies")
    print("[DB_FIREBIRD] Obtendo dados da tabela: especie")
    especieData = bancoFirebird.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")
    print("[DB_MYSQL] Obtendo dados da tabela: generos")
    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")
    print("[DB_MYSQL] Obtendo dados da tabela: sub_familias")
    sub_familiasData = databaseNova.getConteudoTabela("sub_familias", "SELECT id, nome FROM sub_familias")
    print("[DB_MYSQL] Obtendo dados da tabela: sub_especies")
    sub_especiesData = databaseNova.getConteudoTabela("sub_especies", "SELECT id, nome FROM sub_especies")
    print("[DB_MYSQL] Migrando dados para tabela: tombos")
    commitTombosData = ()
    sql = ("INSERT INTO tombos "
       "(hcf, data_tombo, data_coleta_dia, observacao, nomes_populares, numero_coleta, latitude, longitude, "
       "altitude, entidade_id, local_coleta_id, variedade_id, tipo_id, data_identificacao_dia, data_identificacao_mes, data_identificacao_ano, situacao, especie_id, genero_id, "
       "familia_id, sub_familia_id, sub_especie_id, nome_cientifico, colecao_anexa_id, cor, data_coleta_mes, "
       "data_coleta_ano, solo_id, relevo_id, vegetacao_id, ativo, taxon, rascunho, coletor_id) "
       "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")
    
    # Conexão com a base nova
    conexaoTombo = conexaoNova.getConexao()
    cursorNovo = conexaoTombo.cursor()

    # Conexão com a base antiga
    conexaoAntigaTombo = conexaoFirebird.getConexao()
    cursorAntigo = conexaoAntigaTombo.cursor()

    coletor_id_map = {}

    # Consulta para obter o nome do coletor na base antiga
    sql_nome_coletor_antiga = "SELECT nome_coletor FROM coletor WHERE num_coletor = ?"

    # Consulta para verificar a existência do coletor na base nova e obter o id
    sql_id_coletor_nova = "SELECT id FROM coletores WHERE nome = %s"
    
    for tombo in tombosData:
        dataSplit = str(tombo[2]).split('-')  #separa a data do tombo em 3 campos de ano/mes/dia
        if(dataSplit == None or dataSplit == ['None']):
            dataSplit = [None, None, None]
        
        #selecionar especie junto com variedade
        variedadeFinal = None #procura uma nova variedade caso haja alguma
        if(tombo[11]):
            for variedade in variedadesData:
                if(variedade[1] == tombo[11]):
                    variedadeFinal = variedade[0]

        especieFinal = None
        if(tombo[13]):
            for especie in especiesData:
                if(especie[1] == tombo[13]):
                    especieFinal = especie[0]

        generoFinal = None
        if(tombo[14] and tombo[15]):
            for especie in especieData:
                if(especie[0] == tombo[14] and especie[1] == tombo[15]): #procura o nome do genero na tabela especie
                    for genero in generoData: #procura o id do genero com o nome encontrado
                        if(especie[2] == genero[1]):
                            generoFinal = genero[0]

        sub_familiasFinal = None
        if(tombo[16]):
            for subFamilia in sub_familiasData:
                if(tombo[16] == subFamilia[1]):
                    sub_familiasFinal = subFamilia[0]

        sub_especiesFinal = None
        if(tombo[17]):
            for subEspecie in sub_especiesData:
                if(tombo[17] == subEspecie[1]):
                    sub_especiesFinal = subEspecie[0]

        corFinal = None
        if(tombo[19] == 1):
            corFinal = 1
        elif(tombo[20] == 1):
            corFinal = 2
        elif(tombo[21] == 1):
            corFinal = 3

        coletor_id = None
        if tombo[26]:
            tombo_coletor = tombo[26]

            if tombo_coletor in coletor_id_map:
                coletor_id = coletor_id_map[tombo_coletor]
            else:
                cursorAntigo.execute(sql_nome_coletor_antiga, (tombo_coletor,))
                nome_coletor = cursorAntigo.fetchone()
                if nome_coletor:
                    nome_coletor = nome_coletor[0]

                    cursorNovo.execute(sql_id_coletor_nova, (nome_coletor,))
                    resultado = cursorNovo.fetchone()
                    if resultado:
                        coletor_id = resultado[0]
                        coletor_id_map[tombo_coletor] = coletor_id

        dataIdentificacao = re.split(r'[-/,.]', str(tombo[25]))
        data_identificacao_dia, data_identificacao_mes, data_identificacao_ano = splitData(dataIdentificacao)

        commitTombosData = (tombo[0], tombo[1], dataSplit[2], tombo[3], tombo[4], tombo[5], convertLatitude(tombo[6], tombo[0]), convertLongitude(tombo[7], tombo[0]), converteAltitude(tombo[8]), tombo[9], tombo[10], variedadeFinal, tombo[12], data_identificacao_dia, data_identificacao_mes, data_identificacao_ano, 'REGULAR', especieFinal, generoFinal, tombo[14], sub_familiasFinal, sub_especiesFinal, tombo[18], None, corFinal, dataSplit[1], dataSplit[0], tombo[22], tombo[23], tombo[24], 1, None, 0, coletor_id)
        databaseNova.insertConteudoTabela("tombos", sql, commitTombosData, conexaoTombo, tombo[0], data_identificacao_dia, data_identificacao_mes, data_identificacao_ano)

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
    tombos_identificadorData = bancoFirebird.getConteudoTabela("tombo", "SELECT hcf, tombo_identificador FROM tombo")
    print("[DB_MYSQL] Migrando dados para tabela: tombos_identificadores")
    # SQL para inserção na nova tabela de relação
    sql_insert = ("INSERT INTO tombos_identificadores "
                "(identificador_id, tombo_hcf, ordem) "
                "VALUES (%s, %s, %s)")

    # SQL para buscar o nome do identificador na base antiga
    sql_get_nome_identificador_antigo = ("SELECT nome FROM identificador WHERE num_identificador = ?")

    # SQL para buscar o identificador_id pelo nome na base nova
    sql_get_identificador_novo = ("SELECT id FROM identificadores WHERE nome = %s")

    conexaoIdentificadorTombo = conexaoNova.getConexao()
    conexaoIdentificadorTomboAntigo = conexaoFirebird.getConexao()
    cursorNova = conexaoIdentificadorTombo.cursor()
    cursorAntiga = conexaoIdentificadorTomboAntigo.cursor()
    
    for tombo in tombos_identificadorData:
        hcf = tombo[0]
        identificador_antigo_id = tombo[1]

        cursorAntiga.execute(sql_get_nome_identificador_antigo, (identificador_antigo_id,))
        result = cursorAntiga.fetchone()
        if result:
            identificadores_nomes = re.split(r'[&;,]', result[0])
            
            for ordem, identificador_nome in enumerate(identificadores_nomes, 1):
                identificador_nome = identificador_nome.strip()

                cursorNova.execute(sql_get_identificador_novo, (identificador_nome,))
                identificador_id_novo = cursorNova.fetchone()[0]
                
                databaseNova.insertConteudoTabela("tombos_identificadores", sql_insert, (identificador_id_novo, hcf, ordem), conexaoIdentificadorTombo)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- TOMBO_FOTOS ... ----")
    print("[DB_FIREBIRD] Obtendo dados da tabela: tombo_exsicata")
    tombos_fotosData = bancoFirebird.getConteudoTabela("tombo_exsicata", "SELECT num_tombo, sequencia, cod_barra, num_barra FROM tombo_exsicata")
    print("[DB_MYSQL] Migrando dados para tabela: tombo_fotos")
    tombos_com_sequencia = set()
    for tombos_fotos in tombos_fotosData:
        if tombos_fotos[1] > 1:
            tombos_com_sequencia.add(tombos_fotos[0])

    commitTombos_fotosData = ()
    sql = ("INSERT INTO tombos_fotos "
        "(tombo_hcf, codigo_barra, num_barra, caminho_foto, em_vivo, sequencia, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s)")  

    conexaoTombos_fotos = conexaoNova.getConexao()

    for tombos_fotos in tombos_fotosData:
        if tombos_fotos[0] != 0:
            if tombos_fotos[0] in tombos_com_sequencia:
                caminho_foto = tombos_fotos[2] + "_" + str(tombos_fotos[1]) + ".JPG"
            else:
                caminho_foto = tombos_fotos[2] + ".JPG"

            commitTombos_fotosData = (tombos_fotos[0], tombos_fotos[2], tombos_fotos[3], caminho_foto, 1, tombos_fotos[1], 1)
            databaseNova.insertConteudoTabela("tombos_fotos", sql, commitTombos_fotosData, conexaoTombos_fotos)
    print("[DB_MYSQL] Migração concluída com sucesso")



    print("\n\n---- TIPO_USUARIOS ... ----")
    print("[OTHER] Criando dados: tipo dos usuários")
    print("[DB_MYSQL] Inserindo dados para tabela: tipos_usuarios")
    sql = ("INSERT INTO tipos_usuarios "
        "(id, tipo) "
        "VALUES (%s, %s)")  
    
    conexaoTipos_usuarios = conexaoNova.getConexao()
    
    tipos = ["CURADOR", "OPERADOR", "IDENTIFICADOR"]

    for i, tipo in enumerate(tipos, start = 1):
        databaseNova.insertConteudoTabela("tipos_usuarios", sql, (i, tipo), conexaoTipos_usuarios)
    print("[DB_MYSQL] Inserção concluída com sucesso")

    end_time = time.time()
    elapsed_time = (end_time - start_time)/60
    print(f"Tempo de execução: {elapsed_time:.2f} minutos")

    conexaoNova.closeConexao()
    conexaoFirebird.closeConexao()

if __name__ == "__main__":
    main()
