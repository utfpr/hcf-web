def transferGenres(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Gêneros! Aguarde...")
    
    generosData = databaseAntiga.getConteudoTabela("especie", "SELECT especie, cd_familia FROM especie")
    
    sql = ("INSERT INTO generos "
           "(id, nome, familia_id, ativo) "
           "VALUES (%s, %s, %s, %s)")  
    
    conexaoGeneros = conexaoNova.getConexao()
    cursor = conexaoGeneros.cursor()
    
    id = 0
    for generos in generosData:
        id += 1
        commitGenerosData = (id, generos[0], generos[1], True)
        databaseNova.insertConteudoTabela("generos", sql, commitGenerosData, conexaoGeneros)
    
    cursor.close()
    print("Concluído!")