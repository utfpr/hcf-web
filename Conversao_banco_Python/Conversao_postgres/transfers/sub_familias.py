def transferSubFamilies(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Sub-famílias! Aguarde...")    

    subFamiliaData = databaseAntiga.getConteudoTabela(
        "subfamilia", "SELECT cd_familiasub, subfamilia FROM subfamilia"
    )

    commitSubFamiliasData = ()
    sql = (
        "INSERT INTO sub_familias "
        "(id, nome, familia_id, autor_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s)"
    )  
    
    conexaoSubFamilias = conexaoNova.getConexao()
    id = 0

    for subFamilia in subFamiliaData:
        id += 1
        commitSubFamiliasData = (id, subFamilia[1], subFamilia[0], None, True)
        databaseNova.insertConteudoTabela("sub_familias", sql, commitSubFamiliasData, conexaoSubFamilias)

    print("Concluído!")
