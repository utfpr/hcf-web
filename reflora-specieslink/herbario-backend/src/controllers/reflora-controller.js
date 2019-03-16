import { refloraExecutando, insereExecucao } from '../herbarium/reflora/main';
import {
    getHoraAtual,
    transformaLog,
    leLOG,
    transformaNomeLog,
} from '../herbarium/log';
import {
    criaConexao,
    selectExisteExecutandoReflora,
    atualizaInicioTabelaConfiguracao,
} from '../herbarium/database';

const fs = require('fs');

export const preparaRequisicao = (request, response, next) => {
    /**
     * Então recebe a requisição do front end aqui (quando é imediato).
     * Daí eu faço um select verificando se existe um serviço chamado Reflora
     * e se a hora que terminou é nula. Se está sendo executado eu envio JSON
     * com o resultado de falha
     */
    const { periodicidade } = request.query;
    const conexao = criaConexao();
    refloraExecutando(conexao).then(estaExecutando => {
        if (estaExecutando) {
            response.status(200).json(JSON.parse(' { "result": "failed" } '));
        } else {
            /**
             * Após verificar que não está sendo executado verifico
             * se no BD existe algum registro que é do Reflora. Se não tiver
             * nenhum registro adiciono, caso exista eu só atualizo.
             * (O do porque usar o select diferente do select superior é que pode ocasionar,
             * em registros duplicados)
             */
            selectExisteExecutandoReflora(conexao).then(execucaoReflora => {
                if (execucaoReflora.length === 0) {
                    insereExecucao(conexao, getHoraAtual(), null, periodicidade, 1).then(() => {
                        response.status(200).json(JSON.parse(' { "result": "success" } '));
                    });
                } else {
                    const { id } = execucaoReflora[0].dataValues;
                    atualizaInicioTabelaConfiguracao(conexao, id, getHoraAtual(), null, periodicidade).then(() => {
                        response.status(200).json(JSON.parse(' { "result": "success" } '));
                    });
                }
            });
        }
    });
};

export const agendaReflora = (request, response, next) => {
};

export const estaExecutando = (request, response, next) => {
    const conexao = criaConexao();
    refloraExecutando(conexao).then(executando => {
        if (executando) {
            response.status(200).json(JSON.parse(' { "executando": "true" } '));
        } else {
            response.status(200).json(JSON.parse(' { "executando": "false" } '));
        }
        conexao.close();
    });
};

export const todosLogs = (request, response, next) => {
    /** linux */
    const diretorioLog = `${__dirname}/../../logs`;
    /** windows */
    // const diretorioLog = `${__dirname}../../../logs`;
    let nomeArquivos = '';
    fs.readdirSync(diretorioLog).forEach(arquivos => {
        nomeArquivos = `${nomeArquivos}"${transformaNomeLog(arquivos)}", `;
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
};

export default { };
