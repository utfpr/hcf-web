/* eslint-disable max-len */
import request from 'request';
import throttledQueue from 'throttled-queue';
import tombos from '../tombos';
import { escreveLOG } from '../log';

const listCodBarra = [];

/* Consultar Caxambu
function hasModifiedReponseReflora(jsonResponseReflora) {
    if (jsonResponseReflora.result[0].modified === null) {
        return false;
    }
    return true;
}
*/

function processaRespostaReflora(nomeArquivo, codBarra, responseReflora) {
    escreveLOG(nomeArquivo, `Convertendo a resposta do código de barra {${codBarra}} para JSON`);
    /* Quando 'converte' ele formata o unicode */
    return JSON.parse(responseReflora);
}

function temResultadoRespostaReflora(respostaReflora) {
    if (respostaReflora.result.length === 0) {
        return false;
    }
    return true;
}

function temProblemaRespostaReflora(nomeArquivo, codBarra, conexao, error, response, body) {
    if (!error && response.statusCode === 200) {
        const respostaReflora = processaRespostaReflora(nomeArquivo, codBarra, body);
        listCodBarra.push(codBarra);
        if (temResultadoRespostaReflora(respostaReflora)) {
            escreveLOG(nomeArquivo, `O código de barra {${codBarra}} possui um resultado no Reflora`);
            tombos.comparaTombo(nomeArquivo, conexao, codBarra, respostaReflora);
            /* if (hasModifiedReponseReflora(responseReflora)) {
                escreveLOG(nomeArquivo, `O tombo de código de barra ${codBarra} tem modificações feitas no Reflora`);
                tombos.compareTombo(nomeArquivo, connection, codBarra, responseReflora);
            } else {
                escreveLOG(nomeArquivo, `O tombo de código de barra ${codBarra} não tem modificações feitas no Reflora`);
            } */
        } else {
            escreveLOG(nomeArquivo, `O código de barra {${codBarra}} não possui um resultado no Reflora`);
        }
    } else {
        listCodBarra.push(codBarra);
        escreveLOG(nomeArquivo, `Erro no código de barra {${codBarra}} que foi ${error}`);
    }
}
/*
function geraCodBarra(codBarra) {
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

function criaArrayCodBarra(nomeArquivo, maxCodBarra) {
    const arrayCodBarra = [];
    for (let i = 1; i <= maxCodBarra; i += 1) {
        const codBarra = geraCodBarra(i);
        if (codBarra === -1) {
            escreveLOG(nomeArquivo, `Erro na geração de código de barra {${codBarra}}`);
            process.exit(0);
        } else {
            arrayCodBarra.push(codBarra);
        }
    }
    escreveLOG(nomeArquivo, `Todos os códigos de barras {${maxCodBarra}} foram gerados com sucesso`);
    return arrayCodBarra;
}
*/
function existeCodBarra(codBarra) {
    for (let i = 0; i < listCodBarra.length; i += 1) {
        if (listCodBarra[i] === codBarra) {
            return true;
        }
    }
    return false;
}

function requisicaoReflora(nomeArquivo, conexao, maxCodBarra) {
    const throttle = throttledQueue(1, 1000);
    /* const arrayCodBarra = criaArrayCodBarra(nomeArquivo, maxCodBarra);
    while (arrayCodBarra.length !== 0) {
        const codBarra = arrayCodBarra.pop(); */
    const codBarra = 'HCF000026404';
    throttle(() => {
        request(`http://servicos.jbrj.gov.br/v2/herbarium/${codBarra}`, (error, response, body) => {
            escreveLOG(nomeArquivo, `Realizando a requisição do código de barra {${codBarra}}`);
            temProblemaRespostaReflora(nomeArquivo, codBarra, conexao, error, response, body);
            if (!existeCodBarra(codBarra)) {
                escreveLOG(nomeArquivo, `Não foi feita a requisição do código de barra {${codBarra}}`);
                // arrayCodBarra.push(codBarra);
            }
        });
    });
    // }
}

export default {
    requisicaoReflora,
};
