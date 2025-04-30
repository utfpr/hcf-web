import csv

def transferCountries(databaseNova, conexaoNova):
    print("Processando Países! Aguarde...")
    
    paisesData = ''
    with open('../Cidades_Estados_Paises/paises.csv', newline='', encoding="UTF-8") as csvfile:
        csvReader = csv.reader(csvfile, delimiter=';')
        next(csvReader)  # Pula o cabeçalho
        paisesData = list(csvReader)
    
    sql = ("INSERT INTO paises "
           "(id, nome, sigla) "
           "VALUES (%s, %s, %s)")
    
    sql_select = "SELECT nome FROM paises WHERE nome = %s"
    
    conexaoPaises = conexaoNova.getConexao()
    cursor = conexaoPaises.cursor()
    
    for pais in paisesData:
        cursor.execute(sql_select, (pais[2],))
        resultado = cursor.fetchone()
        cursor.fetchall()  # Limpa resultados pendentes
        
        if resultado is None:
            commitPaisesData = (pais[0], pais[2], pais[1])
            databaseNova.insertConteudoTabela("paises", sql, commitPaisesData, conexaoPaises)
    
    cursor.close()
    print("Concluído!")