# Deploy do sistema


## Atualizando o repositório da aplicação

* Com acesso SSH ao servidor, entre no diretório `/home/herbario/hcf-web`.
* Atualize o repositório do sistema com o comando `git pull origin master`. (talvez seja necessários as credenciais).
* Entre o diretório `/home/herbario/hcf-web/Painel`.


## Deploy do Painel Web

Execute o comando `docker-compose up -d --build web`.

## Deploy da API

Execute o comando `docker-compose up -d --build app`.

---

Se quiser pode atualizar os dois ao mesmo tempo, executando o comando `docker-compose up -d --build app web`.

Aguarde o término da execução do comando e verifique se o serviço está funcionando corretamente.

Mais detalhes utilize o comando `docker ps`.

