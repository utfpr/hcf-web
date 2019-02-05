import database from './database';
import log from './log';

function hasPendenciesTombo(allAlterTombos) {
    /* for normal, porque o each não dava pra retornar false */
    for (let i = 0; i < allAlterTombos.length; i += 1) {
        if (allAlterTombos[i].status === 'ESPERANDO') {
            return true;
        }
    }
    return false;
}

function compareOrNoTombo(connection, numBarra) {
    database.select(connection, `SELECT status, tombo_json FROM ALTERACOES WHERE tombo_hcf=(SELECT tombo_hcf FROM tombos_fotos WHERE num_barra='${numBarra}')`, allAlterTombos => {
        if (!hasPendenciesTombo(allAlterTombos)) {
            // a
        }
    });
}

function proccessMaxCodBarra(fileName, maxCodBarra) {
    const newMaxCodBarra = maxCodBarra.replace('HCF', '');
    log.processMaxCodBarra(fileName);
    return parseInt(newMaxCodBarra);
}

export default {
    proccessMaxCodBarra, compareOrNoTombo,
};
