/* eslint-disable max-len */
import request from 'request';
import throttledQueue from 'throttled-queue';
import Promise from 'bluebird';
import { codBarraFaltante } from './codbarra';
import { comparaTombo } from '../tombos';
import { escreveLOG } from '../log';

// const listCodBarra = [];
const codBarraErro = [];
// let zw = 0;

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
    /* if ((codBarra === 'HCF000000002') && (zw === 0)) {
        codBarraErro.push(codBarra);
        zw = 1;
    } else */
    if (!error && response.statusCode === 200) {
        const respostaReflora = processaRespostaReflora(nomeArquivo, codBarra, body);
        // listCodBarra.push(codBarra);
        if (temResultadoRespostaReflora(respostaReflora)) {
            escreveLOG(nomeArquivo, `O código de barra {${codBarra}} possui um resultado no Reflora`);
            comparaTombo(nomeArquivo, conexao, codBarra, respostaReflora);
        } else {
            escreveLOG(nomeArquivo, `O código de barra {${codBarra}} não possui um resultado no Reflora`);
        }
    } else {
        // listCodBarra.push(codBarra);
        escreveLOG(nomeArquivo, `Erro no código de barra {${codBarra}} que foi ${error}`);
        codBarraErro.push(codBarra);
    }
}

function requisicaoReflora(nomeArquivo, conexao, arrayCodBarra) {
    const throttle = throttledQueue(1, 1000);
    const listCodBarra = [];
    codBarraErro.splice(0, codBarraErro.length);
    // eslint-disable-next-line no-console
    // console.log(`a${arrayCodBarra}`);
    for (let i = 0, p = Promise.resolve(); i < arrayCodBarra.length; i += 1) {
        p = p.then(_ => new Promise((resolve, reject) => setTimeout(() => {
            throttle(() => {
                request(`http://servicos.jbrj.gov.br/v2/herbarium/${arrayCodBarra[i]}`, (error, response, body) => {
                    escreveLOG(nomeArquivo, `Realizando a requisição do código de barra {${arrayCodBarra[i]}}`);
                    temProblemaRespostaReflora(nomeArquivo, arrayCodBarra[i], conexao, error, response, body);
                    listCodBarra.push(arrayCodBarra[i]);
                    resolve();
                });
            });
        }, Math.random() * 1000)));
        p = p.then(_ => new Promise(resolve => setTimeout(() => {
            if (i === arrayCodBarra.length - 1) {
                // eslint-disable-next-line no-console
                // console.log(`a-meio${listCodBarra.length}`);
                // listCodBarra.shift();
                // console.log(`a${listCodBarra.length}`);
                // console.log(`a-meio${listCodBarra[0]}`);
                const codBarraNaoFeito = codBarraFaltante(listCodBarra);
                // console.log(`a${codBarraNaoFeito}`);
                if ((codBarraNaoFeito.length !== 0) || (codBarraErro.length > 0)) {
                    // eslint-disable-next-line no-console
                    // console.log(`b${codBarraErro}`);
                    // eslint-disable-next-line no-console
                    // console.log(`c${codBarraNaoFeito.concat(codBarraErro)}`);
                    const todoCodBarraProblema = codBarraNaoFeito.concat(codBarraErro);
                    requisicaoReflora(nomeArquivo, conexao, todoCodBarraProblema);
                }
            }
            resolve();
        }, Math.random() * 1000)));
    }
}

export default {
    requisicaoReflora,
};
