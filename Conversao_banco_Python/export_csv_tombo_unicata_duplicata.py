# busca os tombos no firebird, ve um por um se o campo "obs_tommbo" comtem a palavra "unicata" ou "duplicata"
# se não houver a palavra, deixa como null

# o csv deve ter os campos:
# tombo, obs_tombo, tombo_tipo
import csv
import fdb

def conectar_firebird():
    return fdb.connect(
        host='127.0.0.1',
        database='./../firebird/data/HERBARIUM.GDB',
        user='SYSDBA',
        password='masterkey',
        charset='WIN1252'
    )
    
def export_csv_tombo_tombo_tipo():
    my_conn = conectar_firebird()
    my_cursor = my_conn.cursor()

    table = "tombo"
    
    my_cursor.execute(f"SELECT hcf, obs_tombo FROM {table} order by hcf")
    
    rows = my_cursor.fetchall()
    
    unicata_count = 0
    duplicata_count = 0
    
    # Abre o arquivo CSV para escrita
    with open('tombo_tipo.csv', 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['id', 'obs_tombo', 'tombo_tipo']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        # Escreve o cabeçalho do CSV
        writer.writeheader()
        
        for row in rows:
            hcf, obs_tombo = row
            tombo_tipo = None
                      
            if obs_tombo:
                if 'unicata' in obs_tombo.lower():
                    tombo_tipo = 'UNICATA'
                    unicata_count += 1
                elif 'duplicata' in obs_tombo.lower():
                    tombo_tipo = 'DUPLICATA'
                    duplicata_count += 1
                    
            if tombo_tipo:       
                writer.writerow({
                    'id': hcf,
                    'obs_tombo': obs_tombo,
                    'tombo_tipo': tombo_tipo
                })

    my_cursor.close()
    my_conn.close()
    print("tombos:" + str(len(rows)))
    print("unicatas e duplicatas exportadas: " + str(len(rows) - sum(1 for row in rows if not row[1] or ('unicata' not in row[1].lower() and 'duplicata' not in row[1].lower()))))
    print("Quantidade de unicatas: " + str(unicata_count))
    print("Quantidade de duplicatas: " + str(duplicata_count))
    print("Exportação concluída com sucesso.")
    
if __name__ == "__main__":
    export_csv_tombo_tombo_tipo()