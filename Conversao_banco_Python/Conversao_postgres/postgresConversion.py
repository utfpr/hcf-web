import time
start_time = time.time()
import re
from modules.connection import Conexao
from modules.database import Database
from transfers import coletores, relevos, solos, vegetacoes, fase_sucessional, paises, estados, cidades, locais_coleta, familias, generos, autores, especies, variedades, sub_especies, sub_familias, herbarios, tipos, identificadores, tombos, coletores_complementares, tombos_identificadores, tombos_fotos, tipos_usuarios

# Criar conexão com o banco firebird existente
conexaoAntiga = Conexao()
conexaoAntiga.conexaoBancoFirebird('/firebird/data/HERBARIUM.GDB', 'SYSDBA', 'masterkey', True)

# Criar e conectar ao novo banco PostgreSQL
conexaoNova = Conexao()
conexaoNova.conexaoBancoPostgres(user="postgres", password="postgres", banco="hcf")

# Instanciar as bases de dados
databaseAntiga = Database("hcf_firebird", conexaoAntiga.getCursor())
databaseNova = Database("hcf_postgres", conexaoNova.getCursor())

cursor = conexaoNova.getCursor()
conexao = conexaoNova.getConexao()

# Verifica se o banco "hcf" já existe
cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'hcf'")
db_exists = cursor.fetchone() is not None  # Retorna True se o banco existir

# Se o banco existe, verificar se contém tabelas
table_count = 0
if db_exists:
    cursor.execute("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'")
    table_count = cursor.fetchone()[0]

# Caso o banco não exista ou esteja vazio, criar tabelas
if not db_exists or table_count == 0:
    if not db_exists:
        print("Banco de dados 'hcf' não encontrado. Criando banco e tabelas...")
    else:
        print("Banco 'hcf' encontrado, mas está vazio. Criando tabelas...")

    # Criar tabelas no PostgreSQL a partir do arquivo SQL
    with open("./tables/tabelasPostgres.sql", "r", encoding="UTF-8") as file:
        sql_script = file.read()

    # Dividir e limpar comandos SQL corretamente
    statements = [stmt.strip() for stmt in sql_script.split(";") if stmt.strip()]

    # Executar cada comando SQL dentro de uma única transação
    try:
        for statement in statements:
            match = re.search(r"CREATE TABLE (\w+)", statement, re.IGNORECASE)
            table_name = match.group(1) if match else "desconhecida"

            print(f"Criando tabela {table_name}...")
            cursor.execute(statement)
            print(f"Tabela {table_name} criada com sucesso!")

        # Confirma as alterações apenas uma vez
        conexao.commit()
    except Exception as e:
        print(f"Erro ao criar tabelas: {e}")
        conexao.rollback()  # Desfaz qualquer alteração em caso de erro
else:
    print("O banco de dados 'hcf' já existe e contém tabelas. Pulando criação.")

coletores.transferColectors(databaseAntiga, databaseNova, conexaoNova)
relevos.transferReliefs(databaseAntiga, databaseNova, conexaoNova)
solos.transferSoils(databaseAntiga, databaseNova, conexaoNova)
vegetacoes.transferVegetations(databaseAntiga, databaseNova, conexaoNova)
fase_sucessional.transferSuccessionPhase(databaseNova, conexaoNova)
paises.transferCountries(databaseNova, conexaoNova)
estados.transferStates(databaseNova, conexaoNova)
cidades.transferCities(databaseNova, conexaoNova)
locais_coleta.transferLocationsCollection(databaseAntiga, databaseNova, conexaoNova)
familias.transferFamilies(databaseAntiga, databaseNova, conexaoNova)
generos.transferGenres(databaseAntiga, databaseNova, conexaoNova)
autores.transferAuthors(databaseAntiga, databaseNova, conexaoNova)
especies.transferSpecies(databaseAntiga, databaseNova, conexaoNova)
variedades.transferVarieties(databaseAntiga, databaseNova, conexaoNova)
sub_especies.transferSubspecies(databaseAntiga, databaseNova, conexaoNova)
sub_familias.transferSubFamilies(databaseAntiga, databaseNova, conexaoNova)
herbarios.transferHerbarios(databaseAntiga, databaseNova, conexaoAntiga, conexaoNova)
tipos.transferTypes(databaseAntiga, databaseNova, conexaoNova)
identificadores.transferIdentifiers(databaseAntiga, databaseNova, conexaoNova)
tombos.transferTombos(databaseAntiga, databaseNova, conexaoAntiga, conexaoNova)
coletores_complementares.transferComplementaryCollectors(conexaoAntiga, conexaoNova)
tombos_identificadores.transferIdentifiersTombo(databaseAntiga, databaseNova, conexaoAntiga, conexaoNova)
tombos_fotos.transferTombosPhotos(databaseAntiga, databaseNova, conexaoNova)
tipos_usuarios.transferTypesUsers(databaseNova, conexaoNova)

end_time = time.time()
elapsed_time = (end_time - start_time)/60
print(f"Tempo de execução: {elapsed_time:.2f} minutos")

cursor.close()
conexaoAntiga.closeConexao()
conexaoNova.closeConexao()
