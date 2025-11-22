#!/bin/bash

set -a
source "$(dirname "$0")/.env"
set +a

set -e 

echo "🧹 Removendo containers e imagens antigos..."
docker-compose down --rmi all

echo "🚀 Subindo containers em segundo plano..."
docker-compose up -d

echo "⏳ Aguardando Firebird iniciar (10s)..."
sleep 10

echo "📦 Restaurando backup .FBK para .GDB..."
docker exec -t hcf_firebird /scripts/restore-backup.sh

echo "✅ Backup restaurado com sucesso!"

echo "🛠️ Configurando permissões no MySQL..."
docker exec -i $MYSQL_HOST mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" <<EOF
CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$MYSQL_USER'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

echo "🔁 Reiniciando containers para aplicar permissões..."
docker-compose restart

echo "🔄 Aplicando updates no banco Firebird..."
docker exec -i hcf_firebird /usr/local/firebird/bin/isql -u "$FIREBIRD_USER" -p "$FIREBIRD_PASSWORD" -ch UTF8 "$FIREBIRD_DB_PATH" < ./scripts/update_data.sql

echo "🧹 Limpando tabelas existentes no MySQL..."
docker exec -i $MYSQL_HOST mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" hcf < ./scripts/dropTablesMySql.sql

echo "🐍 Executando script Python de conversão..."
docker exec -it hcf_firebird python3 conversao.py

echo "🎉 Processo concluído com sucesso!"
