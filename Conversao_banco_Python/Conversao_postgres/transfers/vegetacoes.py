def transferVegetations(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Vegetações! Aguarde...")
    
    vegetacoesData = databaseAntiga.getConteudoTabela("vegetacao", "SELECT cod_vegetacao, tp_vegetacao FROM vegetacao")
    
    sql = ("INSERT INTO vegetacoes "
           "(id, nome) "
           "VALUES (%s, %s)")
    
    sql_select = "SELECT nome FROM vegetacoes WHERE nome = %s"
    
    conexaoVegetacoes = conexaoNova.getConexao()
    cursor = conexaoVegetacoes.cursor()
    
    for vegetacao in vegetacoesData:
        cursor.execute(sql_select, (vegetacao[1],))
        resultado = cursor.fetchone()
        cursor.fetchall()  # Limpa resultados pendentes
        
        if resultado is None:
            commitVegetacoesData = (vegetacao[0], vegetacao[1])
            databaseNova.insertConteudoTabela("vegetacoes", sql, commitVegetacoesData, conexaoVegetacoes)
    
    cursor.close()
    print("Concluído!")
