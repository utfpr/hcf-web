import database from '../database';
import queue from '../queue';

function main() {
    /* LOG console.log(dateTime.formatLog('Inicializando a integração com o Reflora.')); */

    /* LOG console.log(dateTime.formatLog('Estabelecendo uma conexão com o banco de dados.')); */
    const connection = database.createConnection();

    /* LOG console.log(dateTime.formatLog('Testando a conexão com o banco de dados.')); */
    database.testConnection(connection);

    database.selectTombosFotos(connection, tombosFotos => {
        const queueTombos = queue.enqueue(tombosFotos);

        queue.removeRepeat(queueTombos);

        // database.selectTombosAlteracao(connection, '19528');
        queueTombos.forEach(element => {
        // console.log(element.num_barra);
            database.selectCountTombosAlteracao(connection, element.tombo_hcf, countTomboAlterado => {
                // console.log(countTomboAlterado);
            });
        });
    });
}

main();
