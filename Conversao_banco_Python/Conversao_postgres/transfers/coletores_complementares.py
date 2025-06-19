def transferComplementaryCollectors(conexaoAntiga, conexaoNova):
    print("Processando Complementares! Aguarde...")

    conexaoTombo = conexaoNova.getConexao()
    cursorNovo = conexaoTombo.cursor()

    sql_tombo_complementares = "SELECT hcf, complemento_coletor FROM tombo WHERE complemento_coletor IS NOT NULL AND complemento_coletor != ''"

    conexaoAntigaTombo = conexaoAntiga.getConexao()
    cursorAntigo = conexaoAntigaTombo.cursor()
    cursorAntigo.execute(sql_tombo_complementares)
    tombos_complementares = cursorAntigo.fetchall()

    sql_insert_coletor_complementar = "INSERT INTO coletores_complementares (hcf, complementares) VALUES (%s, %s)"

    for tombo in tombos_complementares:
        hcf, complemento_coletor = tombo
        cursorNovo.execute(sql_insert_coletor_complementar, (hcf, complemento_coletor.strip()))
        conexaoTombo.commit()

    cursorAntigo.close()
    cursorNovo.close()
    print("Complementares processados!")
