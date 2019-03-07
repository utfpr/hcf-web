const Reflora = require('../herbarium/reflora/main');

const estadosExecucao = {
    NAOEXECUTANDO: 1,
    FACAEXECUCAO: 2,
    EXECUTANDO: 3,
};
let execucao = estadosExecucao.NAOEXECUTANDO;

/**
 * A variável está executando pode
 */
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
    /* Reflora.main().then(saidaLog => {
        response.status(200).json(saidaLog);
    }); */
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

export default { getExecucao, setExecucao };
