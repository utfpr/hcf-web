docker exec -it dst-pg psql -U postgres -c 'DROP DATABASE newdb WITH (FORCE);'
docker exec -it dst-pg psql -U postgres -c 'CREATE DATABASE newdb;'

docker run --rm --network pgnet -v "$PWD:/work" \
  ghcr.io/dimitri/pgloader:latest pgloader /work/mysql_to_pg.load
