/* eslint-disable max-len */
import request from 'request';
import throttledQueue from 'throttled-queue';
import Sequelize from 'sequelize';
// import { codBarraFaltante } from './codbarra';
import { comparaTombo } from '../tombos';
import { escreveLOG } from '../log';
import modeloReflora from '../../models/Reflora';

const listErroCodBarra = [];

export function createTableReflora(conexao) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    // force: true => dá um drop table
    tabelaReflora.sync({ force: true });
    tabelaReflora.removeAttribute('id');
    return tabelaReflora;
}

export function insertTableReflora(tabelaReflora, arrayCodBarra) {
    /**
     * Sem o throttle ele faz muitas conexões simultaneamente,
     * acabando gerando erros. O throttle faz um por um, evitando
     * erros. Algumas soluções no StackOverflow falavam para
     * adicionar certas configurações na criação da conexão, porém nada deu certo.
     */
    const throttle = throttledQueue(1, 100);
    arrayCodBarra.forEach(codBarra => {
        throttle(() => {
            tabelaReflora.create({
                cod_barra: codBarra,
                tombo_json: null,
                contador: 0,
            });
        });
    });
}

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

export default {
    requisicaoReflora,
};
