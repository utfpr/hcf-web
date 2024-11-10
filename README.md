# hcf-web

Sistema de Controle de Coleções de Herbário (HCF-WEB UTFPR-CM)

## Sumário

- [Deploy](Painel/deploy.md)

- [Integração do HCF-Web](Painel/herbario-backend/src/herbarium/LEIAME.md)

---

## Configuração do CapRover

### ⚠️ ATENÇÃO ⚠️

NUNCA habilite "Force HTTPS" nas configurações globais do CapRover (Dashboard > CapRover Root Domain Configurations). Isso causa um problema de redirecionamento infinito.

---

```shell
ln -s captain.hcf.cm.utfpr.edu.br captain.server.hcf.cm.utfpr.edu.br
```

```json
// file: /captain/data/config-override.json
{
  "skipVerifyingDomains": "true",
  "certbotCertCommandRules": [
    {
      "domain": "captain.server.hcf.cm.utfpr.edu.br",
      "command": "certbot certonly --webroot -w ${webroot} -d captain.hcf.cm.utfpr.edu.br"
    },
    {
      "domain": "*",
      "command": "certbot certonly --webroot -w ${webroot} -d ${domainName}"
    }
  ]
}
```

### NGINX Reverse Proxy

- _New Domain: `captain.hcf.cm.utfpr.edu.br`_

```properties
UPSTREAM_HTTP_ADDRESS=http://captain-captain:3000
CLIENT_MAX_BODY_SIZE=256M
```

```diff
...
        # IMPORTANT!! If you are here from an old thread to set a custom port, you do not need to modify this port manually here!!
        # Simply change the Container HTTP Port from the dashboard HTTP panel
        set $upstream http://<%-s.localDomain%>:<%-s.containerHttpPort%>;

+       location /grafana/ {
+           proxy_set_header Host $host;
+           proxy_set_header X-Real-IP $remote_addr;
+           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
+           proxy_set_header X-Forwarded-Proto $scheme;
+           proxy_pass http://srv-captain--grafana:3000/;
+       }

        location / {


	<%
	if (s.redirectToPath) {
	%>
	    return 302 <%-s.redirectToPath%>$request_uri;
	<%
	} else {
	%>
...
```

- New Domain: captain.hcf.cm.utfpr.edu.br

## Conversão do Firebird para MySQL

### Restauração do backup

Você precisa de um arquivo `.fbk` gerado a partir do banco de dados original. Você pode fazer isso com o comando abaixo:

```powershell
gbak.exe -USER <user> -PASSWORD <password> -TRANSPORTABLE -VERIFY -BACKUP_DATABASE <database file> <backup file>
```

O executável `gbak.exe` geralmente fica dentro do diretório `bin` juntamente com outros executáveis onde o servidor Firebird está instalado.

Com o arquivo `.fbk`, é hora de restaurar os dados no banco de dados Firebird dentro do Docker.

Coloque o arquivo de backup dentro do diretório `Conversao_banco_Python/firebird/backup` como o nome `HERBARIUM.FBK`.

Entre no diretório `Conversao_banco_Python`, execute o comando `docker-compose up --build firebird`, isso irá subir um servidor Firebird com alguns utilitários num container Docker.

Uma vez que o container está em pé, abra outro terminal e digite o comando `docker exec -t firebird /scripts/restore-backup.sh` e aguarde o processo ser concluído.

---

## Backup e restauração de banco de dados Firebird no Windows

```powershell
gbak.exe -USER SYSDBA -PASSWORD masterkey -TRANSPORTABLE -VERIFY -BACKUP_DATABASE C:\Program_Files\Firebird\Firebird_2_5\HERBARIUM_2024-03-26.GDB C:\Users\Edvaldo\Documents\HERBARIUM_2024-03-26.FBK
gbak.exe -USER SYSDBA -PASSWORD masterkey -TRANSPORTABLE -VERIFY -REPLACE_DATABASE C:\Users\Edvaldo\Documents\HERBARIUM_2024-03-26.FBK C:\Program_Files\Firebird\Firebird_2_5\HERBARIUM_2023-09-03.GDB
```
