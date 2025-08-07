from helpers.helpers import padronizaNomeAutor

def transferSpecies(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Espécies! Aguarde...")
    
    tomboData = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct especie_especie_2 as especie, especie_especie_autor as autor_especie, codigo_familia, codigo_especie FROM tombo")
    especieData = databaseAntiga.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")
    autorData = databaseNova.getConteudoTabela("autor", "SELECT id, nome FROM autores")
    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")
    
    sql = ("INSERT INTO especies "
           "(nome, autor_id, genero_id, familia_id, ativo) "
           "VALUES (%s, %s, %s, %s, %s)")
    
    conexaoEspecies = conexaoNova.getConexao()
    
    for tombo in tomboData:
        if tombo[0]:
            autor_id = next((autor[0] for autor in autorData if autor[1] == padronizaNomeAutor(tombo[1])), None) if tombo[1] else None
            for especie in especieData:
                if especie[0] == tombo[2] and especie[1] == tombo[3]:
                    for genero in generoData:
                        if especie[2] == genero[1]:
                            commitEspeciesData = (tombo[0], autor_id, genero[0], tombo[2], True)
                            databaseNova.insertConteudoTabela("especies", sql, commitEspeciesData, conexaoEspecies)