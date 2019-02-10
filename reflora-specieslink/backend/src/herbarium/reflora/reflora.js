import request from 'request';
import throttledQueue from 'throttled-queue';
import tombos from '../tombos';
import { writeFileLOG } from '../log';

const listCodBarra = [];

/*
function hasModifiedReponseReflora(jsonResponseReflora) {
    if (jsonResponseReflora.result[0].modified === null) {
        return false;
    }
    return true;
}
*/

function processResponseReflora(fileName, codBarra, responseReflora) {
    writeFileLOG(fileName, `Convertendo a resposta do código de barra ${codBarra} para JSON`);
    /* Quando 'converte' ele formata o unicode */
    return JSON.parse(responseReflora);
}

function hasResultResponseReflora(responseReflora) {
    if (responseReflora.result.length === 0) {
        return false;
    }
    return true;
}

function hasProblemResponseReflora(fileName, codBarra, connection, error, response, body) {
    if (!error && response.statusCode === 200) {
        const responseReflora = processResponseReflora(fileName, codBarra, body);
        if (hasResultResponseReflora(responseReflora)) {
            writeFileLOG(fileName, `O código de barra ${codBarra} possui um resultado no Reflora`);
            tombos.compareTombo(fileName, connection, codBarra, responseReflora);
            listCodBarra.push(codBarra);
            /* if (hasModifiedReponseReflora(responseReflora)) {
                writeFileLOG(fileName, `O tombo de código de barra ${codBarra} tem modificações feitas no Reflora`);
                tombos.compareTombo(fileName, connection, codBarra, responseReflora);
            } else {
                writeFileLOG(fileName, `O tombo de código de barra ${codBarra} não tem modificações feitas no Reflora`);
            } */
        } else {
            writeFileLOG(fileName, `O código de barra ${codBarra} não possui um resultado no Reflora`);
        }
    } else {
        writeFileLOG(fileName, `Erro no código de barra ${codBarra} que foi ${error}`);
    }
}

function generateCodBarra(codBarra) {
    const newCodBarra = 'HCF';
    if (codBarra < 10) {
        return `${newCodBarra}00000000${codBarra}`;
    }
    if (codBarra < 100) {
        return `${newCodBarra}0000000${codBarra}`;
    }
    if (codBarra < 1000) {
        return `${newCodBarra}000000${codBarra}`;
    }
    if (codBarra < 10000) {
        return `${newCodBarra}00000${codBarra}`;
    }
    if (codBarra < 100000) {
        return `${newCodBarra}0000${codBarra}`;
    }
    if (codBarra < 1000000) {
        return `${newCodBarra}000${codBarra}`;
    }
    if (codBarra < 10000000) {
        return `${newCodBarra}00${codBarra}`;
    }
    if (codBarra < 100000000) {
        return `${newCodBarra}0${codBarra}`;
    }
    if (codBarra < 1000000000) {
        return `${newCodBarra}${codBarra}`;
    }
    return -1;
}

function requestReflora(fileName, connection, maxCodBarra) {
    const throttle = throttledQueue(1, 1000);
    writeFileLOG(fileName, 'Inicializando o processo de requisição');
    for (let i = 1; i <= maxCodBarra; i += 1) {
        writeFileLOG(fileName, `Restam ${maxCodBarra - i} tombos para serem requisitados`);
        const codBarra = generateCodBarra(i);
        if (codBarra !== -1) {
            writeFileLOG(fileName, `Geração de código de barra ${codBarra} com sucesso`);
            throttle(() => {
                request(`http://servicos.jbrj.gov.br/v2/herbarium/${codBarra}`, (error, response, body) => {
                    writeFileLOG(fileName, `Realizando a requisição do código de barra ${codBarra}`);
                    hasProblemResponseReflora(fileName, codBarra, connection, error, response, body);
                    // eslint-disable-next-line no-console
                    console.log(listCodBarra.sort());
                });
            });
        } else {
            writeFileLOG(fileName, 'Problema na geração do código de barra');
        }
    }
}

export default {
    requestReflora,
};
