import request from 'request';
import throttledQueue from 'throttled-queue';
// import tombos from '../tombos';
import log from '../log';

function processResponseReflora(fileName, numBarra, responseReflora) {
    log.processResponseReflora(fileName, numBarra);
    /* Quando 'converte' ele formata o unicode */
    return JSON.parse(responseReflora);
}

function hasResultResponseReflora(fileName, numBarra, responseReflora) {
    if (responseReflora.result.length === 0) {
        log.noResultResponseReflora(fileName, numBarra);
        return false;
    }
    log.hasResultResponseReflora(fileName, numBarra);
    return true;
}

function hasProblemResponseReflora(fileName, numBarra, connection, error, response, body) {
    if (!error && response.statusCode === 200) {
        const responseReflora = processResponseReflora(fileName, numBarra, body);
        if (hasResultResponseReflora(fileName, numBarra, responseReflora)) {
            // eslint-disable-next-line no-console
            console.log(body);
        }
    } else {
        log.errorResponseReflora(fileName, numBarra, error);
    }
}

function generateCodBarra(fileName, codBarra) {
    log.generateCodBarra(fileName, codBarra);
    if (codBarra < 10) {
        return `HCF00000000${codBarra}`;
    }
    if (codBarra < 100) {
        return `HCF0000000${codBarra}`;
    }
    if (codBarra < 1000) {
        return `HCF000000${codBarra}`;
    }
    if (codBarra < 10000) {
        return `HCF00000${codBarra}`;
    }
    if (codBarra < 100000) {
        return `HCF0000${codBarra}`;
    }
    if (codBarra < 1000000) {
        return `HCF000${codBarra}`;
    }
    if (codBarra < 10000000) {
        return `HCF00${codBarra}`;
    }
    if (codBarra < 100000000) {
        return `HCF0${codBarra}`;
    }
    if (codBarra < 1000000000) {
        return `HCF${codBarra}`;
    }
    log.generateCodBarra(fileName, -1);
    return -1;
}

function requestReflora(fileName, connection, maxCodBarra) {
    const throttle = throttledQueue(1, 10000);
    log.startRequestReflora(fileName);
    for (let i = 1; i <= maxCodBarra; i += 1) {
        const numBarra = generateCodBarra(fileName, i);
        if (numBarra !== -1) {
            throttle(() => {
                request(`http://servicos.jbrj.gov.br/v2/herbarium/${numBarra}`, (error, response, body) => {
                    log.requestReflora(fileName, i);
                    hasProblemResponseReflora(fileName, numBarra, connection, error, response, body);
                });
            });
        }
    }
}

export default {
    requestReflora,
};
