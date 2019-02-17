/* eslint-disable max-len */
import request from 'request';
import throttledQueue from 'throttled-queue';
import Q from 'q';
import { comparaTombo } from '../tombos';
import { criaArrayCodBarra, existeCodBarra } from './codbarra';
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
            comparaTombo(nomeArquivo, conexao, codBarra, respostaReflora);
        } else {
            escreveLOG(nomeArquivo, `O código de barra {${codBarra}} não possui um resultado no Reflora`);
        }
    } else {
        listCodBarra.push(codBarra);
        escreveLOG(nomeArquivo, `Erro no código de barra {${codBarra}} que foi ${error}`);
    }
}

function requisicaoReflora(nomeArquivo, conexao, maxCodBarra) {
    const throttle = throttledQueue(1, 1000);
    const arrayCodBarra = criaArrayCodBarra(nomeArquivo, maxCodBarra);
    const promessa = Q.defer();
    while (arrayCodBarra.length !== 0) {
        const codBarra = arrayCodBarra.pop();
        // const codBarra = 'HCF000017702';
        throttle(() => {
            request(`http://servicos.jbrj.gov.br/v2/herbarium/${codBarra}`, (error, response, body) => {
                escreveLOG(nomeArquivo, `Realizando a requisição do código de barra {${codBarra}}`);
                temProblemaRespostaReflora(nomeArquivo, codBarra, conexao, error, response, body);
                if (!existeCodBarra(listCodBarra, codBarra)) {
                    escreveLOG(nomeArquivo, `Não foi feita a requisição do código de barra {${codBarra}}`);
                    // arrayCodBarra.push(codBarra);
                }
            });
        });
    }
    return promessa.promise;
}


async function doRequest(nomeArquivo, conexao, maxCodBarra) {
    await requisicaoReflora(nomeArquivo, conexao, maxCodBarra);
}

export default {
    doRequest,
};
