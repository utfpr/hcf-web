#!/bin/bash

set -e  # Para o script se qualquer comando falhar

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
docker exec -i hcf_mysql mysql -u root -pTest@123 <<EOF
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'Test@123';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

echo "🔁 Reiniciando containers para aplicar permissões..."
docker-compose restart

echo "🔄 Aplicando updates no banco Firebird..."
docker exec -i hcf_firebird /usr/local/firebird/bin/isql -u SYSDBA -p masterkey -ch UTF8 /firebird/data/HERBARIUM.GDB < ./scripts/update_data.sql

echo "🧹 Limpando tabelas existentes no MySQL..."
docker exec -i hcf_mysql mysql -u root -pTest@123 hcf < ./scripts/dropTablesMySql.sql

echo "🐍 Executando script Python de conversão..."
docker exec -it hcf_firebird python3 conversao.py

echo "🎉 Processo concluído com sucesso!"
