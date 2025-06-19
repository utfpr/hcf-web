def transferFamilies(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Famílias! Aguarde...")
    
    familiasData = databaseAntiga.getConteudoTabela("familia", "SELECT cod_familia, familia FROM familia")
    
    sql = ("INSERT INTO familias "
           "(id, nome, ativo) "
           "VALUES (%s, %s, %s)")  
    
    conexaoFamilias = conexaoNova.getConexao()
    
    for familias in familiasData:
        commitFamiliasData = (familias[0], familias[1], True)
        databaseNova.insertConteudoTabela("familias", sql, commitFamiliasData, conexaoFamilias)
    
    print("Concluído!")