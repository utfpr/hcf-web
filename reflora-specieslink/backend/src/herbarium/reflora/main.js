import database from '../database';
import queue from '../queue';

function main() {
    /* LOG console.log(dateTime.formatLog('Inicializando a integração com o Reflora.')); */

    /* LOG console.log(dateTime.formatLog('Estabelecendo uma conexão com o banco de dados.')); */
    const connection = database.createConnection();

    /* LOG console.log(dateTime.formatLog('Testando a conexão com o banco de dados.')); */
    database.testConnection(connection);

    /* LOG console.log(dateTime.formatLog('Fazendo o select e armazenando o número de tombo e o códgio de barra.')); */
    database.selectTombosFotos(connection, tombosFotos => {
        const queueTombos = queue.enqueue(tombosFotos);

        /**
         * Um tombo pode conter dois códigos de barra, porém ambos tem mesma informação,
         * apenas mudando o código de barra. Então eliminamos número de tombo iguais.
         */
        /* LOG console.log(dateTime.formatLog('Removendo número de tombos repetidos.')); */
        queue.removeTomboRepetido(queueTombos);

        /* LOG console.log(dateTime.formatLog('Perocorrendo a fila com os números de tombos.')); */
        queueTombos.forEach(element => {

            /* LOG console.log(dateTime.formatLog('Fazendo o select e verificando tombos alterados.')); */
            database.selectCountTombosAlteracao(connection, element.tombo_hcf, statusTombo => {
                /* Quando o tamanho é maior que zero, significa que retornaram valores na consulta do BD */
                if (statusTombo.length > 0) {

                    /* LOG console.log(dateTime.formatLog('Perocorrendo o resultado da consulta.')); */
                    statusTombo.forEach(status => {
                        /* Se alteração for do tipo APROVADO ou REPROVADO, iremos comparar ela com a requisição e também com a da entidade tombo */
                        /* LOG console.log(dateTime.formatLog('Existe uma pendência do tipo APROVADO ou REPROVADO.')); */
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
/**
 * Anotações
 * 1 - Colocar comentários
 * 2 - Verificar as coisas das horas
 */
