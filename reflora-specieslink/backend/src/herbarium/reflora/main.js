import database from '../database';
import tombos from '../tombos';
import reflora from './reflora';
import log from '../log';

function main() {
    const fileName = log.getFileName('Reflora');
    const connection = database.create(fileName);
    database.select(fileName, connection, database.selectMaxNumBarra, maxCodBarra => {
        const intMaxCodBarra = tombos.proccessMaxCodBarra(fileName, maxCodBarra[0].MAX);
        reflora.requestReflora(fileName, connection, intMaxCodBarra);
    });
}

main();
