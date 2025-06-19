def transferTypes(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Tipos! Aguarde...")
    
    tipoData = databaseAntiga.getConteudoTabela("tipo", "SELECT cod_tipo, tp_descricao FROM tipo")

    commitTipoData = ()
    sql = ("INSERT INTO tipos "
           "(id, nome) "
           "VALUES (%s, %s)")  

    conexaoTipo = conexaoNova.getConexao()
    
    for tipo in tipoData:
        commitTipoData = (tipo[0], tipo[1])
        databaseNova.insertConteudoTabela("tipos", sql, commitTipoData, conexaoTipo)

    print("Concluído!")