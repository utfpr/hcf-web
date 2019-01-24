import tombos, queueTombos, database, reflora

def startVerbose():
	print('Inicializando a integração do HCF-Web com o Herbário Virtual Reflora')
	tombos.enableVerbose()
	queueTombos.enableVerbose()
	database.enableVerbose()
	reflora.enableVerbose()

''' Relacionado ao database '''
def printCreateConnectionDatabase():
	print('Cria e retorna a conexão com o BD')

def printGetCursor():
	print('Pega e retorna o cursor da conexão com o BD')

def printQuery():
	print('Realiza a consulta no BD e retorna os valores com base no SQL')

def printCloseCursor():
	print('Fechando a conexão do cursor do BD')

def printCloseConnectionDatabase():
	print('Fechando a conexão do BD')

def printCloseConnectionAndCursorDatabase():
	print('Fechando a conexão e o cursor do BD')

''' Relacionado ao queue '''
def printCreateQueue():
	print('Retorna uma fila criada')

def printQueryTombosFotos():
	print('Realiza a consulta no BD da tabela tombos_fotos')

def printQueueTombo(nroTombo):
	print('Enfilerando o tombo ' + str(nroTombo))

def printRepeatedTombo(nroTombo):
	print('O tombo ' + str(nroTombo) + ' é repetido')

''' reflora '''
def printBuildRequestReflora():
	print('Montando o comando para requisição do Reflora')

def printDoRequest(codBarra):
	print('Realizando a requisição ao Reflora do código de barra ' + codBarra)

def printDecodeEncodeResponse():
	print('Decodificando e codificando a resposta requisição')

def printLoadResponseJSON():
	print('Carregando a decodificação e retornando ela no formato de JSON')

''' tombos '''

def printQueryTomboHasPendencies(nroTombo):
	print('Realizando a consulta no BD do tombo ' + str(nroTombo) +' para verificiar a quantidade de alterações')

def printCheckPendenciesTombo(nroTombo):
	print('Verificando se o tombo ' + str(nroTombo) + ' tem alguma pendência')

def printPendenciesTombo(nroTombo):
	print('O tombo ' + str(nroTombo) + ' tem pendência')

def printPendenciesNotTombo(nroTombo):
	print('O tombo ' + str(nroTombo) + ' não tem nenhuma pendência')

def printSizeQueue(sizeQueue):
	print('Faltam ' + str(sizeQueue) + ' elementos da fila')

def printCheckArrayResponseEmpty():
	print('Verificando se o arranjo da requisição veio vazio')

def printArrayResponseIsEmpty():
	print('O arranjo da requisição veio vazio')

def printCheckResponseModified():
	print('Verificando se na resposta da requisição algum dado foi alterado')

def printCountPendenciesTombo():
	print('Verificando a quantidade de pendências de tombo')
