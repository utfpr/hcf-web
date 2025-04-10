def transferReliefs(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Relevos! Aguarde...")
    
    relevosData = databaseAntiga.getConteudoTabela("relevo", "SELECT cod_relevo, tp_relevo FROM relevo")
    
    sql = ("INSERT INTO relevos "
           "(id, nome) "
           "VALUES (%s, %s)")
    
    sql_select = "SELECT nome FROM relevos WHERE nome = %s"
    
    conexaoRelevos = conexaoNova.getConexao()
    cursor = conexaoRelevos.cursor()
    
    for relevo in relevosData:
        cursor.execute(sql_select, (relevo[1],))
        resultado = cursor.fetchone()
        cursor.fetchall()  # Limpa resultados pendentes
        
        if resultado is None:
            commitRelevosData = (relevo[0], relevo[1])
            databaseNova.insertConteudoTabela("relevos", sql, commitRelevosData, conexaoRelevos)
    
    cursor.close()
    print("Concluído!")
