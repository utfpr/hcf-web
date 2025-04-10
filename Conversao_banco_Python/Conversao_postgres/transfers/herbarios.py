from helpers.helpers import updateHerbariosFirebird


def transferHerbarios(databaseAntiga, databaseNova, conexaoAntiga, conexaoNova):
    print("Processando Herbários! Aguarde...")
    
    conexaoHerbariosAntiga = conexaoAntiga.getConexao()
    commitHerbariosDataAntiga = ()

    updateHerbariosFirebird(conexaoHerbariosAntiga, commitHerbariosDataAntiga, databaseAntiga)

    herbariosData = databaseAntiga.getConteudoTabela(
        "instituicao_identificadora", 
        "SELECT codigo, nome_instituicao FROM instituicao_identificadora"
    )

    commitHerbariosData = ()
    sql = (
        "INSERT INTO herbarios "
        "(id, nome, caminho_logotipo, sigla, email, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s)"
    )  
    
    conexaoHerbarios = conexaoNova.getConexao()

    for herbarios in herbariosData:
        nome = herbarios[1].replace(" - ", "-", 1)
        nomeSplit = nome.split('-', 1)
        
        if len(nomeSplit) > 1:
            commitHerbariosData = (herbarios[0], nomeSplit[1], None, nomeSplit[0], None, True)
        else:
            commitHerbariosData = (herbarios[0], nomeSplit[0], None, None, None, True)

        databaseNova.insertConteudoTabela("herbarios", sql, commitHerbariosData, conexaoHerbarios)

    print("Concluído!")
