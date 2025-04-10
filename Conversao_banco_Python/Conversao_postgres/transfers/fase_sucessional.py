def transferSuccessionPhase(databaseNova, conexaoNova):
    print("Processando Fase Sucessional! Aguarde...")
    
    fase_sucessionalData = [
        (1, '1º fase sucessão vegetal'), (2, '2º fase sucessão vegetal'), 
        (3, '3º fase ou capoeirinhia'), (4, '4º fase capoeira'), 
        (5, '5º fase capoeirão'), (6, '6º fase floresta secundária')
    ]
    
    sql = ("INSERT INTO fase_sucessional "
           "(numero, nome) "
           "VALUES (%s, %s)")
    
    sql_select = "SELECT nome FROM fase_sucessional WHERE nome = %s"
    
    conexaoFase_sucessional = conexaoNova.getConexao()
    cursor = conexaoFase_sucessional.cursor()
    
    for fase_sucessional in fase_sucessionalData:
        cursor.execute(sql_select, (fase_sucessional[1],))
        resultado = cursor.fetchone()
        cursor.fetchall()  # Limpa resultados pendentes
        
        if resultado is None:
            commitFase_sucessionalData = (fase_sucessional[0], fase_sucessional[1])
            databaseNova.insertConteudoTabela("fase_sucessional", sql, commitFase_sucessionalData, conexaoFase_sucessional)
    
    cursor.close()
    print("Concluído!")