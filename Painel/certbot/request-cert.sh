#!/bin/sh

echo "Tenha certeza de que os dominios que deseja adicionar estejam no arquivo \"$1.txt\" um em cada linha"
read -p 'Pressione ENTER para continuar '


domain_list=$(sed '/^\s*$/d' "$1.txt" | tr '\n' ',')
domain_list=${domain_list::-1}

certbot certonly --webroot -w /var/www/html --cert-name "$1" -d "$domain_list"

