// import https from 'https';
// import got from 'got';
// import superagent from 'superagent';
// import request from 'request';
// import axios from 'axios';
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
                        /* HTTPS não deu certo sem sinal de vida 
                        https.get(r, resp => {
                            let body = '';
                            resp.on('data', d => {
                                body += d;
                            });
                            resp.on('end', () => {
                                const parsed = JSON.parse(body);
                                console.log(parsed);
                            });
                        }).on('error', err => {
                            console.log(`Error: ${err.message}`);
                        }); */
                        /* Faz a requisição porém intercala sucesso e problemas 
                        got(r).then(response => {
                            console.log(`a${response.body}`);
                        }).catch(error => {
                            console.log(`c${error.response.body}`);
                        });
                        */
                        /* Faz a requisição porém intercala sucesso e problemas */
                        /* superagent.get(r)
                            .end((err, res) => {
                                if (err) { console.log(`c${err}`); }
                                console.log(res.body.success);
                            });
                        */
                        /* Faz a requisição porém intercala sucesso e problemas */
                        /* request(r, { json: true }, (err, res, body) => {
                            if (err) { console.log(`c${err}`); }
                            // console.log(body.url);
                            // console.log(body.explanation);
                            console.log(body);
                            //console.log(tombo.num_barra)
                        }); */
                        /* Faz a requisição porém intercala sucesso e problemas - Maneira 1 
                        axios.all([axios.get(r)])
                            .then(axios.spread(response1 => {
                                console.log(response1.data.url);
                            })).catch(err => {
                                console.log(err);
                            }); */
                        /* Maneira 2 */
                        /* axios.get(r)
                            .then(response => {
                                console.log(response.data.url);
                                console.log(response.data.explanation);
                            })
                            .catch(error => {
                                console.log(error);
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
