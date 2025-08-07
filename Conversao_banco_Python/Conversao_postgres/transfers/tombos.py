import re
from helpers.helpers import converteAltitude, convertLatitude, splitData, convertLongitude

def transferTombos(databaseAntiga, databaseNova, conexaoAntiga, conexaoNova):
    print("Processando Tombos! Aguarde...")

    tombosData = databaseAntiga.getConteudoTabela("tombo", "SELECT hcf, data_tombo, data_coleta, observacao, nomes_populares, num_coleta, latitude, longitude, altitude, tombo_instituicao, local_coleta, especie_variedade, tipo, especie_especie_2, codigo_familia, codigo_especie, tombo_familia_sub, especie_subspecie, nome_especie, vermelho, verde, azul, codigo_solo, codigo_relevo, codigo_vegetacao, data_identificacao, tombo_coletor FROM tombo")

    variedadesData = databaseNova.getConteudoTabela("variedades", "SELECT id, nome FROM variedades")
    especiesData = databaseNova.getConteudoTabela("especies", "SELECT id, nome FROM especies")
    especieData = databaseAntiga.getConteudoTabela("especie", "SELECT cd_familia, codigo_especie, especie FROM especie")
    generoData = databaseNova.getConteudoTabela("generos", "SELECT id, nome FROM generos")
    sub_familiasData = databaseNova.getConteudoTabela("sub_familias", "SELECT id, nome FROM sub_familias")
    sub_especiesData = databaseNova.getConteudoTabela("sub_especies", "SELECT id, nome FROM sub_especies")

    sql = ("INSERT INTO tombos "
           "(hcf, data_tombo, data_coleta_dia, observacao, nomes_populares, numero_coleta, latitude, longitude, "
           "altitude, entidade_id, local_coleta_id, variedade_id, tipo_id, data_identificacao_dia, data_identificacao_mes, data_identificacao_ano, situacao, especie_id, genero_id, "
           "familia_id, sub_familia_id, sub_especie_id, nome_cientifico, colecao_anexa_id, cor, data_coleta_mes, "
           "data_coleta_ano, solo_id, relevo_id, vegetacao_id, ativo, taxon, rascunho, coletor_id) "
           "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

    conexaoTombo = conexaoNova.getConexao()
    cursorNovo = conexaoTombo.cursor()
    conexaoAntigaTombo = conexaoAntiga.getConexao()
    cursorAntigo = conexaoAntigaTombo.cursor()

    coletor_id_map = {}

    sql_nome_coletor_antiga = "SELECT nome_coletor FROM coletor WHERE num_coletor = ?"
    sql_id_coletor_nova = "SELECT id FROM coletores WHERE nome = %s"

    for tombo in tombosData:
        dataSplit = str(tombo[2]).split('-') if tombo[2] else [None, None, None]

        variedadeFinal = next((variedade[0] for variedade in variedadesData if variedade[1] == tombo[11]), None)
        especieFinal = next((especie[0] for especie in especiesData if especie[1] == tombo[13]), None)
        generoFinal = next((genero[0] for especie in especieData if especie[0] == tombo[14] and especie[1] == tombo[15] for genero in generoData if especie[2] == genero[1]), None)
        sub_familiasFinal = next((subFamilia[0] for subFamilia in sub_familiasData if tombo[16] == subFamilia[1]), None)
        sub_especiesFinal = next((subEspecie[0] for subEspecie in sub_especiesData if tombo[17] == subEspecie[1]), None)

        corFinal = 1 if tombo[19] == 1 else 2 if tombo[20] == 1 else 3 if tombo[21] == 1 else None

        coletor_id = None
        if tombo[26]:
            tombo_coletor = tombo[26]
            if tombo_coletor in coletor_id_map:
                coletor_id = coletor_id_map[tombo_coletor]
            else:
                cursorAntigo.execute(sql_nome_coletor_antiga, (tombo_coletor,))
                nome_coletor = cursorAntigo.fetchone()
                if nome_coletor:
                    cursorNovo.execute(sql_id_coletor_nova, (nome_coletor[0],))
                    resultado = cursorNovo.fetchone()
                    if resultado:
                        coletor_id = resultado[0]
                        coletor_id_map[tombo_coletor] = coletor_id

        dataIdentificacao = re.split(r'[-/,.]', str(tombo[25])) if tombo[25] else []
        data_identificacao_dia, data_identificacao_mes, data_identificacao_ano = splitData(dataIdentificacao)

        commitTombosData = (
            tombo[0], tombo[1], dataSplit[2], tombo[3], tombo[4], tombo[5], convertLatitude(tombo[6], tombo[0]), 
            convertLongitude(tombo[7], tombo[0]), converteAltitude(tombo[8]), tombo[9], tombo[10], variedadeFinal, 
            tombo[12], data_identificacao_dia, data_identificacao_mes, data_identificacao_ano, 'REGULAR', especieFinal, 
            generoFinal, tombo[14], sub_familiasFinal, sub_especiesFinal, tombo[18], None, corFinal, dataSplit[1], 
            dataSplit[0], tombo[22], tombo[23], tombo[24], True, None, False, coletor_id
        )

        databaseNova.insertConteudoTabela("tombos", sql, commitTombosData, conexaoTombo)

    cursorAntigo.close()
    cursorNovo.close()
    print("Concluído!")
