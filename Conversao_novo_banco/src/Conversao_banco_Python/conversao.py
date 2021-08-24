from __future__ import print_function
from datetime import date
import csv

import mysql.connector
from mysql.connector import errorcode

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
            print("Inserting table content {}: ".format(nome), end='')
            self.__cursor.execute(sql, conteudo)
            conexao.commit()
        except mysql.connector.Error as err:
            print(err.msg)       
        else:
            print("OK")
    
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

def main():

    conexaoNova = Conexao()
    conexaoNova.conexaoNovoBanco('root', '') # nickname, password
    conexaoAntiga = Conexao()
    conexaoAntiga.conexaoBancoExistente('root', '', '') # nickname, password, nome da base de dados em mysql que foi migrada do firebird

    TABLES = {}

#ainda nao fiz, esta vazio
    TABLES['historico_acessos'] = (
        "CREATE TABLE `historico_acessos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`data_criacao` datetime NOT NULL,"
        "`usuario_id` int NOT NULL,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#ainda nao fiz, so tem 1 item
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

#feito, falta campo numero
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

#feito
    TABLES['relevos'] = (
        "CREATE TABLE `relevos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(300) NOT NULL,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito
    TABLES['solos'] = (
        "CREATE TABLE `solos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(300) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito
    TABLES['vegetacoes'] = (
        "CREATE TABLE `vegetacoes` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(300) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito
    TABLES['fase_sucessional'] = (
        "CREATE TABLE `fase_sucessional` ("
        "`numero` int NOT NULL,"
        "`nome` varchar(200) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`numero`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito
    TABLES['paises'] = (
        "CREATE TABLE `paises` ("
        "`id` smallint unsigned NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(255) NOT NULL,"
        "`sigla` char(2) DEFAULT NULL,"
        "`created_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=latin1;")

#feito
    TABLES['estados'] = (
        "CREATE TABLE `estados` ("
        "`id` int unsigned NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,"
        "`sigla` char(2) DEFAULT NULL,"
        "`codigo_telefone` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,"
        "`pais_id` smallint unsigned NOT NULL,"
        "`created_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`),"
        "KEY `pais_nome` (`pais_id`,`nome`),"
        "CONSTRAINT `fk_estados_paises` FOREIGN KEY (`pais_id`) REFERENCES `paises` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;")

#feito
    TABLES['cidades'] = (
        "CREATE TABLE `cidades` ("
        "`id` int unsigned NOT NULL AUTO_INCREMENT,"  
        "`estado_id` int unsigned NOT NULL,"  
        "`latitude` double DEFAULT NULL," 
        "`longitude` double DEFAULT NULL,"
        "`nome` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,"
        "`created_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)," 
        "KEY `fk_cidades_estado_idx` (`estado_id`),"  
        "KEY `pais_estado_nome` (`estado_id`,`nome`),"
        "CONSTRAINT `fk_cidades_estados` FOREIGN KEY (`estado_id`) REFERENCES `estados` (`id`)"   
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;")

#feito, falta campo solo_id, relevo_id, vegetacao_id, fase_sucessional_id, complemento        
    TABLES['locais_coleta'] = (
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

#feito
    TABLES['familias'] = (
        "CREATE TABLE `familias` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint(1) DEFAULT '1',"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito, pode ter inconcistencia nos IDs, olhar isso
    TABLES['generos'] = (
        "CREATE TABLE `generos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`familia_id` int NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`,`familia_id`),"
        "KEY `fk_generos_familias1_idx` (`familia_id`),"
        "CONSTRAINT `fk_generos_familias1` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito, falta campo ID, formula para calcular campos nome e iniciais
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

#feito, falta campo ID, sql para encontrar os demais campos
# select TOMBO.ESPECIE_ESPECIE_2 AS especie, ESPECIE.ESPECIE as genero, TOMBO.ESPECIE_ESPECIE_AUTOR as autor, FAMILIA.FAMILIA as familia FROM TOMBO
# INNER JOIN ESPECIE ON ESPECIE.CODIGO_ESPECIE = TOMBO.CODIGO_ESPECIE and TOMBO.CODIGO_FAMILIA = ESPECIE.CD_FAMILIA
# left join FAMILIA on FAMILIA.COD_FAMILIA = TOMBO.CODIGO_FAMILIA
# group by TOMBO.ESPECIE_ESPECIE_2, ESPECIE.ESPECIE,  TOMBO.ESPECIE_ESPECIE_AUTOR, FAMILIA.FAMILIA;
    TABLES['especies'] = (
        "CREATE TABLE `especies` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`autor_id` int DEFAULT NULL,"
        "`genero_id` int NOT NULL,"
        "`familia_id` int NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`,`genero_id`,`familia_id`),"
        "KEY `fk_ESPECIE_AUTOR1_idx` (`autor_id`),"
        "KEY `fk_especies_generos1_idx` (`genero_id`,`familia_id`),"
        "KEY `FK_l5yo4hb1gc053dkth7vveaadt` (`familia_id`),"
        "CONSTRAINT `fk_ESPECIE_AUTOR1` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),"
        "CONSTRAINT `fk_especies_generos1` FOREIGN KEY (`genero_id`, `familia_id`) REFERENCES `generos` (`id`, `familia_id`),"
        "CONSTRAINT `FK_l5yo4hb1gc053dkth7vveaadt` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`),"
        "CONSTRAINT `FK_rygol8x4wtm3bduaj1wjp6ses` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito, falta campo ID, sql para encontrar os demais campos
# select TOMBO.ESPECIE_ESPECIE_2 AS especie, TOMBO.ESPECIE_VARIEDADE_AUTOR as autor,
# TOMBO.ESPECIE_VARIEDADE AS variedade
# FROM TOMBO where TOMBO.ESPECIE_VARIEDADE is not null;
    TABLES['variedades'] = (
        "CREATE TABLE `variedades` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(200) NOT NULL,"
        "`autor_id` int DEFAULT NULL,"
        "`especie_id` int NOT NULL,"
        "`genero_id` int NOT NULL,"
        "`familia_id` int NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`,`especie_id`,`genero_id`,`familia_id`),"
        "KEY `fk_VARIEDADE_AUTOR1_idx` (`autor_id`),"
        "KEY `fk_variedades_especies1_idx` (`especie_id`,`genero_id`,`familia_id`),"
        "KEY `FK_da8whw6o3s7gbqr0uvnqtmcsn` (`familia_id`),"
        "KEY `FK_d6yt6nm5618awj03g6j2gxquv` (`genero_id`),"
        "CONSTRAINT `FK_d6yt6nm5618awj03g6j2gxquv` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),"
        "CONSTRAINT `FK_da8whw6o3s7gbqr0uvnqtmcsn` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`),"
        "CONSTRAINT `FK_dvnsuytm0v4aoq8s9mx36h3l9` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`),"
        "CONSTRAINT `fk_VARIEDADE_AUTOR1` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),"
        "CONSTRAINT `fk_variedades_especies1` FOREIGN KEY (`especie_id`, `genero_id`, `familia_id`) REFERENCES `especies` (`id`, `genero_id`, `familia_id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito, falta campo ID, autor_id nao esta batendo os dados
# select TOMBO.ESPECIE_ESPECIE_2 AS especie,
# TOMBO.ESPECIE_SUBSPECIE_AUTOR as autor, 
# TOMBO.ESPECIE_SUBSPECIE AS subspecies 
# FROM TOMBO where TOMBO.ESPECIE_SUBSPECIE is not null;
    TABLES['sub_especies'] = (
        "CREATE TABLE `sub_especies` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(255) NOT NULL,"
        "`especie_id` int NOT NULL,"
        "`genero_id` int NOT NULL,"
        "`familia_id` int NOT NULL,"
        "`autor_id` int DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`ativo` tinyint DEFAULT '1',"
        "PRIMARY KEY (`id`,`especie_id`,`genero_id`,`familia_id`),"
        "KEY `fk_sub_especies_especies1_idx` (`especie_id`,`genero_id`,`familia_id`),"
        "KEY `fk_sub_especies_autores1_idx` (`autor_id`),"
        "KEY `FK_tr5tae25suecit9ch4o6vxbie` (`familia_id`),"
        "KEY `FK_ld3mpvw1knj4jly7b9oje03o6` (`genero_id`),"
        "CONSTRAINT `FK_gt7o2m4hm4x8nbpihnnujoicm` FOREIGN KEY (`especie_id`) REFERENCES `especies` (`id`),"
        "CONSTRAINT `FK_ld3mpvw1knj4jly7b9oje03o6` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),"
        "CONSTRAINT `fk_sub_especies_autores1` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),"
        "CONSTRAINT `fk_sub_especies_especies1` FOREIGN KEY (`especie_id`, `genero_id`, `familia_id`) REFERENCES `especies` (`id`, `genero_id`, `familia_id`),"
        "CONSTRAINT `FK_tr5tae25suecit9ch4o6vxbie` FOREIGN KEY (`familia_id`) REFERENCES `familias` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito, falta campo ID, autor_id tudo null
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

#ainda nao fiz, nao encotrei de onde vem os dados, poucos dados
    TABLES['colecoes_anexas'] = (
        "CREATE TABLE `colecoes_anexas` ("
        "`tipo` enum('CARPOTECA','XILOTECA','VIA LIQUIDA') NOT NULL,"
        "`observacoes` text,"
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#ainda nao fiz, nao encontrei de onde vem os dados, poucos dados
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

#feito, conferir campos NULL, necessario separar nome da sigla
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

#ainda nao fiz, tabela vazia
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

#ainda nao fiz, remessa do firebird nao contem dados, porem remessas do mysql contem.
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

#feito   
    TABLES['tipos'] = (
        "CREATE TABLE `tipos` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`nome` varchar(250) NOT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

#feito, muitas observacoes a fazer.
    TABLES['tombos'] = (
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

    TABLES['tipos_usuarios'] = (
        "CREATE TABLE `tipos_usuarios` ("
        "`id` int NOT NULL AUTO_INCREMENT,"
        "`tipo` varchar(100) DEFAULT NULL,"
        "`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,"
        "PRIMARY KEY (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

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
        "`data_identificacao_dia` int DEFAULT NULL,"
        "`data_identificacao_mes` int DEFAULT NULL,"
        "`data_identificacao_ano` int DEFAULT NULL,"
        "PRIMARY KEY (`id`),"
        "KEY `fk_alteraoes_usuarios_idx` (`usuario_id`),"
        "KEY `fk_alt_tombos_idx` (`tombo_hcf`),"
        "CONSTRAINT `fk_alteracoes_tombos_id` FOREIGN KEY (`tombo_hcf`) REFERENCES `tombos` (`hcf`),"
        "CONSTRAINT `fk_alteraoes_usuarios` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)"
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;")

# verificar nome do banco no sistema

    databaseTeste = Database("bancoteste", conexaoNova.getCursor())  #nome da nova base de dados

    try:
        conexaoNova.getCursor().execute("USE {}".format(databaseTeste.getNome()))
    except mysql.connector.Error as err:
        print("Database {} does not exists.".format(databaseTeste.getNome()))
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            databaseTeste.create_database()
            print("Database {} created successfully.".format(databaseTeste.getNome()))
            conexaoNova.getConexao().database = databaseTeste.getNome()
        else:
            print(err)
            exit(1)
    
    # for nome in reversed(TABLES): # a lista precisa ser invertida por conta das dependecias na hora de dropar
    #     databaseTeste.drop_table(nome)
    
    # for nome in TABLES: # cria tabelas
    #     sql = TABLES[nome]
    #     databaseTeste.create_table(nome, sql)

  
    
    databaseAntiga = Database("hcfteste", conexaoAntiga.getCursor())  #nome da base de dados em mysql que foi migrada do firebird
    # -----------------------Insere dados Coletores---------------------
    # coletorData = databaseAntiga.getConteudoTabela("coletor", "SELECT num_coletor, nome_coletor FROM coletor")

    # coletorNumero = databaseAntiga.getConteudoTabela("tombo", "SELECT tombo_coletor, max(num_coleta) FROM hcfteste.tombo GROUP BY tombo_coletor;")

    # commitColetorData = ()
    # sql = ("INSERT INTO coletores "
    #     "(id, nome, email, numero, data_criacao, ativo) "
    #     "VALUES (%s, %s, %s, %s, %s, %s)")
    
    # dataAtual = date.today()
    # conexaoColetor = conexaoNova.getConexao()
    # for coletor in coletorData:
    #     for numero in coletorNumero:
    #         if(numero[0] == coletor[0]):
    #             commitColetorData = (coletor[0], coletor[1], None, numero[1], dataAtual, 1)
    #             databaseTeste.insertConteudoTabela("coletores", sql, commitColetorData, conexaoColetor )

    # -----------------------Insere dados Relevos---------------------
    # relevosData = databaseAntiga.getConteudoTabela("relevo", "SELECT cod_relevo, tp_relevo FROM relevo")

    # commitRelevosData = ()
    # sql = ("INSERT INTO relevos "
    #     "(id, nome) "
    #     "VALUES (%s, %s)")
    
    # conexaoRelevos = conexaoNova.getConexao()
    # for relevos in relevosData:
    #     commitRelevosData = (relevos[0], relevos[1])
    #     databaseTeste.insertConteudoTabela("relevos", sql, commitRelevosData, conexaoRelevos )

    # -----------------------Insere dados Solos---------------------
    # solosData = databaseAntiga.getConteudoTabela("solo", "SELECT cod_solo, tp_solo  FROM solo")

    # commitSolosData = ()
    # sql = ("INSERT INTO Solos "
    #     "(id, nome) "
    #     "VALUES (%s, %s)")
    
    # conexaoSolos = conexaoNova.getConexao()
    # for solos in solosData:
    #     commitSolosData = (solos[0], solos[1])
    #     databaseTeste.insertConteudoTabela("Solos", sql, commitSolosData, conexaoSolos )

    # -----------------------Insere dados Vegetacoes---------------------
    # vegetacoesData = databaseAntiga.getConteudoTabela("vegetacao", "SELECT cod_vegetacao, tp_vegetacao FROM vegetacao")

    # commitVegetacoesData = ()
    # sql = ("INSERT INTO Vegetacoes "
    #     "(id, nome) "
    #     "VALUES (%s, %s)")
    
    # conexaoVegetacoes = conexaoNova.getConexao()
    # for vegetacoes in vegetacoesData:
    #     commitVegetacoesData = (vegetacoes[0], vegetacoes[1])
    #     databaseTeste.insertConteudoTabela("Vegetacoes", sql, commitVegetacoesData, conexaoVegetacoes )

    # -----------------------Insere dados fase_sucessional---------------------
    # fase_sucessionalData = [(1, '1º fase sucessão vegetal'), (2, '2º fase sucessão vegetal'), (3, '3º fase ou capoeirinhia'), (4, '4º fase capoeira'), (5, '5º fase capoeirão'), (6, '6º fase floresta secundária')]

    # commitFase_sucessionalData = ()
    # sql = ("INSERT INTO fase_sucessional "
    #     "(numero, nome) "
    #     "VALUES (%s, %s)")
    
    # conexaoFase_sucessional = conexaoNova.getConexao()
    # for fase_sucessional in fase_sucessionalData:
    #     commitFase_sucessionalData = (fase_sucessional[0], fase_sucessional[1])
    #     databaseTeste.insertConteudoTabela("fase_sucessional", sql, commitFase_sucessionalData, conexaoFase_sucessional )

    # -----------------------Insere dados paises-------------------------------------
    # paisesData = ''
    # with open('HCFPaises.csv', newline='') as csvfile:
    #     paisesData = list(csv.reader(csvfile))

    # commitPaisesData = ()
    # sql = ("INSERT INTO paises "
    #     "(id, nome, sigla) "
    #     "VALUES (%s, %s, %s)")
    
    # conexaoPaises = conexaoNova.getConexao()
    # for pais in paisesData:
    #     id =  pais[0] if pais[0] else 'NULL'
    #     nome =  pais[1] if pais[1] else 'NULL'
    #     sigla =  pais[2] if pais[2] else 'NULL'
    #     commitPaisesData = (id, nome, sigla)
    #     databaseTeste.insertConteudoTabela("paises", sql, commitPaisesData, conexaoPaises )

    # -----------------------Insere dados estados-------------------------------------

    estadosData = ''
    with open('HCFEstados.csv', newline='') as csvfile:
        estadosData = list(csv.reader(csvfile))

    commitEstadosData = ()
    sql = ("INSERT INTO estados "
        "(id, nome, sigla, codigo_telefone, pais_id) "
        "VALUES (%s, %s, %s, %s, %s)")
    
    conexaoEstados = conexaoNova.getConexao()
    for estado in estadosData:
        id =  estado[0] if estado[0] else 'NULL'
        nome =  estado[1] if estado[1] else 'NULL'
        pais_id =  estado[4] if estado[4] else 'NULL'
        commitEstadosData = (id, nome, estado[2], estado[3], pais_id)
        databaseTeste.insertConteudoTabela("estados", sql, commitEstadosData, conexaoEstados )

    # -----------------------Insere dados cidades-------------------------------------

    # cidadesData = ''
    # with open('HCFCidades.csv', newline='') as csvfile:
    #     cidadesData = list(csv.reader(csvfile))

    # commitCidadesData = ()
    # sql = ("INSERT INTO cidades "
    #     "(id, estado_id, latitude, longitude, nome) "
    #     "VALUES (%s, %s, %s, %s, %s)")
    
    # conexaoCidades = conexaoNova.getConexao()
    # for cidade in cidadesData:
    #     commitCidadesData = (cidade[0], cidade[1], cidade[2], cidade[3], cidade[4])
    #     databaseTeste.insertConteudoTabela("cidades", sql, commitCidadesData, conexaoCidades )

    # -----------------------Insere dados locais_coleta-------------------------------------

    # locais_coletaData = databaseAntiga.getConteudoTabela("local_coleta", "SELECT codigo, local, regiao_do_local, cidade FROM local_coleta")

    # tomboData = databaseAntiga.getConteudoTabela("tombo", "SELECT local_coleta, codigo_solo, codigo_relevo, codigo_vegetacao FROM tombo group by local_coleta;")

    # commitLocais_coletaData = ()
    # sql = ("INSERT INTO locais_coleta "
    #     "(id, descricao, solo_id, relevo_id, vegetacao_id, cidade_id, fase_sucessional_id, complemento, fase_numero) "
    #     "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)")
    # ## adicionar siglas de estado no banco e alterar a flag
    # cidadeLista = databaseTeste.getConteudoTabela("cidades", "select id, nome from cidades")
    # conexaoLocais_coleta = conexaoNova.getConexao()
    # for locais_coleta in locais_coletaData:
    #     for tombo in tomboData: #passa pelo tombo tentando encontrar as informacoes daquela coleta que se encontram no tombo
    #         if(tombo[0] == locais_coleta[0]):
    #             flag = 0  #essa flag garante que uma transacao nao sera feita para duas cidades com o mesmo nome
                
    #             #fazer funcao que devolve cidade
    #             for cidade in cidadeLista: # passa pela lista de cidades encontrando o id da cidade dessa coleta
    #                 if(flag == 0  and cidade[1] == locais_coleta[3]):
    #                     flag = 1
    #                     print(locais_coleta[0], locais_coleta[1] if locais_coleta[1] else "" + locais_coleta[2] if locais_coleta[2] else "", tombo[1], tombo[2], tombo[3], cidade[0])
    #                     commitLocais_coletaData = (locais_coleta[0], locais_coleta[1] if locais_coleta[1] else "" + locais_coleta[2] if locais_coleta[2] else "", tombo[1], tombo[2], tombo[3], cidade[0], None, None, None)
    #                     databaseTeste.insertConteudoTabela("locais_coleta", sql, commitLocais_coletaData, conexaoLocais_coleta )

    # # -----------------------Insere dados familias-------------------------------------------

    # familiasData = databaseAntiga.getConteudoTabela("familia", "SELECT cod_familia, familia FROM familia")

    # commitFamiliasData = ()
    # sql = ("INSERT INTO familias "
    #     "(id, nome, ativo) "
    #     "VALUES (%s, %s, %s)")  
    
    # conexaoFamilias = conexaoNova.getConexao()
    # for familias in familiasData:
    #     commitFamiliasData = (familias[0], familias[1], 1)
    #     databaseTeste.insertConteudoTabela("familias", sql, commitFamiliasData, conexaoFamilias )

    # # -----------------------Insere dados generos-------------------------------------------

    # generosData = databaseAntiga.getConteudoTabela("especie", "SELECT especie, cd_familia FROM especie")

    # commitgenerosData = ()
    # sql = ("INSERT INTO generos "
    #     "(id, nome, familia_id, ativo) "
    #     "VALUES (%s, %s, %s, %s)")  
    
    # conexaogeneros = conexaoNova.getConexao()
    # id = 0
    # for generos in generosData:
    #     id += 1
    #     commitgenerosData = (id, generos[0], generos[1], 1)
    #     databaseTeste.insertConteudoTabela("generos", sql, commitgenerosData, conexaogeneros )

    # -----------------------Insere dados autores-------------------------------------------
    
    # adicionar autores de variedade
    # adicionar autores de subespecie

    # autoresData = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct especie_especie_autor FROM hcfteste.tombo")

    # commitAutoresData = ()
    # sql = ("INSERT INTO autores "
    #     "(id, nome, iniciais, ativo) "
    #     "VALUES (%s, %s, %s, %s)")  
    
    # conexaoAutores = conexaoNova.getConexao()
    # id = 0
    # for autores in autoresData:
    #     if(autores[0] != None):
    #         id += 1
    #         nomePadronizado = padronizaNomeAutor(autores[0])
    #         iniciais = getIniciaisAutores(nomePadronizado)
    #         commitAutoresData = (id, nomePadronizado, iniciais, 1)
    #         databaseTeste.insertConteudoTabela("autores", sql, commitAutoresData, conexaoAutores )

    # -----------------------Insere dados especies-------------------------------------------

    especiesData = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct especie_especie_autor FROM hcfteste.tombo")

    commitEspeciesData = ()
    sql = ("INSERT INTO especies "
        "(id, nome, iniciais, ativo) "
        "VALUES (%s, %s, %s, %s)")  
    
    conexaoEspecies = conexaoNova.getConexao()
    id = 0
    for especies in especiesData:
        if(especies[0] != None):
            id += 1
            nomePadronizado = padronizaNomeAutor(especies[0])
            iniciais = getIniciaisespecies(nomePadronizado)
            commitEspeciesData = (id, nomePadronizado, iniciais, 1)
            databaseTeste.insertConteudoTabela("especies", sql, commitEspeciesData, conexaoEspecies )

    conexaoNova.closeConexao()
    conexaoAntiga.closeConexao()
if __name__ == "__main__":
    main()