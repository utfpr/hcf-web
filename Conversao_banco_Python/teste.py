import os
import fdb

connection = fdb.connect(
  host='127.0.0.1', database='/firebird/data/HERBARIUM.GDB',
  user='SYSDBA', password=os.getenv('ISC_PASSWORD')
)

cursor = connection.cursor()

cursor.execute('SELECT COUNT(1) FROM TOMBO')

print(cursor.fetchall())