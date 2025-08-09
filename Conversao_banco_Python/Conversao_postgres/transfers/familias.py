def transferFamilies(databaseAntiga, databaseNova, conexaoNova):
    
    print("Criando dados: reinos")
    reinosData = [
        (1, 'Plantae'),
        (2, 'Fungi')
    ]
    print("Inserindo dados para tabela: reinos")
    sql = ("INSERT INTO reinos "
           "(id, nome) "
              "VALUES (%s, %s)")
    conexaoReinos = conexaoNova.getConexao()
    for reino in reinosData:
        commitReinosData = (reino[0], reino[1])
        databaseNova.insertConteudoTabela("reinos", sql, commitReinosData, conexaoReinos)
        
    print("Inserção concluída com sucesso")
    
    print("Processando Famílias! Aguarde...")
    
    familiasData = databaseAntiga.getConteudoTabela("familia", "SELECT cod_familia, familia FROM familia")
    
    sql = ("INSERT INTO familias "
           "(id, nome, ativo, reino_id) "
           "VALUES (%s, %s, %s, %s)")  
    
    conexaoFamilias = conexaoNova.getConexao()
    
    for familias in familiasData:
        commitFamiliasData = (familias[0], familias[1], True, 1) 
        databaseNova.insertConteudoTabela("familias", sql, commitFamiliasData, conexaoFamilias)
    
    print("Concluído!")