/* eslint-disable max-len */
import request from 'request';
import throttledQueue from 'throttled-queue';
import Q from 'q';
import { escreveLOG } from '../log';
import { selectUmCodBarra, atualizaTabelaReflora, contaNuloErroTabelaReflora } from '../database';

/* Quando 'converte' ele formata o unicode */
export function processaRespostaReflora(responseReflora) {
    return JSON.parse(responseReflora);
}

export function temResultadoRespostaReflora(respostaReflora) {
    if (respostaReflora.result.length === 0) {
        return false;
    }
    return true;
}

export function temProblemaRespostaReflora(nomeArquivo, conexao, codBarra, error, response, body) {
    if (!error && response.statusCode === 200) {
        atualizaTabelaReflora(conexao, codBarra, body);
    } else {
        escreveLOG(nomeArquivo, `Erro no código de barra {${codBarra}} que foi ${error}`);
    }
}

export function fazRequisicaoReflora(conexao, nomeArquivo, quantidadeCodBarra) {
    const throttle = throttledQueue(1, 4000);
    /* for (let i = 0; i < quantidadeCodBarra + 1; i += 1) {
        throttle(() => {
            selectUmCodBarra(conexao).then(codBarra => {
                const getCodBarra = codBarra[0].dataValues.cod_barra;
                request(`http://servicos.jbrj.gov.br/v2/herbarium/${getCodBarra}`, (error, response, body) => {
                    temProblemaRespostaReflora(nomeArquivo, conexao, getCodBarra, error, response, body);
                });
            });
        });
    } */
    const promessa = Q.defer();
    for (let i = 0, p = Promise.resolve(); i < quantidadeCodBarra + 1; i += 1) {
        p = p.then(_ => new Promise(resolve => {
            throttle(() => {
                /**
                 * Faz o select que usa o limit e retorna apenas com a condição
                 * Se o resultado da consulta for zero não tem o que fazer então já dá um resolve() na promessa
                 * Caso contrário pega o valor de código de barra e faz a requisição
                 * Com o resultado da requisição atualiza no BD
                 */
                selectUmCodBarra(conexao).then(codBarra => {
                    if (codBarra.length === 0) {
                        resolve();
                    }
                    const getCodBarra = codBarra[0].dataValues.cod_barra;
                    request(`http://servicos.jbrj.gov.br/v2/herbarium/${getCodBarra}`, (error, response, body) => {
                        temProblemaRespostaReflora(nomeArquivo, conexao, getCodBarra, error, response, body);
                        resolve();
                    });
                });
            });
        }));
        p = p.then(_ => new Promise(resolve => {
            /**
             * Se verificou que está na última iteração, faz um select verificando
             * se tem algum atributo do tombo_json sendo nulo ou com o json
             * de erro 500 retornado ou com contador igual a zero
             */
            if (i === quantidadeCodBarra) {
                contaNuloErroTabelaReflora(conexao).then(resultadoNuloErroTabelaReflora => {
                    if (resultadoNuloErroTabelaReflora.length > 0) {
                        fazRequisicaoReflora(conexao, nomeArquivo, resultadoNuloErroTabelaReflora.length);
                    } else {
                        resolve();
                        promessa.resolve(true);
                    }
                });
            } else {
                resolve();
            }
        }));
    }
    return promessa.promise;
}

export default {

};
