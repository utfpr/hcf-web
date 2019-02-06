import fs from 'fs';
import moment from 'moment';

function getCurrentHour() {
    return moment().format('DD/MM/YYYY-HH:mm:ss');
}

export function getFileName() {
    /* Não funciona o barra / e : para criar arquivo */
    return moment().format('DD-MM-YYYY-HH-mm-ss');
}

export function writeFileLOG(fileName, message) {
    const pathFile = `logs/${fileName}.log`;
    const content = `[${getCurrentHour()}] ${message}\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}
