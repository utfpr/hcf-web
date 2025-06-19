def transferColectors(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Coletores! Aguarde...")
    
    coletorData = databaseAntiga.getConteudoTabela("coletor", "SELECT num_coletor, nome_coletor FROM coletor")
    coletorNumero = databaseAntiga.getConteudoTabela("tombo", "SELECT tombo_coletor, max(num_coleta) FROM tombo GROUP BY tombo_coletor;")

    commitColetorData = ()
    sql = ("INSERT INTO coletores "
           "(id, nome, email, numero, ativo) "
           "VALUES (%s, %s, %s, %s, %s)")
    
    sql_select = "SELECT nome FROM coletores WHERE nome = %s"
    
    conexaoColetor = conexaoNova.getConexao()
    cursor = conexaoColetor.cursor()
    idColetor = 0

    print(len(coletorData))

    # for coletor in coletorData:
    #     for numero in coletorNumero:
    #         if numero[0] == coletor[0]:
    #             cursor.execute(sql_select, (coletor[1],))
    #             resultado = cursor.fetchone()
    #             cursor.fetchall()  # Limpa resultados pendentes
    #             if resultado is None:
    #                 idColetor = coletor[0]
    #                 commitColetorData = (idColetor, coletor[1], None, numero[1], True)
    #                 databaseNova.insertConteudoTabela("coletores", sql, commitColetorData, conexaoColetor)
    
    for coletor in coletorData:
        max_coleta = None
        for numero in coletorNumero:
            if numero[0] == coletor[0]:
                max_coleta = numero[1]
                break
        
        idColetor = coletor[0]
        commitColetorData = (
            idColetor, 
            coletor[1], 
            None,  # Email está como None
            max_coleta, 
            True  # Ativo está como True
        )
        databaseNova.insertConteudoTabela("coletores", sql, commitColetorData, conexaoColetor)

    cursor.close()
    print("Concluído!")
