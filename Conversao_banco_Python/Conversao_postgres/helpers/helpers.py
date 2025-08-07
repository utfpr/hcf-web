
import csv
import re
import unicodedata

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
    
import re

def convertLatitude(latitude, tombo=0):
    if not latitude:
        return None

    original = latitude
    latitude = padronizaCoordenada(latitude)

    # Regex para encontrar latitude no formato: 18°21'39,1" S (ou com variantes)
    match = re.search(r"(\d+)[°º](\d+)?[′']?(\d+[.,]?\d*)?[″\"]?\s*([NS])", latitude)

    if not match:
        print(f"Formato de latitude inesperado: {tombo}: {original}")
        return None

    try:
        graus = float(match.group(1).replace(",", "."))
        minutos = float(match.group(2).replace(",", ".")) if match.group(2) else 0
        segundos = float(match.group(3).replace(",", ".")) if match.group(3) else 0
        direcao = match.group(4)

        resultado = graus + minutos / 60 + segundos / 3600

        if direcao == 'S':
            resultado *= -1

        return resultado
    except Exception as e:
        print(f"Erro ao converter latitude no tombo {tombo}: '{original}' → {e}")
        return None


def convertLongitude(longitude, tombo=0):
    if not longitude:
        return None

    original = longitude
    longitude = padronizaCoordenada(longitude)

    # Expressão regular para capturar padrões como: 52°21'27,4" W ou variantes
    match = re.search(r"(\d+)[°º](\d+)?[′']?(\d+[.,]?\d*)?[″\"]?\s*([WE])", longitude)

    if not match:
        print(f"Formato de longitude inesperado: {tombo}: {original}")
        return None

    try:
        graus = float(match.group(1).replace(",", "."))
        minutos = float(match.group(2).replace(",", ".")) if match.group(2) else 0
        segundos = float(match.group(3).replace(",", ".")) if match.group(3) else 0
        direcao = match.group(4)

        resultado = graus + minutos / 60 + segundos / 3600

        if direcao == 'W':
            resultado *= -1

        return resultado
    except Exception as e:
        print(f"Erro ao converter longitude no tombo {tombo}: '{original}' → {e}")
        return None

    
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
    with open('../Cidades_Estados_Paises/coordenadas.csv', newline='', encoding='UTF-8') as csvfile:
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
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='CTES - Herbário del Instituto de Botânica del Nordeste, Corrientes, Argentina' WHERE codigo=49;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='CVRD - Herbário da Reserva Natural Vale' WHERE codigo=19;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='EVB - Herbário Evaldo Buturra (UNILA)' WHERE codigo=43;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='FLOR - Herbário da Universidade Federal de Santa Catarina' WHERE codigo=18;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='FUEL - Herbário da Universidade Estadual de Londrina' WHERE codigo=11;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='G - Herbarium Genavense' WHERE codigo=16;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='HBR - Herbário Barbosa Rodrigues' WHERE codigo=54;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='HCF - Herbário da Universidade Tecnológica Federal do Paraná Campus Campo Mourão' WHERE codigo=2;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='IBGE - Herbário' WHERE codigo=3;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='HI - Herbário Integrado' WHERE codigo=5;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='HUEM - Herbário da Universidade Estadual de Maringá' WHERE codigo=21;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='ICN - Herbário da Universidade Federal do Rio Grande do Sul' WHERE codigo=10;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='MBM - Museu Botânico Municipal de Curitiba' WHERE codigo=1;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='MEXU - Herbario Nacional de Mexico' WHERE codigo=47;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='MO - Missouri Botanical Garden' WHERE codigo=52;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='RB - Herbário do Jardim Botânico do Rio de Janeiro' WHERE codigo=17;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='UNOP - Herbário da Universidade Estadual do Oeste do Paraná' WHERE codigo=14;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='UFPE - Laboratório Biologia de Briófitas' WHERE codigo=12;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='UNOP - Herbário da Universidade Estadual do Oeste do Paraná' WHERE codigo=13;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='UPCB - Herbário do Depto de Botânica da Universidade Federal do Paraná' WHERE codigo=4;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='VIC - Herbário da Universidade Federal de Viçosa' WHERE codigo=58;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='VIES - Herbário Central da Universidade Federal do Espírito Santo' WHERE codigo=44;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
    sqlAntiga = "UPDATE instituicao_identificadora SET nome_instituicao='INPA -  Herbário Instituto Nacional de Pesquisas da Amazônia' WHERE codigo=6;"
    databaseAntiga.insertConteudoTabela("Update Herbarios Antigos", sqlAntiga, commitHerbariosDataAntiga, conexaoHerbariosAntiga )
