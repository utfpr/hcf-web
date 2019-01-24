import queue
import verbose as v

verbose = False

def enableVerbose():
	global verbose
	verbose = True

def createQueue():
	if verbose:
		v.printCreateQueue()
	return queue.Queue()

def queueAndRemoveRepeatTombos(database, cursor):
	'''
		Para verificar quais números de tombos são repetidos
		SELECT * FROM (SELECT tombo_hcf, COUNT(*) AS count FROM tombos_fotos GROUP BY tombo_hcf  HAVING COUNT(*) > 1) AS T ORDER BY  T.tombo_hcf
	'''
	if verbose:
		v.printQueryTombosFotos()
	
	''' Ordenamos por tombo_hcf para conseguir remover os números de tombo repetido '''
	tombosFotos = database.query(cursor, 'SELECT * FROM TOMBOS_FOTOS ORDER BY tombo_hcf')
	
	q = createQueue()
	currentTomboHCF = -1
	
	for tombo in tombosFotos:
		
		if currentTomboHCF == -1:
			''' Esse caso acontece quando é o primeiro elemento da fila '''
			currentTomboHCF = tombo[1]
			q.put(tombo)
		
			if verbose:
				v.printQueueTombo(tombo[1])
		
		elif currentTomboHCF != tombo[1]:
			''' Esse caso acontece quando o número de tombo anterior é diferente ao atual '''
			currentTomboHCF = tombo[1]
			q.put(tombo)
	
			if verbose:
				v.printQueueTombo(tombo[1])

		else:
			''' Esse caso acontece quando o número de tombo anterior é igual ao atual '''
			if verbose:
				v.printRepeatedTombo(tombo[1])

	return q