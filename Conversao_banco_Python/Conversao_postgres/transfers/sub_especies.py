from helpers.helpers import padronizaNomeAutor

def transferSubspecies(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Sub-espécies! Aguarde...")   

    tomboData = databaseAntiga.getConteudoTabela(
        "tombo", 
        "SELECT DISTINCT especie_subspecie as subEspecie, especie_subspecie_autor as autor_subEspecie, "
        "codigo_familia, codigo_especie, especie_especie_2 FROM tombo"
    )

    especieData = databaseAntiga.getConteudoTabela(
        "especie", "SELECT cd_familia, codigo_especie, especie FROM especie"
    )

    autorData = databaseNova.getConteudoTabela("autor", "SELECT id, nome FROM autores")
    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")
    especiesData = databaseNova.getConteudoTabela("especies", "SELECT id, nome FROM especies")

    commitSubEspeciesData = ()
    sql = (
        "INSERT INTO sub_especies "
        "(nome, especie_id, genero_id, familia_id, autor_id, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s)"
    )  
    
    conexaoSubEspecies = conexaoNova.getConexao()

    for tombo in tomboData:
        if tombo[0]:  # Verifica se há uma subespécie
            if tombo[1]:  # Insere quando subespécie tem um autor
                for autor in autorData:
                    if autor[1] == padronizaNomeAutor(tombo[1]):  # Verifica se o nome do autor bate com o do tombo
                        for especieNova in especiesData:
                            if especieNova[1] == tombo[4]:  # Procura ID da espécie gerada
                                for especie in especieData:
                                    if especie[0] == tombo[2] and especie[1] == tombo[3]:  # Procura o nome do gênero na tabela espécie
                                        for genero in generoData:  # Procura o ID do gênero pelo nome
                                            if especie[2] == genero[1]:
                                                commitSubEspeciesData = (tombo[0], especieNova[0], genero[0], tombo[2], autor[0], True)
                                                databaseNova.insertConteudoTabela("sub_especies", sql, commitSubEspeciesData, conexaoSubEspecies)
            else:  # Insere quando subespécie não tem um autor
                for especieNova in especiesData:
                    if especieNova[1] == tombo[4]:  # Procura ID da espécie gerada
                        for especie in especieData:
                            if especie[0] == tombo[2] and especie[1] == tombo[3]:  # Procura o nome do gênero na tabela espécie
                                for genero in generoData:  # Procura o ID do gênero pelo nome
                                    if especie[2] == genero[1]:
                                        commitSubEspeciesData = (tombo[0], especieNova[0], genero[0], tombo[2], None, True)
                                        databaseNova.insertConteudoTabela("sub_especies", sql, commitSubEspeciesData, conexaoSubEspecies)

    print("Concluído!")
