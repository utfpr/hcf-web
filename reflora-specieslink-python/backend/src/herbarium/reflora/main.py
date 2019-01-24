import reflora
import os, sys

''' Para importar os .py do diretório pai '''
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import database, queueTombos, tombos, arguments

def main():
    ''' Cria conexão com BD e o cursor '''
    db = database.connection()
    cursor = database.getCursor(db)

    '''
        Cria a fila, enfilera o resultado da consulta e remove número de tombos repetidos
        Um tombo pode conter dois códigos de barra, porém ambos tem mesma informação,
        apenas mudando o código de barra.
    '''
    q = queueTombos.queueAndRemoveRepeatTombos(database, cursor)

    ''' É aqui que de fato vai acontecer percorrer a lista, realizar requsiições '''
    tombos.checkSuggestTombo(q, cursor)

    ''' Fecha a conexão do cursor e do BD '''
    database.close(db, cursor)

if __name__ == '__main__':
    arguments.checkArguments(sys.argv)
    main()