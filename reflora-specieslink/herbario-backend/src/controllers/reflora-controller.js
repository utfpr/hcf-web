/* eslint-disable max-len */
const fs = require('fs');
// const moment = require('moment');
const refloraLog = require('../herbarium/log');

export const estadosExecucao = {
    NAOEXECUTANDO: 1,
    FACAEXECUCAO: 2,
    EXECUTANDO: 3,
};
let execucao = estadosExecucao.NAOEXECUTANDO;
let horarioAtualizacao = '';
let periodicidadeAtualizacao = '';

export const chamaReflora = (request, response, next) => {
    /**
     * Se não foi executado ou já foi executado eu posso dar sucesso
     * Caso contrário, eu dou falha
     */
    if (execucao === estadosExecucao.NAOEXECUTANDO) {
        execucao = estadosExecucao.FACAEXECUCAO;
        response.status(200).json(JSON.parse(' { "result": "success" } '));
    } else {
        response.status(200).json(JSON.parse(' { "result": "failed" } '));
    }
};

export const agendaReflora = (request, response, next) => {
    const { horario, periodicidade } = request.query;
    if (horario !== horarioAtualizacao) {
        horarioAtualizacao = horario;
    }
    if (periodicidade !== periodicidadeAtualizacao) {
        periodicidadeAtualizacao = periodicidade;
    }
    response.status(200).json(JSON.parse(' { "result": "success" } '));
};

function getExecucao() {
    return execucao;
}

export const estaExecutando = (request, response, next) => {
    if (execucao === estadosExecucao.NAOEXECUTANDO) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        response.header('Access-Control-Allow-Methods', 'GET');
        response.status(200).json(JSON.parse(' { "executando": "false" } '));
    } else if ((execucao === estadosExecucao.FACAEXECUCAO) || (execucao === estadosExecucao.EXECUTANDO)) {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        response.header('Access-Control-Allow-Methods', 'GET');
        response.status(200).json(JSON.parse(' { "executando": "true" } '));
    }
};

function setExecucao(estado) {
    switch (estado) {
        case 1:
            execucao = estadosExecucao.NAOEXECUTANDO;
            break;
        case 2:
            execucao = estadosExecucao.EXECUTANDO;
            break;
        case 3:
            execucao = estadosExecucao.EXECUTADO;
            break;
        default:
            break;
    }
}

function trocaCaractere(texto, indice, novoValor) {
    return texto.substring(0, indice) + novoValor + texto.substring(indice + 1, texto.length);
}

function processaNomeLog(nomeArquivo) {
    const processoUm = nomeArquivo.replace('.log', '');
    const processoDois = trocaCaractere(processoUm, 2, '/');
    const processoTres = trocaCaractere(processoDois, 5, '/');
    const processoQuatro = trocaCaractere(processoTres, 10, ' ');
    const processoCinco = trocaCaractere(processoQuatro, 13, ':');
    const processoSeis = trocaCaractere(processoCinco, 16, ':');
    return processoSeis;
}

export const todosLogs = (request, response, next) => {
    /** linux */
    // const diretorioLog = `${__dirname}/../../logs`;
    /** windows */
    const diretorioLog = `${__dirname}../../../logs`;
    let nomeArquivos = '';

    fs.readdirSync(diretorioLog).forEach(arquivos => {
        nomeArquivos = `${nomeArquivos}"${processaNomeLog(arquivos)}", `;
    });
    const jsonLogs = nomeArquivos.substring(0, nomeArquivos.lastIndexOf(','));
    response.status(200).json(JSON.parse(`{ "logs":[ ${jsonLogs} ] }`));
};

export const getLog = (request, response, next) => {
    const processaNomeArquivoUm = request.query.nomeLog.replace(/\//g, '-');
    const processaNomeArquivoDois = processaNomeArquivoUm.replace(/:/g, '-');
    const processaNomeArquivoTres = processaNomeArquivoDois.replace(/ /g, '-');
    const conteudoLog = refloraLog.transformaLog(refloraLog.leLOG(processaNomeArquivoTres));
    response.status(200).json(conteudoLog);
};

export default { getExecucao, setExecucao };
