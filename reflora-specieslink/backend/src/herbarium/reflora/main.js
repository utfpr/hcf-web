import database from '../database';
import tombos from '../tombos';
import reflora from './reflora';

function main() {
    const connection = database.create();
    database.select(connection, 'SELECT MAX(num_barra) AS MAX FROM tombos_fotos', maxCodBarra => {
        const intMaxCodBarra = tombos.proccessMaxCodBarra(maxCodBarra[0].MAX);
        reflora.requestReflora(connection, intMaxCodBarra);
    });
}

main();
