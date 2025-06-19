import re
import unicodedata

def normalizar_nome(nome: str) -> str:
    return ' '.join(nome.strip().split())

def transferIdentifiersTombo(databaseAntiga, databaseNova, conexaoAntiga, conexaoNova):
    print("Processando Identificadores Tombo! Aguarde...")

    tombos_identificadorData = databaseAntiga.getConteudoTabela("tombo", "SELECT hcf, tombo_identificador FROM tombo")

    # SQL para inserção na nova tabela de relação
    sql_insert = ("INSERT INTO tombos_identificadores "
                "(identificador_id, tombo_hcf, ordem) "
                "VALUES (%s, %s, %s)")

    # SQL para buscar o nome do identificador na base antiga
    sql_get_nome_identificador_antigo = ("SELECT nome FROM identificador WHERE num_identificador = ?")

    # SQL para buscar o identificador_id pelo nome na base nova
    sql_get_identificador_novo = ("SELECT id FROM identificadores WHERE nome = %s")

    conexaoIdentificadorTombo = conexaoNova.getConexao()
    conexaoIdentificadorTomboAntigo = conexaoAntiga.getConexao()
    cursorNova = conexaoIdentificadorTombo.cursor()
    cursorAntiga = conexaoIdentificadorTomboAntigo.cursor()
    
    for tombo in tombos_identificadorData:
        hcf = tombo[0]
        identificador_antigo_id = tombo[1]

        cursorAntiga.execute(sql_get_nome_identificador_antigo, (identificador_antigo_id,))
        result = cursorAntiga.fetchone()
        if result:
            identificadores_nomes = re.split(r'\s*(?:&|;|,| e )\s*', result[0])
            
            for ordem, identificador_nome in enumerate(identificadores_nomes, 1):
                identificador_nome = normalizar_nome(identificador_nome.strip())

                cursorNova.execute(sql_get_identificador_novo, (identificador_nome,))
                resultado = cursorNova.fetchone()

                try:
                    identificador_id_novo = resultado[0]
                except Exception as e:
                    print(f"Erro inesperado ao tentar obter id do identificador '{identificador_nome}': {e}")
                    continue

                try:
                    databaseNova.insertConteudoTabela("tombos_identificadores", sql_insert, (identificador_id_novo, hcf, ordem), conexaoIdentificadorTombo)
                except Exception as e:
                    print(f"Erro ao inserir tombos_identificadores para '{identificador_nome}' com tombo_hcf {hcf}: {e}")


    cursorAntiga.close()
    cursorNova.close()
    print("Concluído!")
