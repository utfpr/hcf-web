import { refloraExecutando, insereExecucao } from '../herbarium/reflora/main';
import {
    getHoraAtual, transformaLog, leLOG, trocaCaractere,
} from '../herbarium/log';
import { criaConexao } from '../herbarium/database';

const fs = require('fs');

export const preparaRequisicao = (request, response, next) => {
    /**
     * Então recebe a requisição do front end aqui. Aqui eu verifico
     * se no BD existe algum servico do Reflora executando (vendo se o valor
     * de hora de fim é nulo e se o serviço é Reflora). Se foi me retornado
     * uma lista que é zero significa que não está sendo executado, caso contrário
     * está sendo executado.
     */
    const { periodicidade } = request.query;
    const conexao = criaConexao();
    refloraExecutando(conexao).then(estaExecutando => {
        if (estaExecutando) {
            response.status(200).json(JSON.parse(' { "result": "failed" } '));
        } else {
            insereExecucao(conexao, getHoraAtual(), null, periodicidade, 1);
            response.status(200).json(JSON.parse(' { "result": "success" } '));
        }
    });
};

export const agendaReflora = (request, response, next) => {
    // const { periodicidade } = request.query;
    // atualizacaoAutomaticaReflora.defineAgendaReflora();
    response.status(200).json(JSON.parse(' { "result": "success" } '));
};

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
    const diretorioLog = `${__dirname}/../../logs`;
    /** windows */
    // const diretorioLog = `${__dirname}../../../logs`;
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
    const conteudoLog = transformaLog(leLOG(processaNomeArquivoTres));
    response.status(200).json(conteudoLog);
};

export const getStatusAgenda = (request, response, next) => {
    // response.status(200).json(JSON.parse(`{ "periodicidade": "${periodicidadeAtualizacao}" }`));
};

export default { };
