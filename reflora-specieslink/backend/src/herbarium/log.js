import fs from 'fs';
// import path from 'path';
import moment from 'moment';

function getFileName() {
    /* Não funciona o barra / e : para criar arquivo */
    return moment().format('DD-MM-YYYY-HH-mm-ss');
}

function getCurrentHour() {
    return moment().format('DD/MM/YYYY-HH:mm:ss');
}

function startApplication(herbarium) {
    const fileName = `logs\\${getFileName()}.log`;
    const content = `[${getCurrentHour()}] Inicializando a aplicação do ${herbarium}`;
    fs.writeFile(fileName, content, err => {
        if (err) {
            // eslint-disable-next-line no-console
            console.log(err);
        }
    });
}

export default {
    startApplication,
};
