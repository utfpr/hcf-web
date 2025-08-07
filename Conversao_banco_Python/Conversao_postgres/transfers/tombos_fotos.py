def transferTombosPhotos(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Tombos Fotos! Aguarde...")

    tombos_fotosData = databaseAntiga.getConteudoTabela("tombo_exsicata", "SELECT num_tombo, sequencia, cod_barra, num_barra FROM tombo_exsicata")

    # Identificando os tombos com sequência > 1
    tombos_com_sequencia = set()
    for tombos_fotos in tombos_fotosData:
        if tombos_fotos[1] > 1:
            tombos_com_sequencia.add(tombos_fotos[0])

    commitTombos_fotosData = ()
    sql = ("INSERT INTO tombos_fotos "
        "(tombo_hcf, codigo_barra, num_barra, caminho_foto, em_vivo, sequencia, ativo) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s)")  

    conexaoTombos_fotos = conexaoNova.getConexao()

    for tombos_fotos in tombos_fotosData:
        if tombos_fotos[0] != 0:
            if tombos_fotos[0] in tombos_com_sequencia:
                caminho_foto = f"{tombos_fotos[2]}_{tombos_fotos[1]}.JPG"
            else:
                caminho_foto = f"{tombos_fotos[2]}.JPG"

            commitTombos_fotosData = (tombos_fotos[0], tombos_fotos[2], tombos_fotos[3], caminho_foto, True, tombos_fotos[1], True)
            databaseNova.insertConteudoTabela("tombos_fotos", sql, commitTombos_fotosData, conexaoTombos_fotos)
        else: 
            print(f"Tombo {tombos_fotos[0]} não inserido, pois é zero.")
            print(f"Dados: {tombos_fotos}")

    print("Concluído!")
