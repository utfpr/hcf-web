from __future__ import print_function
from datetime import date
import csv
import re
import time
start_time = time.time()
import mysql.connector
from mysql.connector import errorcode

import numpy as np

latitudesErros, longitudesErros = list(), list()

class Conexao():
    def __init__(self):
        self.__conexao = ''
        self.__cursor = ''

    def conexaoNovoBanco(self, user, password):
        self.__conexao = mysql.connector.connect(user=user, password=password)
        self.__cursor =  self.__conexao.cursor()
    
    def conexaoBancoExistente(self, user, password, banco):
        self.__conexao = mysql.connector.connect(user=user, password=password, database=banco)
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
            print("Creating table {}: ".format(nome), end='')
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
            print("Geting table content {}: ".format(nome), end='')
            self.__cursor.execute(sql)

            result = self.__cursor.fetchall()

        except mysql.connector.Error as err:
                result = err.msg
        else:
            print("OK")

        return result

    def insertConteudoTabela(self, nome, sql, conteudo, conexao):
        try:
            # # print("Inserting table content {}: ".format(nome), end='')
            self.__cursor.execute(sql, conteudo)
            conexao.commit()
        except mysql.connector.Error as err:
            print(err.msg)       
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
    
def convertLatitude(latitude):
    if(not latitude):
        return None
    dadoReal = latitude
    latitude = padronizaCoordenada(latitude)
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
        print(f"Formato de latitude inesperado: {latitude}")
        return None
    latitudeConvertida = (float(latitudeSplit[0].replace(",","."))) + (float(latitudeSplit[1].replace(",","."))/60) + (float(latitudeSplit[2].replace(",","."))/3600)

    if(latitudeSplit[3] == 'S'):
        latitudeConvertida = latitudeConvertida * -1

    return latitudeConvertida
    
def convertLongitude(longitude):
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
        print(f"Formato de longitude inesperado: {longitude}")
        return None
    
    longitudeConvertida = (float(longitudeSplit[0].replace(",","."))) + (float(longitudeSplit[1].replace(",","."))/60) + (float(longitudeSplit[2].replace(",","."))/3600)

    if(longitudeSplit[3] == 'W'):
        longitudeConvertida = longitudeConvertida * -1

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

