import database, reflora, verbose as v

verbose = False

def enableVerbose():
	global verbose
	verbose = True

'''
	Chamamos essa função para verificar se esse tombo tem pendência ou não
	Quando o valor retornando é None significa que tem pendência, caso contrário
	é retornado a lista
'''
def hasAndCountPendencies(cursor, nroTombo):
	if verbose:
		v.printQueryTomboHasPendencies(nroTombo)
	alteracoesTombo = database.query(cursor, 'SELECT status, COUNT(*) AS count FROM alteracoes WHERE tombo_hcf=' + str(nroTombo) + ' GROUP BY status')

	for alteracoes in alteracoesTombo:
		if verbose:
			v.printCheckPendenciesTombo(nroTombo)
		if alteracoes[0] == 'ESPERANDO' :
			if verbose:
				v.printPendenciesTombo(nroTombo)
			return None

	if verbose:
		v.printPendenciesNotTombo(nroTombo)
	return alteracoesTombo

def checkSuggestTombo(q, cursor):
	counta = 0
	countb = 0
	while not q.empty():
		if verbose:
			v.printSizeQueue(q.qsize())
		checkTombo = q.get()
		
		''' Índice um é que é o número de tombo '''
		countStatusPendenciesOfTombo = hasAndCountPendencies(cursor, checkTombo[1])
		if countStatusPendenciesOfTombo != None:
		   
			''' Índice três é o código de barra '''
			jsonTomboReflora = reflora.requestReflora(checkTombo[3])

			if verbose:
				v.printCheckArrayResponseEmpty()

			if not reflora.hasProblemResponseReflora(jsonTomboReflora):
				'''
					Após passar por essa condição, no nosso caso só será feito de 256
					Então primeiramente eu vou comparar com as alterações que foram feitas
				'''
				if verbose:
					v.printCountPendenciesTombo()
				if len(countStatusPendenciesOfTombo) > 0:
					''' a '''
					counta = counta + 1
				else:
					''' b '''
					countb = countb + 1

				
	print('counta: '+str(counta))
	print('countb: '+str(countb))