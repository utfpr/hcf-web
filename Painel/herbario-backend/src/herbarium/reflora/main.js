// const dateTime = require('../currentdatetime');
const database = require('../database');
const queue = require('../queue');

function main() {
    /* Para gerar um log é necessário criar um arquivo */
    /* LOG - Inicializando a integração com o reflora */
    // console.log(dateTime.getCurrentDateTime('Inicializando a integração com o Reflora.'));

    /* LOG - Estabelecendo uma conexão com o BD */
    // console.log(dateTime.getCurrentDateTime('Estabelecendo uma conexão com o banco de dados.'));
    const connection = database.create();

    /* LOG - Estabelecendo uma conexão com o BD */
    // console.log(dateTime.getCurrentDateTime('Testando a conexão com o banco de dados.'));
    database.test(connection);

    /* LOG - Estabelecendo uma conexão com o BD */
    // console.log(dateTime.getCurrentDateTime('Estabelecendo uma conexão com o banco de dados.'));
    database.select(connection, 'SELECT * FROM tombos_fotos',
        /* Através do callback vem o valor do retorno da consulta */
        /* LOG - Armazenando resultado da consulta ao banco de dados */
        // console.log(dateTime.getCurrentDateTime('Armazenando resultado da consulta ao banco de dados.'));
        result => {
            /* LOG - Enfilerando os resultados da busca em uma fila */
            // console.log(dateTime.getCurrentDateTime('Enfilerando os resultados da busca em fila.'));
            const queueItems = queue.enqueue(result);

            /* LOG - Removendo elementos repetidos dessa fila baseado no número de tombo */
            // console.log(dateTime.getCurrentDateTime('Removendo elementos repetidos da fila baseado no número de tombo.'));
            queue.removeRepeat(queueItems);

            /* A partir daqui eu tenho que pegar o primeiro da fila e criar aquele comandinho básico */
            /* Executar esse comando e pegar o JSON */
            /* Verificar se é antes ou depois verificar se tem pendência ou não e blá blá blá */

        });

    /* LOG - Estabelecendo uma conexão com o BD */
    // console.log(dateTime.getCurrentDateTime('Tentando finalizar a conexão com o banco de dados.'));
    database.end(connection);
}

main();
/**
 * Detalhe do package.json:
 * script foi adicionado reflora para executar o código do reflora
 *e utilizando o nodemon que toda vez alterado ele executa automaticamente
 */
