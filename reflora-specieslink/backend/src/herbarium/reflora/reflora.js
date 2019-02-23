/* eslint-disable max-len */
import request from 'request';
import throttledQueue from 'throttled-queue';
// import Q from 'q';
// import { codBarraFaltante } from './codbarra';
import { comparaTombo } from '../tombos';
import { escreveLOG } from '../log';
import { selectUmCodBarra, atualizaTabelaReflora } from '../database';
// import { selectUmCodBarra } from '../database';

const listErroCodBarra = [];

function clearListErroCodBarra() {
    while (listErroCodBarra.length > 0) {
        listErroCodBarra.pop();
    }
}

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
        if (temResultadoRespostaReflora(respostaReflora)) {
            escreveLOG(nomeArquivo, `O código de barra {${codBarra}} possui um resultado no Reflora`);
            comparaTombo(nomeArquivo, conexao, codBarra, respostaReflora);
        } else {
            escreveLOG(nomeArquivo, `O código de barra {${codBarra}} não possui um resultado no Reflora`);
        }
    } else {
        escreveLOG(nomeArquivo, `Erro no código de barra {${codBarra}} que foi ${error}`);
        listErroCodBarra.push(codBarra);
    }
}

async function requisicaoReflora(nomeArquivo, conexao, arrayCodBarra) {
    const throttle = throttledQueue(1, 1000);
    const listCodBarra = [];
    clearListErroCodBarra();
    for (let i = 0; i < arrayCodBarra.length; i += 1) {
        throttle(() => {
            request(`http://servicos.jbrj.gov.br/v2/herbarium/${arrayCodBarra[i]}`, (error, response, body) => {
                escreveLOG(nomeArquivo, `Realizando a requisição do código de barra {${arrayCodBarra[i]}}`);
                temProblemaRespostaReflora(nomeArquivo, arrayCodBarra[i], conexao, error, response, body);
                listCodBarra.push(arrayCodBarra[i]);
            });
        });
        /*
        if (i === arrayCodBarra.length - 1) {
            const codBarraNaoFeito = codBarraFaltante(listCodBarra);
            const todosCodBarra = codBarraNaoFeito.concat(listErroCodBarra);
            if (todosCodBarra.length !== 0) {
                requisicaoReflora(nomeArquivo, conexao, todosCodBarra);
            }
        }
        */
    }
}

export function fazRequisicaoReflora(conexao, quantidadeCodBarra) {
    const throttle = throttledQueue(1, 1000);
    for (let i = 0; i < quantidadeCodBarra + 1; i += 1) {
        throttle(() => {
            selectUmCodBarra(conexao).then(codBarra => {
                const getCodBarra = codBarra[0].dataValues.cod_barra;
                request(`http://servicos.jbrj.gov.br/v2/herbarium/${getCodBarra}`, (error, response, body) => {
                    // eslint-disable-next-line no-console
                    console.log(body);
                    atualizaTabelaReflora(conexao, getCodBarra, body);
                });
            });
        });
    }
    /*
    const promessa = Q.defer();
    const throttle = throttledQueue(1, 1000);
    selectUmCodBarra(conexao).then(codBarra => {
        if (codBarra.length === 0) {
            promessa.resolve();
            return promessa.promise;
        }
        // eslint-disable-next-line no-console
        console.log(codBarra[0].dataValues.cod_barra);
        const getCodBarra = codBarra[0].dataValues.cod_barra;
        throttle(() => {
            request(`http://servicos.jbrj.gov.br/v2/herbarium/${getCodBarra}`, (error, response, body) => {
                // eslint-disable-next-line no-console
                console.log(body);
                atualizaTabelaReflora(conexao, getCodBarra, body);
            });
        });
        doRequestReflora(conexao);
        return promessa.promise;
        // eslint-disable-next-line no-console
    });
    return promessa.promise;
    */
}

export default {
    requisicaoReflora,
};
