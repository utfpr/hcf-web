import database from '../database';
import queue from '../queue';

function main() {
    /* LOG console.log(dateTime.formatLog('Inicializando a integração com o Reflora.')); */

    /* LOG console.log(dateTime.formatLog('Estabelecendo uma conexão com o banco de dados.')); */
    const connection = database.createConnection();

    /* LOG console.log(dateTime.formatLog('Testando a conexão com o banco de dados.')); */
    database.testConnection(connection);

    /* LOG console.log(dateTime.formatLog('Fazendo o select e armazenando o número de tombo e o códgio de barra.')); */
    database.selectTombosFotos(connection).then(tombosFotos => {
        const queueTombos = queue.enqueue(tombosFotos);

        /**
         * Um tombo pode conter dois códigos de barra, porém ambos tem mesma informação,
         * apenas mudando o código de barra. Então eliminamos número de tombo iguais.
         */
        /* LOG console.log(dateTime.formatLog('Removendo número de tombos repetidos.')); */
        queue.removeTomboRepetido(queueTombos);

        /* LOG console.log(dateTime.formatLog('Perocorrendo a fila com os números de tombos.')); */
        queueTombos.forEach(tombo => {

            /* LOG console.log(dateTime.formatLog('Fazendo o select e verificando tombos alterados.')); */
            database.selectCountTombosAlteracao(connection, tombo.tombo_hcf).then(tombosAlterados => {

                /**
                 * Quando o tamanho é maior que zero, significa que tem tombos alterados
                 */
                if (tombosAlterados.length > 0) {
                    /**
                     * Então primeiramente eu vou comparar com as alterações que foram feitas
                     */
                    /**
                     * Então faço a requisição ao reflora, se der match com algumas das sugestões
                     * já paro e vou para o próximo tombo.
                     */
                    /**
                     * Depois de comparar com as sugestões feitas (caso não encontre), devo comparar com
                     * os valores da tabela de tombos. Mas como ele sai do if ele irá comparar com lá.
                     */
                }
                /**
                 * Caso contrário não foi alterado nenhum tombo, portanto só comparar com tabela de tombos
                 */
            });

        });

    });
}

main();

/**
 * Anotações
 * 1 - Verificar as coisas das horas
 */