def updateHerbariosFirebird(conexaoHerbariosAntiga, commitHerbariosDataAntiga, databaseAntiga):
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="UEC - Herbário do Instituto de Biologia da UNICAMP" WHERE codigo=20;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="CTES - Herbário del Instituto de Botânica del Nordeste, Corrientes, Argentina" WHERE codigo=49;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="CVRD - Herbário da Reserva Natural Vale" WHERE codigo=19;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="EVB - Herbário Evaldo Buturra (UNILA)" WHERE codigo=43;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="FLOR - Herbário da Universidade Federal de Santa Catarina " WHERE codigo=18;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="FUEL - Herbário da Universidade Estadual de Londrina" WHERE codigo=11;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="G - Herbarium Genavense" WHERE codigo=16;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="HBR - Herbário Barbosa Rodrigues" WHERE codigo=54;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="HCF - Herbário da Universidade Tecnológica Federal do Paraná Campus Campo Mourão" WHERE codigo=2;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="IBGE - Herbário" WHERE codigo=3;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="HI - Herbário Integrado" WHERE codigo=5;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="HUEM - Herbário da Universidade Estadual de Maringá" WHERE codigo=21;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="ICN - Herbário da Universidade Federal do Rio Grande do Sul" WHERE codigo=10;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="MBM - Museu Botânico Municipal de Curitiba" WHERE codigo=1;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="MEXU - Herbario Nacional de Mexico" WHERE codigo=47;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="MO - Missouri Botanical Garden" WHERE codigo=52;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="RB - Herbário do Jardim Botânico do Rio de Janeiro" WHERE codigo=17;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="UNOP - Herbário da Universidade Estadual do Oeste do Paraná" WHERE codigo=14;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="UFPE - Laboratório Biologia de Briófitas" WHERE codigo=12;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="UNOP - Herbário da Universidade Estadual do Oeste do Paraná" WHERE codigo=13;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="UPCB - Herbário do Depto de Botânica da Universidade Federal do Paraná" WHERE codigo=4;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="VIC - Herbário da Universidade Federal de Viçosa" WHERE codigo=58;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="VIES - Herbário Central da Universidade Federal do Espírito Santo" WHERE codigo=44;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = 'UPDATE instituicao_identificadora SET nome_instituicao="INPA -  Herbário Instituto Nacional de Pesquisas da Amazônia" WHERE codigo=6;'
    databaseAntiga.insertConteudoTabela('Update Herbarios Antigos', sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    
def main():
    conexaoNova = Conexao()
    conexaoNova.conexaoNovoBanco('root', 'root') # nickname, password
    conexaoAntiga = Conexao()
    conexaoAntiga.conexaoBancoExistente('root', 'root', 'hcffirebird') # nickname, password, nome da base de dados em mysql que foi migrada do firebird

    TABLES = {}

    TABLES['historico_acessos'] = (
        "CREATE TABLE `historico_acessos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`data_criacao` datetime NOT NULL,"
        "`usuario_id` int NOT NULL,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['configuracao'] = (
        "CREATE TABLE `configuracao` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`hora_inicio` varchar(19) NOT NULL,"
        "`hora_fim` varchar(19) DEFAULT NULL,"
        "`periodicidade` enum('MANUAL','SEMANAL','1MES','2MESES') DEFAULT NULL,"
        "`data_proxima_atualizacao` varchar(10) DEFAULT NULL,"
        "`nome_arquivo` varchar(50) DEFAULT NULL,"
        "`servico` enum('REFLORA','SPECIESLINK') DEFAULT NULL,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=latin1;")

    TABLES['coletores'] = (
        "CREATE TABLE `coletores` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(255) NOT NULL,"
        "`email` varchar(200) DEFAULT NULL,"
        "`numero` int DEFAULT NULL,"
        "`data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['relevos'] = (
        "CREATE TABLE `relevos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(300) NOT NULL,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['solos'] = (
        "CREATE TABLE `solos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(300) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['vegetacoes'] = (
        "CREATE TABLE `vegetacoes` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(300) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['fase_sucessional'] = (
        "CREATE TABLE `fase_sucessional` ("
        "`numero` int NOT NULL,"
        "`nome` varchar(200) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`numero`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['paises'] = (
        "CREATE TABLE `paises` ("
        "`id` smallint unsigned NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(255) NOT NULL,"
        "`sigla` char(4) DEFAULT NULL,"
        "`created_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=latin1;")

    TABLES['estados'] = (
        "CREATE TABLE `estados` ("
        "`id` int unsigned NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,"
        "`sigla` char(4) DEFAULT NULL,"
        "`codigo_telefone` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,"
        "`pais_id` smallint unsigned NOT NULL,"
        "`created_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`),"
        "KEY `pais_nome` (`pais_id`,`nome`),"
        "CONSTRAINT `fk_estados_paises` FOREIGN KEY (`pais_id`) REFERENCES `paises` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;")

    TABLES['cidades'] = (
        "CREATE TABLE `cidades` ("
        "`id` int unsigned NOT NULL AUTO_INCREMENT,"  
        "`estado_id` int unsigned NOT NULL,"  
        "`nome` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,"
        "`created_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)," 
        "KEY `fk_cidades_estado_idx` (`estado_id`),"  
        "KEY `pais_estado_nome` (`estado_id`,`nome`),"
        "CONSTRAINT `fk_cidades_estados` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`)"   
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;")

    #falta update de locais coleta 
    TABLES['locais_coleta'] = ( ###foi alterado
        "CREATE TABLE `locais_coleta` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`descricao` text,"
        "`cidade_id` int unsigned DEFAULT NULL,"
        "`fase_sucessional_id` int DEFAULT NULL,"
        "`complemento` text,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`fase_numero` int DEFAULT NULL,"
        "PRIMARY KEY (`id`),"
        "KEY `fk_locais_coleta_fase_sucessional1_idx` (`fase_sucessional_id`),"
        "KEY `fk_locais_coleta_cidades_idx` (`cidade_id`),"
        "KEY `FK_99i0itontmoklfxmoo8armtnv` (`fase_numero`),"
        "CONSTRAINT `FK_99i0itontmoklfxmoo8armtnv` FOREIGN KEY (`fase_numero`) REFERENCES `fase_sucessional` (`numero`),"
        "CONSTRAINT `fk_locais_coleta_cidades` FOREIGN KEY (`cidade_id`) REFERENCES `cidades` (`id`),"
        "CONSTRAINT `fk_locais_coleta_fase_sucessional1` FOREIGN KEY (`fase_sucessional_id`) REFERENCES `fase_sucessional` (`numero`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['familias'] = (
        "CREATE TABLE `familias` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint(1) DEFAULT '1',"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['generos'] = (  ###foi alterada
        "CREATE TABLE `generos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`familia_id` int NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`),"
        "KEY `fk_generos_familias1_idx` (`familia_id`),"
        "CONSTRAINT `fk_generos_familias1` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['autores'] = (
        "CREATE TABLE `autores` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`iniciais` varchar(200) DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint(1) DEFAULT '1',"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['especies'] = ( ###foi alterada
        "CREATE TABLE `especies` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`autor_id` int DEFAULT NULL,"
        "`genero_id` int,"
        "`familia_id` int NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`),"
        "KEY `fk_ESPECIE_AUTOR1_idx` (`autor_id`),"
        "KEY `fk_especies_generos1_idx` (`genero_id`),"
        "KEY `FK_l5yo4hb1gc053dkth7vveaadt` (`familia_id`),"
        "CONSTRAINT `fk_ESPECIE_AUTOR1` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),"
        "CONSTRAINT `fk_especies_generos1` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),"
        "CONSTRAINT `FK_l5yo4hb1gc053dkth7vveaadt` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`),"
        "CONSTRAINT `FK_rygol8x4wtm3bduaj1wjp6ses` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['variedades'] = ( ###foi alterada
        "CREATE TABLE `variedades` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`autor_id` int DEFAULT NULL,"
        "`especie_id` int NOT NULL,"
        "`genero_id` int,"
        "`familia_id` int NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`),"
        "KEY `fk_VARIEDADE_AUTOR1_idx` (`autor_id`),"
        "KEY `fk_variedades_especies1_idx` (`especie_id`),"
        "KEY `FK_da8whw6o3s7gbqr0uvnqtmcsn` (`familia_id`),"
        "KEY `FK_d6yt6nm5618awj03g6j2gxquv` (`genero_id`),"
        "CONSTRAINT `FK_d6yt6nm5618awj03g6j2gxquv` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),"
        "CONSTRAINT `FK_da8whw6o3s7gbqr0uvnqtmcsn` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`),"
        "CONSTRAINT `FK_dvnsuytm0v4aoq8s9mx36h3l9` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`),"
        "CONSTRAINT `fk_VARIEDADE_AUTOR1` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),"
        "CONSTRAINT `fk_variedades_especies1` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['sub_especies'] = ( ###foi alterada
        "CREATE TABLE `sub_especies` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(255) NOT NULL,"
        "`especie_id` int NOT NULL,"
        "`genero_id` int,"
        "`familia_id` int NOT NULL,"
        "`autor_id` int DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`),"
        "KEY `fk_sub_especies_especies1_idx` (`especie_id`),"
        "KEY `fk_sub_especies_autores1_idx` (`autor_id`),"
        "KEY `FK_tr5tae25suecit9ch4o6vxbie` (`familia_id`),"
        "KEY `FK_ld3mpvw1knj4jly7b9oje03o6` (`genero_id`),"
        "CONSTRAINT `FK_gt7o2m4hm4x8nbpihnnujoicm` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`),"
        "CONSTRAINT `FK_ld3mpvw1knj4jly7b9oje03o6` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),"
        "CONSTRAINT `fk_sub_especies_autores1` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),"
        "CONSTRAINT `fk_sub_especies_especies1` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`),"
        "CONSTRAINT `FK_tr5tae25suecit9ch4o6vxbie` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['sub_familias'] = (
        "CREATE TABLE `sub_familias` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(300) NOT NULL,"
        "`familia_id` int NOT NULL,"
        "`autor_id` int DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`,`familia_id`),"
        "KEY `fk_sub_familias_familias1_idx` (`familia_id`),"
        "KEY `fk_sub_familias_autores1_idx` (`autor_id`),"
        "CONSTRAINT `fk_sub_familias_autores1` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),"
        "CONSTRAINT `fk_sub_familias_familias1` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['colecoes_anexas'] = (
        "CREATE TABLE `colecoes_anexas` ("
        "`tipo` enum('CARPOTECA','XILOTECA','VIA LIQUIDA') NOT NULL,"
        "`observacoes` text,"
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['enderecos'] = (
        "CREATE TABLE `enderecos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`logradouro` varchar(200) NOT NULL,"
        "`numero` varchar(10) DEFAULT NULL,"
        "`complemento` text,"
        "`cidade_id` int unsigned DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`),"
        "KEY `fk_enderecos_cidades_idx` (`cidade_id`),"
        "CONSTRAINT `fk_enderecos_cidades` FOREIGN KEY (`cidade_id`) REFERENCES `cidades` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['herbarios'] = (
        "CREATE TABLE `herbarios` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`caminho_logotipo` text,"
        "`sigla` varchar(80) NOT NULL,"
        "`email` varchar(200) DEFAULT NULL,"
        "`ativo` tinyint(1) DEFAULT '1',"
        "`endereco_id` int DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`),"
        "KEY `fk_herbarios_enderecos1_idx` (`endereco_id`),"
        "CONSTRAINT `fk_herbarios_enderecos1` FOREIGN KEY (`endereco_id`) REFERENCES `enderecos` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['telefones'] = (
        "CREATE TABLE `telefones` ("
        "`id` int NOT NULL,"
        "`numero` varchar(200) NOT NULL,"
        "`herbario_id` int NOT NULL,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`),"
        "KEY `fk_telefones_herbarios1_idx` (`herbario_id`),"
        "CONSTRAINT `fk_telefones_herbarios1` FOREIGN KEY (`herbario_id`) REFERENCES `herbarios` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['remessas'] = (
        "CREATE TABLE `remessas` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`observacao` text,"
        "`data_envio` datetime DEFAULT NULL,"
        "`entidade_destino_id` int NOT NULL,"
        "`herbario_id` int NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`,`herbario_id`),"
        "KEY `fk_remessa_herbarios1_idx` (`herbario_id`),"
        "CONSTRAINT `fk_remessa_herbarios1` FOREIGN KEY (`herbario_id`) REFERENCES `herbarios` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['tipos'] = (
        "CREATE TABLE `tipos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(250) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")
    
    # Criação da tabela identificador
    TABLES['identificadores'] = (
    "CREATE TABLE `identificadores` ("
    "`id` int UNSIGNED NOT NULL AUTO_INCREMENT,"
    "`nome` varchar(255) NOT NULL,"
    "PRIMARY KEY (`id`)"
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;"
    )
    
#feito, buscar no sistema funcionalidade de rascunho
    TABLES['tombos'] = ( ###foi alterado
        "CREATE TABLE `tombos` ("
        "`hcf` int NOT NULL AUTO_INCREMENT,"
        "`data_tombo` datetime DEFAULT CURRENT_TIMESTAMP,"
        "`data_coleta_dia` int DEFAULT NULL,"
        "`observacao` text,"
        "`nomes_populares` text,"
        "`numero_coleta` int DEFAULT NULL,"
        "`latitude` double DEFAULT NULL,"
        "`longitude` double DEFAULT NULL,"
        "`altitude` double DEFAULT NULL,"
        "`entidade_id` int DEFAULT NULL,"
        "`local_coleta_id` int DEFAULT NULL,"
        "`variedade_id` int DEFAULT NULL,"
        "`tipo_id` int DEFAULT NULL,"
        "`data_identificacao_dia` tinyint UNSIGNED DEFAULT NULL,"
        "`data_identificacao_mes` tinyint UNSIGNED DEFAULT NULL,"
        "`data_identificacao_ano` year DEFAULT NULL,"
        "`situacao` enum('REGULAR','PERMUTA','EMPRESTIMO','DOACAO') DEFAULT 'REGULAR',"
        "`especie_id` int DEFAULT NULL,"
        "`genero_id` int DEFAULT NULL,"
        "`familia_id` int DEFAULT NULL,"
        "`sub_familia_id` int DEFAULT NULL,"
        "`sub_especie_id` int DEFAULT NULL,"
        "`nome_cientifico` text,"
        "`colecao_anexa_id` int DEFAULT NULL,"
        "`cor` enum('VERMELHO','VERDE','AZUL') DEFAULT NULL,"
        "`data_coleta_mes` int DEFAULT NULL,"
        "`data_coleta_ano` int DEFAULT NULL,"
        "`solo_id` int DEFAULT NULL,"
        "`relevo_id` int DEFAULT NULL,"
        "`vegetacao_id` int DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint(1) DEFAULT '1',"
        "`taxon` varchar(45) DEFAULT NULL,"
        "`rascunho` tinyint(1) DEFAULT '0',"
        "PRIMARY KEY (`hcf`),"
        "KEY `fk_TOMBO_ENTIDADE1_idx` (`entidade_id`),"
        "KEY `fk_tombos_tipo1_idx` (`tipo_id`),"
        "KEY `fk_tombos_especies1_idx` (`especie_id`),"
        "KEY `fk_tombos_generos1_idx` (`genero_id`),"
        "KEY `fk_tombos_familias1_idx` (`familia_id`),"
        "KEY `fk_tombos_sub_familias1_idx` (`sub_familia_id`),"
        "KEY `fk_tombos_sub_especies1_idx` (`sub_especie_id`),"
        "KEY `fk_tombos_variedades1_idx` (`variedade_id`,`colecao_anexa_id`),"
        "KEY `fk_tombos_colecoes1_idx` (`colecao_anexa_id`),"
        "KEY `fk_tombos_local1_idx` (`local_coleta_id`),"
        "KEY `fk_tombos_solo1_idx` (`solo_id`),"
        "KEY `fk_tombos_relevo1_idx` (`relevo_id`),"
        "KEY `fk_tombos_vegetacao1_idx` (`vegetacao_id`),"
        "CONSTRAINT `fk_TOMBO_ENTIDADE1` FOREIGN KEY (`entidade_id`) REFERENCES `herbarios` (`id`),"
        "CONSTRAINT `fk_tombos_colecoes1` FOREIGN KEY (`colecao_anexa_id`) REFERENCES `colecoes_anexas` (`id`),"
        "CONSTRAINT `fk_tombos_especies1` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`),"
        "CONSTRAINT `fk_tombos_familias1` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`),"
        "CONSTRAINT `fk_tombos_generos1` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),"
        "CONSTRAINT `fk_tombos_local1` FOREIGN KEY (`local_coleta_id`) REFERENCES `locais_coleta` (`id`),"
        "CONSTRAINT `fk_tombos_sub_especies1` FOREIGN KEY (`sub_especie_id`) REFERENCES `sub_especies` (`id`),"
        "CONSTRAINT `fk_tombos_sub_familias1` FOREIGN KEY (`sub_familia_id`) REFERENCES `sub_familias` (`id`),"
        "CONSTRAINT `fk_tombos_tipo1` FOREIGN KEY (`tipo_id`) REFERENCES `tipos` (`id`),"
        "CONSTRAINT `FK_tombos_solo1` FOREIGN KEY (`solo_id`) REFERENCES `solos` (`id`),"
        "CONSTRAINT `FK_tombos_relevo1` FOREIGN KEY (`relevo_id`) REFERENCES `relevos` (`id`),"
        "CONSTRAINT `FK_tombos_vegetacao1` FOREIGN KEY (`vegetacao_id`) REFERENCES `vegetacoes` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['tombos_coletores'] = (
        "CREATE TABLE `tombos_coletores` ("
        "`tombo_hcf` int NOT NULL,"
        "`coletor_id` int NOT NULL,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`principal` tinyint(1) NOT NULL DEFAULT '0',"
        "PRIMARY KEY (`tombo_hcf`,`coletor_id`),"
        "KEY `fk_COLETOR_has_TOMBO_TOMBO1_idx` (`tombo_hcf`),"
        "KEY `fk_tombos_coletores_coletor1_idx` (`coletor_id`),"
        "CONSTRAINT `fk_COLETOR_has_TOMBO_TOMBO1` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`),"
        "CONSTRAINT `fk_tombos_coletores_coletor1` FOREIGN KEY (`coletor_id`) REFERENCES `coletores` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    # Criação da tabela de junção tombos_identificadores
    TABLES['tombos_identificadores'] = (
    "CREATE TABLE `tombos_identificadores` ("
    "`identificador_id` int UNSIGNED NOT NULL,"
    "`tombo_hcf` int NOT NULL,"
    "`ordem` tinyint UNSIGNED DEFAULT 1,"
    "PRIMARY KEY (`identificador_id`, `tombo_hcf`),"
    "KEY `fk_tombos_identificadores_identificador_idx` (`identificador_id`),"
    "KEY `fk_tombos_identificadores_tombo_idx` (`tombo_hcf`),"
    "CONSTRAINT `fk_tombos_identificadores_identificador` FOREIGN KEY (`identificador_id`) REFERENCES `identificadores` (`id`),"
    "CONSTRAINT `fk_tombos_identificadores_tombo` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`)"
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;"
    )


#pendente, 1 para 1 com tombo_exsicatas no firebird ;; existe um tombo com id = 0 conversar com caxambu
    TABLES['tombos_fotos'] = (
        "CREATE TABLE `tombos_fotos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`tombo_hcf` int NOT NULL,"
        "`codigo_barra` varchar(45) DEFAULT '',"
        "`num_barra` varchar(45) DEFAULT '',"
        "`caminho_foto` text,"
        "`em_vivo` tinyint(1) NOT NULL DEFAULT '0',"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`sequencia` int DEFAULT NULL,"
        "`ativo` int DEFAULT '1',"
        "PRIMARY KEY (`id`),"
        "KEY `TOMBO_EXSICATA_IDX1` (`num_barra`),"
        "KEY `fk_TOMBO_EXSICATA_TOMBO1_idx` (`tombo_hcf`),"
        "CONSTRAINT `fk_tombos_fotos_tombos1` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#verificar implementação no sistema
    TABLES['tombo_alteracoes_antigas'] = (
        "CREATE TABLE `tombo_alteracoes_antigas` ("
        "`sequencia` int NOT NULL,"
        "`data` date DEFAULT NULL,"
        "`descricao` text,"
        "`tombo_hcf` int NOT NULL,"
        "PRIMARY KEY (`sequencia`,`tombo_hcf`),"
        "KEY `fk_TOMBO_REG_ALT_TOMBO1_idx` (`tombo_hcf`),"
        "CONSTRAINT `fk_TOMBO_REG_ALT_TOMBO1` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    TABLES['retirada_exsiccata_tombos'] = (
        "CREATE TABLE `retirada_exsiccata_tombos` ("
        "`retirada_exsiccata_id` int NOT NULL,"
        "`tombo_hcf` int NOT NULL,"
        "`tipo` enum('DOACAO','EMPRESTIMO','PERMUTA') NOT NULL,"
        "`data_vencimento` datetime DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`devolvido` tinyint(1) DEFAULT '0',"
        "PRIMARY KEY (`retirada_exsiccata_id`,`tombo_hcf`),"
        "KEY `fk_doacoes_has_tombos_tombos1_idx` (`tombo_hcf`),"
        "KEY `fk_doacoes_has_tombos_doacoes1_idx` (`retirada_exsiccata_id`),"
        "CONSTRAINT `fk_doacoes_has_tombos_doacoes1` FOREIGN KEY (`retirada_exsiccata_id`) REFERENCES `remessas` (`id`),"
        "CONSTRAINT `fk_doacoes_has_tombos_tombos1` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#pendente, falta insert de CURADOR, OPERADOR e IDENTIFICADOR
    TABLES['tipos_usuarios'] = (
        "CREATE TABLE `tipos_usuarios` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`tipo` varchar(100) DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#pendente, falta insert apenas o caxambu e hcfmaster
    TABLES['usuarios'] = (
        "CREATE TABLE `usuarios` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`ra` varchar(45) DEFAULT NULL,"
        "`email` varchar(200) NOT NULL,"
        "`senha` varchar(200) NOT NULL,"
        "`ativo` tinyint NOT NULL DEFAULT '1',"
        "`tipo_usuario_id` int NOT NULL,"
        "`telefone` varchar(45) DEFAULT NULL,"
        "`herbario_id` int NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`),"
        "KEY `fk_usuarios_tipos_usuarios1_idx` (`tipo_usuario_id`),"
        "KEY `fk_usuarios_herbarios1_idx` (`herbario_id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#pendente, falta insert adicionar alteracos aprovadas para tombos que forem migrados
    TABLES['alteracoes'] = (
        "CREATE TABLE `alteracoes` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`usuario_id` int NOT NULL,"
        "`status` enum('ESPERANDO','APROVADO','REPROVADO') NOT NULL,"
        "`observacao` text,"
        "`ativo` tinyint DEFAULT '1',"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`tombo_hcf` int NOT NULL,"
        "`tombo_json` text,"
        "`identificacao` tinyint DEFAULT '0',"
        "PRIMARY KEY (`id`),"
        "KEY `fk_alteraoes_usuarios_idx` (`usuario_id`),"
        "KEY `fk_alt_tombos_idx` (`tombo_hcf`),"
        "CONSTRAINT `fk_alteracoes_tombos_id` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`),"
        "CONSTRAINT `fk_alteraoes_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

    databaseNova = Database("hcf", conexaoNova.getCursor())  #nome da nova base de dados

    try:
        conexaoNova.getCursor().execute("USE {}".format(databaseNova.getNome()))
    except mysql.connector.Error as err:
        print("Database {} does not exists.".format(databaseNova.getNome()))
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            databaseNova.create_database()
            print("Database {} created successfully.".format(databaseNova.getNome()))
            conexaoNova.getConexao().database = databaseNova.getNome()
        else:
            print(err)
            exit(1)
    
    # for nome in reversed(TABLES): # a lista precisa ser invertida por conta das dependecias na hora de dropar
    #     databaseNova.drop_table(nome)
    
    # cria tabelas
    for nome in TABLES: 
       sql = TABLES[nome]
       databaseNova.create_table(nome, sql)

    databaseAntiga = Database("hcf_firebird", conexaoAntiga.getCursor())  #nome da base de dados em mysql que foi migrada do firebird

    # -----------------------Insere dados Coletores---------------------

    #contem coletores duplicados
    print("Processando Coletores! Aguarde...")
    coletorData = databaseAntiga.getConteudoTabela("coletor", "SELECT num_coletor, nome_coletor FROM coletor")

    coletorNumero = databaseAntiga.getConteudoTabela("tombo", "SELECT tombo_coletor, max(num_coleta) FROM tombo GROUP BY tombo_coletor;")

    coletorComplemento = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct complemento_coletor FROM tombo;")
    
    commitColetorData = ()
    sql = ("INSERT INTO coletores "
        "(id, nome, email, numero, data_criacao, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s)")
    
    dataAtual = date.today()
    conexaoColetor = conexaoNova.getConexao()
    idColetor = 0
    for coletor in coletorData:
        for numero in coletorNumero:
            if(numero[0] == coletor[0]):
                idColetor = coletor[0]
                commitColetorData = (idColetor, coletor[1], None, numero[1], dataAtual, 1)
                databaseNova.insertConteudoTabela("coletores", sql, commitColetorData, conexaoColetor )
    
    coletorList = list()
    for complementares in coletorComplemento:
        if(complementares[0]):
            complementaresSplit = re.split('[&|;|:|,]', complementares[0])
        for coletorSplit in complementaresSplit:
            if(coletorSplit != '' and coletorSplit != None and not coletorSplit.isspace()):
                # # print(coletorSplit)
                coletorList.append(coletorSplit.strip())
                
    
    coletorList = list(set(coletorList))

    coletorList = unique(coletorList) # testar para mostrar na proxima reuniao              

    for coletorFinal in coletorList:
        idColetor += 1
        commitColetorData = (idColetor, coletorFinal, None, None, dataAtual, 1)
        databaseNova.insertConteudoTabela("coletores", sql, commitColetorData, conexaoColetor )
    print("Concluído!")

    # -----------------------Insere dados Relevos---------------------
    print("Processando Relevos! Aguarde...")

    relevosData = databaseAntiga.getConteudoTabela("relevo", "SELECT cod_relevo, tp_relevo FROM relevo")

    commitRelevosData = ()
    sql = ("INSERT INTO relevos "
        "(id, nome) "
        "VALUES (%s, %s)")
    
    conexaoRelevos = conexaoNova.getConexao()
    for relevos in relevosData:
        commitRelevosData = (relevos[0], relevos[1])
        databaseNova.insertConteudoTabela("relevos", sql, commitRelevosData, conexaoRelevos )
    print("Concluído!")

    # -----------------------Insere dados Solos---------------------
    print("Processando Solos! Aguarde...")

    solosData = databaseAntiga.getConteudoTabela("solo", "SELECT cod_solo, tp_solo  FROM solo")

    commitSolosData = ()
    sql = ("INSERT INTO solos "
        "(id, nome) "
        "VALUES (%s, %s)")
    
    conexaoSolos = conexaoNova.getConexao()
    for solos in solosData:
        commitSolosData = (solos[0], solos[1])
        databaseNova.insertConteudoTabela("solos", sql, commitSolosData, conexaoSolos )
    print("Concluído!")

    # -----------------------Insere dados Vegetacoes---------------------
    print("Processando Vegetacoes! Aguarde...")
    vegetacoesData = databaseAntiga.getConteudoTabela("vegetacao", "SELECT cod_vegetacao, tp_vegetacao FROM vegetacao")

    commitVegetacoesData = ()
    sql = ("INSERT INTO vegetacoes "
        "(id, nome) "
        "VALUES (%s, %s)")
    
    conexaoVegetacoes = conexaoNova.getConexao()
    for vegetacoes in vegetacoesData:
        commitVegetacoesData = (vegetacoes[0], vegetacoes[1])
        databaseNova.insertConteudoTabela("vegetacoes", sql, commitVegetacoesData, conexaoVegetacoes )
    print("Concluído!")

    # -----------------------Insere dados fase_sucessional---------------------
    print("Processando Fase sucessional! Aguarde...")
    fase_sucessionalData = [(1, '1º fase sucessão vegetal'), (2, '2º fase sucessão vegetal'), (3, '3º fase ou capoeirinhia'), (4, '4º fase capoeira'), (5, '5º fase capoeirão'), (6, '6º fase floresta secundária')]

    commitFase_sucessionalData = ()
    sql = ("INSERT INTO fase_sucessional "
        "(numero, nome) "
        "VALUES (%s, %s)")
    
    conexaoFase_sucessional = conexaoNova.getConexao()
    for fase_sucessional in fase_sucessionalData:
        commitFase_sucessionalData = (fase_sucessional[0], fase_sucessional[1])
        databaseNova.insertConteudoTabela("fase_sucessional", sql, commitFase_sucessionalData, conexaoFase_sucessional )
    print("Concluído!")

    # -----------------------Insere dados paises-------------------------------------
    print("Processando Países! Aguarde...")
    
    paisesData = ''
    with open('Cidades_Estados_Paises/paises.csv', newline='', encoding="utf8") as csvfile:
        csvReader = csv.reader(csvfile, delimiter = ';')
        next(csvReader)
        paisesData = list(csvReader)

    # print(paisesData)
    commitPaisesData = ()
    sql = ("INSERT INTO paises "
        "(id, nome, sigla) "
        "VALUES (%s, %s, %s)")
    
    conexaoPaises = conexaoNova.getConexao()
    for pais in paisesData:
        commitPaisesData = (pais[0], pais[2], pais[1])
        databaseNova.insertConteudoTabela("paises", sql, commitPaisesData, conexaoPaises )
    print("Concluído!")

    # -----------------------Insere dados estados-------------------------------------
    print("Processando Estados! Aguarde...")
    estadosData = ''
    with open('Cidades_Estados_Paises/estados.csv', newline='', encoding="utf8") as csvfile:
        csvReader = csv.reader(csvfile, delimiter = ';')
        next(csvReader)
        estadosData = list(csvReader)
        
    commitEstadosData = ()
    sql = ("INSERT INTO estados "
        "(id, nome, sigla, codigo_telefone, pais_id) "
        "VALUES (%s, %s, %s, %s, %s)")
    
    conexaoEstados = conexaoNova.getConexao()
    for estado in estadosData:
        commitEstadosData = (estado[0], estado[2], estado[1], None, estado[3])
        databaseNova.insertConteudoTabela("estados", sql, commitEstadosData, conexaoEstados )
    print("Concluído!")

    # -----------------------Insere dados cidades-------------------------------------
    print("Processando Cidades! Aguarde...")
    cidadesData = ''
    with open('Cidades_Estados_Paises/municipios.csv', newline='', encoding='UTF-8') as csvfile:
        csvReader = csv.reader(csvfile, delimiter = ';')
        next(csvReader)
        cidadesData = list(csvReader)

    commitCidadesData = ()
    sql = ("INSERT INTO cidades "
        "(id, estado_id, nome) "
        "VALUES (%s, %s, %s)")
    
    conexaoCidades = conexaoNova.getConexao()
    for cidade in cidadesData:
        commitCidadesData = (cidade[0], cidade[2], cidade[1])
        databaseNova.insertConteudoTabela("cidades", sql, commitCidadesData, conexaoCidades )
    print("Concluído!")

    # -----------------------Insere dados locais_coleta-------------------------------------
    print("Processando Locais Coleta! Aguarde...")
    locais_coletaData = databaseAntiga.getConteudoTabela("local_coleta", "SELECT codigo, local, regiao_do_local, cidade, estado, pais FROM local_coleta")

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
        commitLocais_coletaData = (locais_coleta[0], locais_coleta[1] if locais_coleta[1] else "" + locais_coleta[2] if locais_coleta[2] else "", cidadeId, None, None, None)
        databaseNova.insertConteudoTabela("locais_coleta", sql, commitLocais_coletaData, conexaoLocais_coleta )
    print("Concluído!")

    # -----------------------Insere dados familias-------------------------------------------
    print("Processando Famílias! Aguarde...")
    familiasData = databaseAntiga.getConteudoTabela("familia", "SELECT cod_familia, familia FROM familia")
    

    commitFamiliasData = ()
    sql = ("INSERT INTO familias "
        "(id, nome, ativo) "
        "VALUES (%s, %s, %s)")  
    
    conexaoFamilias = conexaoNova.getConexao()
    for familias in familiasData:
        commitFamiliasData = (familias[0], familias[1], 1)
        databaseNova.insertConteudoTabela("familias", sql, commitFamiliasData, conexaoFamilias )
    print("Concluído!")

    # -----------------------Insere dados generos-------------------------------------------
    print("Processando Gêneros! Aguarde...")
    generosData = databaseAntiga.getConteudoTabela("especie", "SELECT especie, cd_familia FROM especie")
    
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
    print("Concluído!")

    # -----------------------Insere dados autores-------------------------------------------
    # adicionar autores de especie
    # adicionar autores de variedade
    # adicionar autores de subespecie
    print("Processando Autores! Aguarde...")
    autoresData = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct especie_especie_autor FROM tombo union SELECT distinct especie_subspecie_autor FROM tombo union SELECT distinct especie_variedade_autor FROM tombo")
      
    nomePadronizado = list()
    for autor in autoresData:
        if(autor[0]):
            nomePadronizado.append(padronizaNomeAutor(autor[0]))
    
    nomePadronizado = list(set(nomePadronizado))

    nomePadronizado = unique(nomePadronizado) # testar para mostrar na proxima reuniao
    commitAutoresData = ()
    sql = ("INSERT INTO autores "
        "(id, nome, iniciais, ativo) "
        "VALUES (%s, %s, %s, %s)")  
    
    conexaoAutores = conexaoNova.getConexao()
    id = 0
    for autores in nomePadronizado:
        id += 1
        iniciais = getIniciaisAutores(autores)
        commitAutoresData = (id, autores, iniciais, 1)
        databaseNova.insertConteudoTabela("autores", sql, commitAutoresData, conexaoAutores )
    print("Concluído!")

    # -----------------------Insere dados especies-------------------------------------------

    print("Processando Espécies! Aguarde...")
    tomboData = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct especie_especie_2 as especie, especie_especie_autor as autor_especie, codigo_familia, codigo_especie FROM tombo")

    especieData = databaseAntiga.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")

    autorData = databaseNova.getConteudoTabela("autor", "SELECT id, nome FROM autores")

    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")
    
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
    print("Concluído!")

    # -----------------------Insere dados variedades-------------------------------------------
    print("Processando Variedades! Aguarde...")
    tomboData = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct especie_variedade as variedade, especie_variedade_autor as variedade_autor, codigo_familia, codigo_especie, especie_especie_2 FROM tombo")

    especieData = databaseAntiga.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")

    autorData = databaseNova.getConteudoTabela("autor", "SELECT id, nome FROM autores")

    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")

    especiesData = databaseNova.getConteudoTabela("especies", "SELECT id, nome FROM especies")
    
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
    print("Concluído!")
                    
    # -----------------------Insere dados sub_especies-------------------------------------------
    print("Processando Sub-espécies! Aguarde...")   
    tomboData = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct especie_subspecie as subEspecie, especie_subspecie_autor as autor_subEspecie, codigo_familia, codigo_especie, especie_especie_2 FROM tombo")

    especieData = databaseAntiga.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")

    autorData = databaseNova.getConteudoTabela("autor", "SELECT id, nome FROM autores")

    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")

    especiesData = databaseNova.getConteudoTabela("especies", "SELECT id, nome FROM especies")

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
    print("Concluído!")

    # -----------------------Insere dados sub_familias-------------------------------------------
    print("Processando Sub-famílias! Aguarde...")    
    subFamiliaData = databaseAntiga.getConteudoTabela("subfamilia", "SELECT cd_familiasub, subfamilia FROM subfamilia")

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
    print("Concluído!")

    # -----------------------Insere dados colexoes_anexas-------------------------------------------

    # colecoes_anexas perguntar para o caxambu

    # -----------------------Insere dados endereco-------------------------------------------
    # procurar crud de enderecos
    
    # -----------------------Insere dados herbarios-------------------------------------------
    print("Processando Herbários! Aguarde...")
    conexaoHerbariosAntiga = conexaoAntiga.getConexao()
    commitHerbariosDataAntiga = ()

    updateHerbariosFirebird(conexaoHerbariosAntiga, commitHerbariosDataAntiga, databaseAntiga)

    herbariosData = databaseAntiga.getConteudoTabela("instituicao_identificadora", "SELECT codigo, nome_instituicao FROM instituicao_identificadora")

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
    print("Concluído!")

    # -----------------------Insere dados tipos-------------------------------------------
    print("Processando Tipos! Aguarde...")
    tipoData = databaseAntiga.getConteudoTabela("tipo", "SELECT cod_tipo, tp_descricao FROM tipo")

    commitTipoData = ()
    sql = ("INSERT INTO tipos "
        "(id, nome) "
        "VALUES (%s, %s)")  
    
    conexaoTipo = conexaoNova.getConexao()
    for tipo in tipoData:
        commitTipoData = (tipo[0], tipo[1])
        databaseNova.insertConteudoTabela("herbarios", sql, commitTipoData, conexaoTipo )
    print("Concluído!")

    # -----------------------Insere dados identificadores-------------------------------------------
    print("Processando Identificadores! Aguarde...")
    identificadorData = databaseAntiga.getConteudoTabela("identificador", "SELECT nome FROM identificador")

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
    print("Concluído!")

    # -----------------------Insere dados tombos-------------------------------------------
    print("Processando Tombos! Aguarde...")    
    tombosData = databaseAntiga.getConteudoTabela("tombo", "SELECT hcf, data_tombo, data_coleta, observacao, nomes_populares, num_coleta, latitude, longitude, altitude, tombo_instituicao, local_coleta, especie_variedade, tipo, especie_especie_2, codigo_familia, codigo_especie, tombo_familia_sub, especie_subspecie, nome_especie, vermelho, verde, azul, codigo_solo, codigo_relevo, codigo_vegetacao, data_identificacao FROM tombo")

    #olhar para espécie também
    variedadesData = databaseNova.getConteudoTabela("variedades", "SELECT id, nome FROM variedades")

    especiesData = databaseNova.getConteudoTabela("especies", "SELECT id, nome FROM especies")

    especieData = databaseAntiga.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")

    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")

    sub_familiasData = databaseNova.getConteudoTabela("sub_familias", "SELECT id, nome FROM sub_familias")

    sub_especiesData = databaseNova.getConteudoTabela("sub_especies", "SELECT id, nome FROM sub_especies")

    commitTombosData = ()
    sql = ("INSERT INTO tombos "
        "(hcf, data_tombo, data_coleta_dia, observacao, nomes_populares, numero_coleta, latitude, longitude, "
        "altitude, entidade_id, local_coleta_id, variedade_id, tipo_id, data_identificacao_dia, data_identificacao_mes, data_identificacao_ano, situacao, especie_id, genero_id, "
        "familia_id, sub_familia_id, sub_especie_id, nome_cientifico, colecao_anexa_id, cor, data_coleta_mes, "
        "data_coleta_ano, solo_id, relevo_id, vegetacao_id, ativo, taxon, rascunho) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")  
    
    conexaoTombo = conexaoNova.getConexao()
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

        dataIdentificacao = re.split(r'[-/,.]', str(tombo[25]))
        data_identificacao_dia, data_identificacao_mes, data_identificacao_ano = splitData(dataIdentificacao)

        commitTombosData = (tombo[0], tombo[1], dataSplit[2], tombo[3], tombo[4], tombo[5], convertLatitude(tombo[6]), convertLongitude(tombo[7]), converteAltitude(tombo[8]), tombo[9], tombo[10], variedadeFinal, tombo[12], data_identificacao_dia, data_identificacao_mes, data_identificacao_ano, 'REGULAR', especieFinal, generoFinal, tombo[14], sub_familiasFinal, sub_especiesFinal, tombo[18], None, corFinal, dataSplit[1], dataSplit[0], tombo[22], tombo[23], tombo[24], 1, None, None)
        databaseNova.insertConteudoTabela("tombos", sql, commitTombosData, conexaoTombo)

    print("Concluído!")

    # -----------------------Insere dados tombos_identificadores--------------------------------------------
    print("Processando Identificadores Tombo! Aguarde...")
    tombos_identificadorData = databaseAntiga.getConteudoTabela("tombo", "SELECT hcf, tombo_identificador FROM tombo")

    # SQL para inserção na nova tabela de relação
    sql_insert = ("INSERT INTO tombos_identificadores "
                "(identificador_id, tombo_hcf, ordem) "
                "VALUES (%s, %s, %s)")

    # SQL para buscar o nome do identificador na base antiga
    sql_get_nome_identificador_antigo = ("SELECT nome FROM identificador WHERE num_identificador = %s")

    # SQL para buscar o identificador_id pelo nome na base nova
    sql_get_identificador_novo = ("SELECT id FROM identificadores WHERE nome = %s")

    conexaoIdentificadorTombo = conexaoNova.getConexao()
    conexaoIdentificadorTomboAntigo = conexaoAntiga.getConexao()
    cursorNova = conexaoIdentificadorTombo.cursor()
    cursorAntiga = conexaoIdentificadorTomboAntigo.cursor()
    
    for tombo in tombos_identificadorData:
        hcf = tombo[0]
        identificador_antigo_id = tombo[1]

        # Recuperar o nome (ou nomes) do identificador da base antiga
        cursorAntiga.execute(sql_get_nome_identificador_antigo, (identificador_antigo_id,))
        result = cursorAntiga.fetchone()
        if result:
            identificadores_nomes = re.split(r'[&;,]', result[0])
            
            for ordem, identificador_nome in enumerate(identificadores_nomes, 1):
                identificador_nome = identificador_nome.strip()

                # Buscar o identificador_id correspondente na base nova
                cursorNova.execute(sql_get_identificador_novo, (identificador_nome,))
                identificador_id_novo = cursorNova.fetchone()[0]
                
                # Inserir na nova tabela de relação com a ordem correta
                databaseNova.insertConteudoTabela("tombos_identificadores", sql_insert, (identificador_id_novo, hcf, ordem), conexaoIdentificadorTombo)

    print("Concluído!")
    
    # -----------------------Insere dados tombos_coletores-------------------------------------------
    print("Processando Tombos Coletores! Aguarde...")
    tombos_coletoresData = databaseAntiga.getConteudoTabela("tombo", "SELECT hcf, tombo_coletor, complemento_coletor FROM tombo")

    coletoresData = databaseNova.getConteudoTabela("coletores", "select id, nome from coletores;")

    commitTombos_fotosData = ()
    sql = ("INSERT INTO tombos_coletores "
       "(tombo_hcf, coletor_id, principal) "
       "VALUES (%s, %s, %s)")  
    
    conexaoTombos_coletores = conexaoNova.getConexao()
    for tombos_coletores in tombos_coletoresData:
       if(tombos_coletores[1]):
           commitTombos_fotosData = (tombos_coletores[0], tombos_coletores[1], 1)
           databaseNova.insertConteudoTabela("tombos_coletores", sql, commitTombos_fotosData, conexaoTombos_coletores)
       if(tombos_coletores[2]):
           complementaresSplit = re.split('[&|;|:|,]', tombos_coletores[2])
           coletorNameList = []
           for coletorSplit in complementaresSplit:
               if(coletorSplit != '' and coletorSplit != None and not coletorSplit.isspace()):
                   coletorNameList.append(coletorSplit.strip())
           for coletorName in coletorNameList:
               coletorInserido = None
               for coletor in coletoresData:
                   if(coletor[1] == coletorName):
                       coletorInserido = coletor
               if(coletorInserido):
                   commitTombos_fotosData = (tombos_coletores[0], coletorInserido[0], 0)
                   databaseNova.insertConteudoTabela("tombos_coletores", sql, commitTombos_fotosData, conexaoTombos_coletores)
    print("Concluído!")

    # # -----------------------Insere dados tombos_fotos-------------------------------------------

    # # tombos_fotosData = databaseAntiga.getConteudoTabela("tombo_exsicata", "SELECT num_tombo, sequencia, cod_barra, num_barra FROM familia")

    # # commitTombos_fotosData = ()
    # # sql = ("INSERT INTO tombos_fotos "
    # #     "(id, nome, ativo) "
    # #     "VALUES (%s, %s, %s)")  
    
    # # conexaoTombos_fotos = conexaoNova.getConexao()
    # # for tombos_fotos in tombos_fotosData:
    # #     commitTombos_fotosData = (tombos_fotos[0], tombos_fotos[1], 1)
    # #     databaseNova.insertConteudoTabela("tombos_fotos", sql, commitTombos_fotosData, conexaoTombos_fotos)


    end_time = time.time()
    elapsed_time = (end_time - start_time)/60
    print(f"Tempo de execução: {elapsed_time:.2f} minutos")
    # print("Latitudes: ", latitudesErros)
    # print()
    # print("Longitudes: ", longitudesErros)

    conexaoNova.closeConexao()
    conexaoAntiga.closeConexao()


if __name__ == "__main__":
    main()