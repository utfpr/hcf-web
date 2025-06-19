from helpers.helpers import buscaCidadeId

def transferLocationsCollection(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Locais Coleta! Aguarde...")
    
    locais_coletaData = databaseAntiga.getConteudoTabela("local_coleta", "SELECT codigo, local, regiao_do_local, cidade, estado, pais FROM local_coleta")
    
    sql = ("INSERT INTO locais_coleta "
           "(id, descricao, cidade_id, fase_sucessional_id, complemento, fase_numero) "
           "VALUES (%s, %s, %s, %s, %s, %s)")
    
    cidadeLista = databaseNova.getConteudoTabela("cidades", "SELECT id, nome, estado_id FROM cidades")
    estadoLista = databaseNova.getConteudoTabela("estado", "SELECT id, nome, sigla, pais_id FROM estados")
    paisLista = databaseNova.getConteudoTabela("pais", "SELECT id, nome, sigla FROM paises")
    
    conexaoLocais_coleta = conexaoNova.getConexao()
    
    for locais_coleta in locais_coletaData:
        cidadeId = buscaCidadeId(cidadeLista, estadoLista, paisLista, locais_coleta)
        commitLocais_coletaData = (
            locais_coleta[0],
            (locais_coleta[1] if locais_coleta[1] else "") + (locais_coleta[2] if locais_coleta[2] else ""),
            cidadeId, None, None, None
        )
        databaseNova.insertConteudoTabela("locais_coleta", sql, commitLocais_coletaData, conexaoLocais_coleta)
    
    print("Concluído!")