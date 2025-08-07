def transferSoils(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Solos! Aguarde...")
    
    solosData = databaseAntiga.getConteudoTabela("solo", "SELECT cod_solo, tp_solo FROM solo")
    
    sql = ("INSERT INTO solos "
           "(id, nome) "
           "VALUES (%s, %s)")
    
    sql_select = "SELECT nome FROM solos WHERE nome = %s"
    
    conexaoSolos = conexaoNova.getConexao()
    cursor = conexaoSolos.cursor()
    
    for solos in solosData:
        cursor.execute(sql_select, (solos[1],))
        resultado = cursor.fetchone()
        cursor.fetchall()  # Limpa resultados pendentes
        
        if resultado is None:
            commitSolosData = (solos[0], solos[1])
            databaseNova.insertConteudoTabela("solos", sql, commitSolosData, conexaoSolos)
    
    cursor.close()
    print("Concluído!")