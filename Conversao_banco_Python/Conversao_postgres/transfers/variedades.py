from helpers.helpers import padronizaNomeAutor

def transferVarieties(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Variedades! Aguarde...")
    
    tomboData = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct especie_variedade as variedade, especie_variedade_autor as variedade_autor, codigo_familia, codigo_especie, especie_especie_2 FROM tombo")
    especieData = databaseAntiga.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")
    autorData = databaseNova.getConteudoTabela("autor", "SELECT id, nome FROM autores")
    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")
    especiesData = databaseNova.getConteudoTabela("especies", "SELECT id, nome FROM especies")
    
    sql = ("INSERT INTO variedades "
           "(nome, autor_id, especie_id, genero_id, familia_id, ativo) "
           "VALUES (%s, %s, %s, %s, %s, %s)")
    
    conexaoVariedades = conexaoNova.getConexao()
    
    for tombo in tomboData:
        if tombo[0]:
            autor_id = next((autor[0] for autor in autorData if autor[1] == padronizaNomeAutor(tombo[1])), None) if tombo[1] else None
            especie_id = next((especieNova[0] for especieNova in especiesData if especieNova[1] == tombo[4]), None)
            if especie_id:
                for especie in especieData:
                    if especie[0] == tombo[2] and especie[1] == tombo[3]:
                        for genero in generoData:
                            if especie[2] == genero[1]:
                                commitVariedadesData = (tombo[0], autor_id, especie_id, genero[0], tombo[2], True)
                                databaseNova.insertConteudoTabela("variedades", sql, commitVariedadesData, conexaoVariedades)
    
    print("Concluído!")
