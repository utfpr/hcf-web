import request from 'request';
import throttledQueue from 'throttled-queue';
// import tombos from '../tombos';

function processResponseReflora(responseReflora) {
    return JSON.parse(responseReflora);
}

function hasResultResponseReflora(responseReflora) {
    if (responseReflora.result.length === 0) {
        return false;
    }
    return true;
}

function hasProblemResponseReflora(error, response, body) {
    if (!error && response.statusCode === 200) {
        const responseReflora = processResponseReflora(body);
        if (hasResultResponseReflora(responseReflora)) {
            return false;
        }
    } else {
        // eslint-disable-next-line no-console
        console.log('ERRO');
        process.exit(0);
    }
    return true;
}

function generateCodBarra(codBarra) {
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
    return -1;
}

function requestReflora(connection, maxCodBarra) {
    const throttle = throttledQueue(1, 1000);
    for (let i = 1; i <= maxCodBarra; i += 1) {
        const numBarra = generateCodBarra(i);
        if (numBarra !== -1) {
            throttle(() => {
                request(`http://servicos.jbrj.gov.br/v2/herbarium/${numBarra}`, (error, response, body) => {
                    if (!hasProblemResponseReflora(error, response, body)) {
                        // eslint-disable-next-line no-console
                        console.log(`a${numBarra}`);
                        // tombos.compareOrNoTombo(connection, numBarra);
                    } else {
                        // eslint-disable-next-line no-console
                        console.log(`b${numBarra}`);
                    }
                });
            });
        }
    }
}

export default {
    requestReflora,
};
