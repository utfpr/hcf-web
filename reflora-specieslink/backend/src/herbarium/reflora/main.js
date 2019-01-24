import database from '../database';
import queue from '../queue';
import tombos from '../tombos';

function main() {
    /**
     * Cria uma conexão com o BD.
     */
    const connection = database.createConnection();

    /**
     * Testa a conexão com o BD
     */
    database.testConnection(connection);

    /**
     * Faz o select no BD na tabela de tombos_fots.
     */
    database.selectTombosFotos(connection).then(tombosFotos => {
        const queueTombos = queue.enqueueTombosFotos(tombosFotos);

        /**
         * Um tombo pode conter dois códigos de barra, porém ambos tem mesma informação,
         * apenas mudando o código de barra. Então eliminamos número de tombo iguais.
         * Após a execução dessa função teremos 296, dos 300.
         * Até pensei em usar o DISTINCT, porém eu ia ter que fazer consulta no BD para pegar
         * o código de barra, daquele tombo_hcf.
         */
        queue.removeTomboRepetido(queueTombos);

        queueTombos.forEach(element => {
            database.selectCountTombosAlteracao(connection, element.tombo_hcf).then(tombosAlterados => {
                tombos.checkSuggest(element.num_barra, tombosAlterados);
            });
        });
    });
}

main();

/**
 * Anotações
 * 1 - Programação automática e manual.
 */
