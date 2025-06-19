
from helpers.helpers import padronizaNomeAutor, unique, getIniciaisAutores

def transferAuthors(databaseAntiga, databaseNova, conexaoNova):
    print("Processando Autores! Aguarde...")
    
    autoresData = databaseAntiga.getConteudoTabela("tombo", "SELECT distinct especie_especie_autor FROM tombo union SELECT distinct especie_subspecie_autor FROM tombo union SELECT distinct especie_variedade_autor FROM tombo")
    
    nomePadronizado = [padronizaNomeAutor(autor[0]) for autor in autoresData if autor[0]]
    nomePadronizado = unique(list(set(nomePadronizado)))
    
    sql_select = "SELECT nome FROM autores WHERE nome = %s"
    sql_insert = ("INSERT INTO autores "
                  "(id, nome, iniciais, ativo) "
                  "VALUES (%s, %s, %s, %s)")  
    
    conexaoAutores = conexaoNova.getConexao()
    cursor = conexaoAutores.cursor()
    
    id = 0
    for autor in nomePadronizado:
        cursor.execute(sql_select, (autor,))
        resultado = cursor.fetchone()
        if resultado is None:
            id += 1
            iniciais = getIniciaisAutores(autor)
            commitAutoresData = (id, autor, iniciais, True)
            databaseNova.insertConteudoTabela("autores", sql_insert, commitAutoresData, conexaoAutores)
    
    cursor.close()
    print("Concluído!")