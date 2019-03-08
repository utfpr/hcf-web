const fs = require('fs');
const Reflora = require('../herbarium/reflora/main');
const refloraLog = require('../herbarium/log');


const estadosExecucao = {
    NAOEXECUTANDO: 1,
    FACAEXECUCAO: 2,
    EXECUTANDO: 3,
};
let execucao = estadosExecucao.NAOEXECUTANDO;

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
    // eslint-disable-next-line no-console
    console.log(`->${request.query.horario}`);
    const horario = 0;
    const periodicidade = 'a';
    Reflora.agenda(horario, periodicidade).then(() => {
        response.status(200).json(JSON.parse(' { "title": "example glossary" } '));
    }).catch(next);
    // response.status(200).json(JSON.parse(' { "title": "example glossary" } ')).catch(next);
};

function getExecucao() {
    // eslint-disable-next-line no-console
    // console.log(estaExecutando);
    return execucao;
}

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

export const todosLogs = (request, response, next) => {
    /** linux */
    // const diretorioLog = `${__dirname}/../../logs`;
    /** windows */
    const diretorioLog = `${__dirname}../../../logs`;
    let nomeArquivos = '';

    fs.readdirSync(diretorioLog).forEach(arquivos => {
        // eslint-disable-next-line no-console
        // nomeArquivos.push('logs: arquivos');
        nomeArquivos = `${nomeArquivos}"${arquivos.replace('.log', '')}", `;
        // console.log(arquivos);
    });
    const jsonLogs = nomeArquivos.substring(0, nomeArquivos.lastIndexOf(','));
    response.status(200).json(JSON.parse(`{ "logs":[ ${jsonLogs} ] }`));
    // return ;
    // console.log(`{ "logs":[ ${jsonLogs} ] }`);
};

export const getLog = (request, response, next) => {
    // console.log(`->${request.query.nomeLog}`);
    const conteudoLog = refloraLog.transformaLog(refloraLog.leLOG(request.query.nomeLog));
    // eslint-disable-next-line no-console
    console.log(conteudoLog);
    response.status(200).json(conteudoLog);
    /* Reflora.agenda(horario, periodicidade).then(() => {
        response.status(200).json(JSON.parse(' { "title": "example glossary" } '));
    }).catch(next); */
};

export default { getExecucao, setExecucao };
