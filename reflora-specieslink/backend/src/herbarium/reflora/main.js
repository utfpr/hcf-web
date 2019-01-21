// import wget from 'node-wget';
import tombos from '../tombos';
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
         * Após a execução dessa função teremos 296, dos 300
         */
        /* LOG console.log(dateTime.formatLog('Removendo número de tombos repetidos.')); */
        queue.removeTomboRepetido(queueTombos);

        /* LOG console.log(dateTime.formatLog('Perocorrendo a fila com os números de tombos.')); */
        queueTombos.forEach(tombo => {

            /* LOG console.log(dateTime.formatLog('Fazendo o select e verificando tombos alterados.')); */
            database.selectCountTombosAlteracao(connection, tombo.tombo_hcf).then(tombosAlterados => {

                /**
                 * Chamamos essa função para verificar se esse tombo tem pendência ou não
                 * Após a execução dessa função teremos 291, dos 300
                 */
                if (!tombos.temPendencia(tombosAlterados)) {
                    /**
                     * Quando o tamanho é maior que zero, significa que tem tombos alterados
                     * Detalhe que não dá para por junto com o if de cima, porque senão
                     * se o tombo tem pendência ele irá realizar a comparação.
                     */
                    if (tombosAlterados.length > 0) {
                        /**
                         * Então primeiramente eu vou comparar com as alterações que foram feitas
                         */
                        // const r = `http://servicos.jbrj.gov.br/v2/herbarium/${tombo.num_barra}`;
                        /* wget(r, (err, resp, body) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(body);
                            }
                        }); */
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
                     * Caso contrário não foi alterado nenhum tombo, portanto só comparar com tabela de tombos.
                     * Dos 300, 35 não tem pendências.
                     */

                }

            });

        });

    });
}

main();

/**
 * Anotações
 * 1 - Programação automática e manual.
 */
