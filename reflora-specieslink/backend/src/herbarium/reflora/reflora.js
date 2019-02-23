/* eslint-disable max-len */
// import request from 'request';
import throttledQueue from 'throttled-queue';
// import { comparaTombo } from '../tombos';
import { escreveLOG } from '../log';
import { selectUmCodBarra, atualizaTabelaReflora, contaNuloErroTabelaReflora } from '../database';

const x = [];

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
    for (let i = 0, p = Promise.resolve(); i < quantidadeCodBarra + 1; i += 1) {
        p = p.then(_ => new Promise(resolve => {
            throttle(() => {
                selectUmCodBarra(conexao).then(codBarra => {
                    if (codBarra.length === 0) {
                        resolve();
                    }
                    const getCodBarra = codBarra[0].dataValues.cod_barra;
                    // eslint-disable-next-line no-console
                    console.log(getCodBarra);
                    // console.log(getCodBarra);
                    /* request(`http://servicos.jbrj.gov.br/v2/herbarium/${getCodBarra}`, (error, response, body) => {
                        temProblemaRespostaReflora(nomeArquivo, conexao, getCodBarra, error, response, body);
                        resolve();
                    }); */
                    // temProblemaRespostaReflora(nomeArquivo, conexao, getCodBarra, error, response, body);
                    resolve();
                });
            });
        }));
        p = p.then(_ => new Promise(resolve => {
            if (i === quantidadeCodBarra) {
                if (x.length === 0) {
                    fazRequisicaoReflora(conexao, nomeArquivo, 2);
                    contaNuloErroTabelaReflora(conexao);
                    x.push(1);
                }
                // eslint-disable-next-line no-console
                console.log('último');
                // i = 0;
                // quantidadeCodBarra = 3;
            }
            // a
            // eslint-disable-next-line no-console
            console.log(i);
            resolve();
        }));
    }
}

export default {

};
