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

        queue.removeTomboRepetido(queueTombos);

        queueTombos.forEach(element => {
            database.selectCountTombosAlteracao(connection, element.tombo_hcf, statusTombo => {
                /* Ou seja, existe alteração */
                if (statusTombo.length > 0) {
                    statusTombo.forEach(status => {
                        /* Se alteração for do tipo APROVADO ou REPROVADO */
                        if (status.status === 'APROVADO' || status.status === 'REPROVADO') {
                            // const a = 2 + 2;
                        }
                    });
                }
            });
        });
    });
}

main();

/* Se quiser parar de logar por no /config/database.js -> logging: false */
