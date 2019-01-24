# Para instalar foi o pip install mysqlclient --user
import MySQLdb
import verbose as v

HOST = 'localhost'
USER = 'root'
PASSWD = 'xxxx'
DATABASE = 'hcf'
verbose = False

def enableVerbose():
	global verbose
	verbose = True

def connection():
	if verbose:
		v.printCreateConnectionDatabase()
	return MySQLdb.connect(HOST, USER, PASSWD, DATABASE)

def getCursor(database):
	if verbose:
		v.printGetCursor()
	'''
		Cursor permite ter vários trabalhos por meio da mesma conexão do BD 
		http://www.mikusa.com/python-mysql-docs/cursor.html
	'''
	return database.cursor()

def query(cursor, query):
	if verbose:
		v.printQuery()
	cursor.execute(query)
	return cursor.fetchall()

def closeCursor(cursor):
	if verbose:
		v.printCloseCursor()
	cursor.close()

def closeConnection(database):
	if verbose:
		v.printCloseConnectionDatabase()
	database.cursor()

def close(database, cursor):
	if verbose:
		v.printCloseConnectionAndCursorDatabase()
	closeCursor(cursor)
	closeConnection(database)