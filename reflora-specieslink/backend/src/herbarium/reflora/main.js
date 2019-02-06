import database from '../database';
import tombos from '../tombos';
import reflora from './reflora';
import { getFileName, writeFileLOG } from '../log';

function main() {
    const fileName = getFileName();
    writeFileLOG(fileName, 'Inicializando a aplicação do Reflora');

    const connection = database.createConnection(fileName);
    database.selectMaxNumBarra(connection, maxCodBarra => {
        const intMaxCodBarra = tombos.proccessMaxCodBarra(fileName, maxCodBarra);
        reflora.requestReflora(fileName, connection, intMaxCodBarra);
    });
}

main();
