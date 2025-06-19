import re
import unicodedata

def normalizar_nome(nome: str) -> str:
    return ' '.join(nome.strip().split())

def transferIdentifiers(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Identificadores! Aguarde...")
    
    identificadorData = databaseAntiga.getConteudoTabela("identificador", "SELECT nome FROM identificador")

    sql = ("INSERT INTO identificadores (nome) VALUES (%s)")
    sql_check = ("SELECT COUNT(*) FROM identificadores WHERE nome = %s")

    conexaoIdentificador = conexaoNova.getConexao()
    cursor = conexaoIdentificador.cursor()

    for identificadores in identificadorData:
        identificadorSplit = re.split(r'\s*(?:&|;|,| e )\s*', identificadores[0])
        
        for identificador in identificadorSplit:
            identificador = normalizar_nome(identificador)
            cursor.execute(sql_check, (identificador,))
            
            if cursor.fetchone()[0] == 0:  # Se não existir o identificador
                commitIdentificadorData = (identificador,)
                databaseNova.insertConteudoTabela("identificadores", sql, commitIdentificadorData, conexaoIdentificador)

    cursor.close()
    print("Concluído!")