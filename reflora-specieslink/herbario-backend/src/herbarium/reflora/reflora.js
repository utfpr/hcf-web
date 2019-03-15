/* eslint-disable max-len */
import request from 'request';
import Q from 'q';
import throttledQueue from 'throttled-queue';
import { escreveLOG } from '../log';
import {
    selectUmCodBarra,
    atualizaTabelaReflora,
} from '../database';

/**
 * Essa função converte o resultado da resposta que é string
 * para o formato JSON. Nessa conversão aparece os acentos presentes nas palavras.
 * @param {*} responseReflora, resposta com conteúdo do tombo presente no Reflora.
 */
export function processaRespostaReflora(responseReflora) {
    return JSON.parse(responseReflora);
}

export function temResultadoRespostaReflora(respostaReflora) {
    if (respostaReflora.result.length === 0) {
        return false;
    }
    return true;
}

function jsonTemErro(respostaReflora) {
    if (respostaReflora === '{"erro":"500","message":"Oops, something\'s gone wrong in server!"}') {
        return true;
    }
    return false;
}

export function salvaRespostaReflora(nomeArquivo, conexao, codBarra, error, response, body) {
    if (!error && response.statusCode === 200) {
        if (jsonTemErro(body)) {
            atualizaTabelaReflora(conexao, codBarra, body, 0);
        } else {
            atualizaTabelaReflora(conexao, codBarra, body, 1);
        }
    } else {
        escreveLOG(nomeArquivo, `Erro no código de barra {${codBarra}} que foi ${error}`);
    }
}

export function fazRequisicaoReflora(conexao, nomeArquivo) {
    const promessa = Q.defer();
    const throttle = throttledQueue(1, 1000);
    selectUmCodBarra(conexao).then(codBarra => {
        if (codBarra.length === 0) {
            promessa.resolve(true);
        } else {
            const getCodBarra = codBarra[0].dataValues.cod_barra;
            throttle(() => {
                request(`http://servicos.jbrj.gov.br/v2/herbarium/${getCodBarra}`, (error, response, body) => {
                    salvaRespostaReflora(nomeArquivo, conexao, getCodBarra, error, response, body);
                    promessa.resolve(fazRequisicaoReflora(conexao, nomeArquivo));
                });
            });
        }
    });
    return promessa.promise;
}

export default {

};
