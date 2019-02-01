import json, subprocess, os, sys

''' Para importar os .py do diretório pai '''
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import verbose as v

verbose = False

def enableVerbose():
	global verbose
	verbose = True

def hasResultReflora(json):
	if len(json['result']) > 0:
		return True
	return False

def hasModifiedReflora(json):
	if json['result'][0]['modified'] == None:
		return False
	return True

def requestReflora(tomboCodBarra):
	if verbose:
		v.printBuildRequestReflora()
	request = "curl -s -X GET \"http://servicos.jbrj.gov.br/v2/herbarium/" + tomboCodBarra + "\" -H  \"Accept-Charset: ISO-8859-1,utf-8;accept: application/json\""

	if verbose:
		v.printDoRequest(tomboCodBarra)
	responseReflora = subprocess.check_output(request, shell=True) #, stderr=subprocess.STDOUT)

	if verbose:
		v.printDecodeEncodeResponse()
	resultEncode = responseReflora.decode('utf-8')
	resultEncode = resultEncode.encode('utf-8')
	
	if verbose:
		v.printLoadResponseJSON()
	jsonResultEncode = json.loads(resultEncode)
	
	return jsonResultEncode

def hasProblemResponseReflora(json):
	'''
		Tem que verificar, pois podemos ter o resultado com arranjo vazio 
		que significa que não foi publicado
	'''
	if hasResultReflora(json):

		if verbose:
			v.printCheckResponseModified()

		''' Verifica se o valor da chave modified é nulo '''
		if not hasModifiedReflora(json):
			return False
	else:
		if verbose:
			v.printArrayResponseIsEmpty()
			return True

	return True