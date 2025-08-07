import csv

def transferStates(databaseNova, conexaoNova):
    print("Processando Estados! Aguarde...")
    
    estadosData = ''
    with open('../Cidades_Estados_Paises/estados.csv', newline='', encoding="UTF-8") as csvfile:
        csvReader = csv.reader(csvfile, delimiter=';')
        next(csvReader)  # Pula o cabeçalho
        estadosData = list(csvReader)
    
    sql = ("INSERT INTO estados "
           "(id, nome, sigla, codigo_telefone, pais_id) "
           "VALUES (%s, %s, %s, %s, %s)")
        
    conexaoEstados = conexaoNova.getConexao()
    
    for estado in estadosData:
        commitEstadosData = (estado[0], estado[2], estado[1], None, estado[3])
        databaseNova.insertConteudoTabela("estados", sql, commitEstadosData, conexaoEstados)
    
    print("Concluído!")