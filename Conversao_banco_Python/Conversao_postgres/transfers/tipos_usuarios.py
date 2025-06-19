def transferTypesUsers(databaseNova, conexaoNova):
    print("Inserindo tipos dos usuários")

    sql = ("INSERT INTO tipos_usuarios "
           "(id, tipo) "
           "VALUES (%s, %s)")  

    conexaoTipos_usuarios = conexaoNova.getConexao()
    
    tipos = ["CURADOR", "OPERADOR", "IDENTIFICADOR"]

    for i, tipo in enumerate(tipos, start=1):
        databaseNova.insertConteudoTabela("tipos_usuarios", sql, (i, tipo), conexaoTipos_usuarios)

    print("Concluído")
