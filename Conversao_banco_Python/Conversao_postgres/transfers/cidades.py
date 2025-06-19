import csv
from helpers.helpers import get_state_name_by_id, get_coordinates_from_city

def transferCities(databaseNova, conexaoNova):
    print("Processando Cidades! Aguarde...")
    
    cidadesData = ''
    with open('../Cidades_Estados_Paises/municipios.csv', newline='', encoding='UTF-8') as csvfile:
        csvReader = csv.reader(csvfile, delimiter=';')
        # next(csvReader)  # Pula o cabeçalho
        cidadesData = list(csvReader)
    
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
    
    print("Concluído!")
    
    print("Corrigindo latitudes e longitudes de cidades")
    
    conexaoSql = conexaoNova.getConexao()
    cursorNova = conexaoSql.cursor()

    cursorNova.execute("SET search_path TO public;")
    
    with open('../Cidades_Estados_Paises/updated_cities_coordinates_pg.sql', 'r') as sql_file:
        sql_queries = sql_file.read()
    
    for query in sql_queries.split(';'):
        if query.strip():
            cursorNova.execute(query)
    
    conexaoSql.commit()
    print("Concluído!")