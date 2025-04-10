import re

with open("Cidades_Estados_Paises/updated_cities_coordinates.sql", "r") as f:
    mysql_sql = f.read()

postgres_sql = ""
pattern = re.compile(
    r"""UPDATE\s+(?P<city_table>[\w\.]+)\s+(?P<city_alias>\w+)\s+
        JOIN\s+(?P<state_table>[\w\.]+)\s+(?P<state_alias>\w+)\s+ON\s+\2\.estado_id\s+=\s+\4\.id\s+
        SET\s+(?P<set_clause>.+?)\s+
        WHERE\s+(?P<where_clause>.+?);""",
    re.DOTALL | re.VERBOSE
)

for match in pattern.finditer(mysql_sql):
    pg_query = f"""UPDATE {match['city_table']} {match['city_alias']}
SET {match['set_clause']}
FROM {match['state_table']} {match['state_alias']}
WHERE {match['city_alias']}.estado_id = {match['state_alias']}.id AND {match['where_clause']};
"""
    postgres_sql += pg_query + "\n"

with open("Cidades_Estados_Paises/updated_cities_coordinates_pg.sql", "w") as f:
    f.write(postgres_sql)

print("Arquivo convertido para PostgreSQL com sucesso!")
