import csv

def transferStates(databaseNova, conexaoNova):
    print("Processando Estados! Aguarde...")
    
    estadosData = ''
    with open('Cidades_Estados_Paises/estados.csv', newline='', encoding="UTF-8") as csvfile:
        csvReader = csv.reader(csvfile, delimiter=';')
        next(csvReader)  # Pula o cabeçalho
        estadosData = list(csvReader)
    
    sql = ("INSERT INTO estados "
           "(id, nome, sigla, codigo_telefone, pais_id) "
           "VALUES (%s, %s, %s, %s, %s)")
    
    sql_select = "SELECT nome FROM estados WHERE nome = %s"
    
    conexaoEstados = conexaoNova.getConexao()
    cursor = conexaoEstados.cursor()
    
    for estado in estadosData:
        cursor.execute(sql_select, (estado[2],))
        resultado = cursor.fetchone()
        cursor.fetchall()  # Limpa resultados pendentes
        
        if resultado is None:
            commitEstadosData = (estado[0], estado[2], estado[1], None, estado[3])
            databaseNova.insertConteudoTabela("estados", sql, commitEstadosData, conexaoEstados)
    
    cursor.close()
    print("Concluído!")