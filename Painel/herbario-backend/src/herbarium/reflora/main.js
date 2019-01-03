// const dateTime = require('../currentdatetime');
const database = require('../database');

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

    const queue = [];

    /* LOG - Estabelecendo uma conexão com o BD */
    // console.log(dateTime.getCurrentDateTime('Estabelecendo uma conexão com o banco de dados.'));
    database.select(connection, 'SELECT * FROM tombos_fotos',
        /* Através do callback vem o valor do retorno da consulta */
        /* LOG - Armazendo resultado da consulta ao banco de dados */
        // console.log(dateTime.getCurrentDateTime('Armazenando resultado da consulta ao vanco de dados.'));
        result => {
            /* Percorro todos os valores retornados */
            result.forEach(element => {
                /* Adiciono na nossa fila */
                queue.push({ tombo_hcf: element.tombo_hcf, num_barra: element.num_barra });
            });

            /* Após enfilerar, é necessário verificar se existem com tombos repetidos */
            for (let i = 1; i < queue.length; i += 1) {
                let repeat = 0;
                queue.forEach(element => {
                    if (queue[i].tombo_hcf === element.tombo_hcf) {
                        repeat += 1;
                    }
                });
                if (repeat > 1) {
                    // console.log(queue[i]);
                    queue.splice(i, 1);
                    // console.log(queue.length);
                }
            }
            // console.log(queue.length);
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
