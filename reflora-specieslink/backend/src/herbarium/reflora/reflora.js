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
    writeFileLOG(fileName, `Convertendo a resposta do código de barra {${codBarra}} para JSON`);
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
        listCodBarra.push(codBarra);
        if (hasResultResponseReflora(responseReflora)) {
            writeFileLOG(fileName, `O código de barra {${codBarra}} possui um resultado no Reflora`);
            tombos.compareTombo(fileName, connection, codBarra, responseReflora);
            /* if (hasModifiedReponseReflora(responseReflora)) {
                writeFileLOG(fileName, `O tombo de código de barra ${codBarra} tem modificações feitas no Reflora`);
                tombos.compareTombo(fileName, connection, codBarra, responseReflora);
            } else {
                writeFileLOG(fileName, `O tombo de código de barra ${codBarra} não tem modificações feitas no Reflora`);
            } */
        } else {
            writeFileLOG(fileName, `O código de barra {${codBarra}} não possui um resultado no Reflora`);
        }
    } else {
        listCodBarra.push(codBarra);        
        writeFileLOG(fileName, `Erro no código de barra {${codBarra}} que foi ${error}`);
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

function existCodBarra(codBarra) {
    for (let i = 0; i < listCodBarra.length; i += 1) {
        if (listCodBarra[i] === codBarra) {
            return true;
        }
    }
    return false;
}

function createArrayCodBarra(fileName, maxCodBarra) {
    const arrayCodBarra = [];
    for (let i = 1; i <= maxCodBarra; i += 1) {
        const codBarra = generateCodBarra(i);
        if (codBarra === -1) {
            writeFileLOG(fileName, `Erro na geração de código de barra {${codBarra}}`);
            process.exit(0);
        } else {
            arrayCodBarra.push(codBarra);
        }
    }
    writeFileLOG(fileName, `Todos os códigos de barras {${maxCodBarra}} foram gerados com sucesso`);
    return arrayCodBarra;
}

function requestReflora(fileName, connection, maxCodBarra) {
    const throttle = throttledQueue(1, 1000);
    const arrayCodBarra = createArrayCodBarra(fileName, maxCodBarra);
    while (arrayCodBarra.length !== 0) {
        const codBarra = arrayCodBarra.pop();
        // eslint-disable-next-line no-console
        console.log(codBarra);
        throttle(() => {
            request(`http://servicos.jbrj.gov.br/v2/herbarium/${codBarra}`, (error, response, body) => {
                writeFileLOG(fileName, `Realizando a requisição do código de barra {${codBarra}}`);
                hasProblemResponseReflora(fileName, codBarra, connection, error, response, body);
                if (!existCodBarra(codBarra)) {
                    writeFileLOG(fileName, `Não foi feita a requisição do código de barra {${codBarra}}`);
                    // arrayCodBarra.push(codBarra);
                }
            });
        });
    }
}

export default {
    requestReflora,
};
