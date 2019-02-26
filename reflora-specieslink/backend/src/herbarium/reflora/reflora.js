/* eslint-disable max-len */
// import request from 'request';
// import throttledQueue from 'throttled-queue';
import Q from 'q';
import { escreveLOG } from '../log';
import {
    selectUmCodBarra,
    atualizaTabelaReflora,
    // contaNuloErroTabelaReflora
} from '../database';

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

export function fazRequisicaoReflora(conexao, nomeArquivo) {
    const promessa = Q.defer();
    // const throttle = throttledQueue(1, 1000);
    // throttle(() => {
    selectUmCodBarra(conexao).then(codBarra => {
        // eslint-disable-next-line no-console
        console.log(`codBarra atual:${codBarra[0].dataValues.cod_barra}`);
        if (codBarra.length === 0) {
            promessa.resolve();
            return promessa.promise;
        }
        // eslint-disable-next-line no-console
        console.log('ainda existem');
        const getCodBarra = codBarra[0].dataValues.cod_barra;
        // eslint-disable-next-line no-console
        console.log(`codBarra atual:${codBarra[0].dataValues.cod_barra}`);
        atualizaTabelaReflora(conexao, getCodBarra, 'b');
        fazRequisicaoReflora(conexao, nomeArquivo);
        return promessa.promise;
    });
    // });
    return promessa.promise;
    // export function fazRequisicaoReflora(conexao, nomeArquivo, quantidadeCodBarra) {
    /* const throttle = throttledQueue(1, 4000);
    const promessa = Q.defer();
    for (let i = 0, p = Promise.resolve(); i < quantidadeCodBarra + 1; i += 1) {
        p = p.then(_ => new Promise(resolve => {
            throttle(() => {
    /* selectUmCodBarra(conexao).then(codBarra => {
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
    /* if (i === quantidadeCodBarra) {
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
    return promessa.promise; */
}

export default {

};
