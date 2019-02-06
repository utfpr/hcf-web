import database from './database';
import { writeFileLOG } from './log';

function compareTombo(fileName, connection, codBarra) {
    database.selectNroTomboNumBarra(connection, codBarra, nroTombo => {
        writeFileLOG(fileName, `O tombo do código de barra ${codBarra} é ${nroTombo[0].dataValues.tombo_hcf}`);
    });
}

function proccessMaxCodBarra(fileName, maxCodBarra) {
    const newMaxCodBarra = maxCodBarra.replace('HCF', '');
    writeFileLOG(fileName, `Processando o maior código de barra que é ${maxCodBarra}`);
    return parseInt(newMaxCodBarra);
}

export default {
    proccessMaxCodBarra, compareTombo,
};
