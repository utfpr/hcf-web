/* eslint-disable max-len */
import { refloraExecutando } from '../herbarium/reflora/reflora';
import {
    getHoraAtual,
    transformaLog,
    leLOG,
    transformaNomeLog,
    tempoGastoLog,
} from '../herbarium/log';
import {
    criaConexao,
    selectExisteExecutandoReflora,
    insereExecucao,
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
    const diaPeriodicidade = request.query.dia_periodicidade;
    const diaSemanal = request.query.dia_semanal;
    const diaMes = request.query.dia_mensal;
    const conexao = criaConexao();
    refloraExecutando(conexao).then(estaExecutando => {
        if (estaExecutando) {
            response.status(200).json(JSON.parse(' { "result": "failed" } '));
            conexao.close();
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
                    insereExecucao(conexao, getHoraAtual(), null, periodicidade, diaPeriodicidade, diaSemanal, diaMes, 1).then(() => {
                        response.status(200).json(JSON.parse(' { "result": "success" } '));
                        conexao.close();
                    });
                } else {
                    const { id } = execucaoReflora[0].dataValues;
                    atualizaInicioTabelaConfiguracao(conexao, id, getHoraAtual(), null, periodicidade, diaPeriodicidade, diaSemanal, diaMes).then(() => {
                        response.status(200).json(JSON.parse(' { "result": "success" } '));
                        conexao.close();
                    });
                }
            });
        }
    });
};

export const estaExecutando = (request, response, next) => {
    const conexao = criaConexao();
    refloraExecutando(conexao).then(executando => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        response.header('Access-Control-Allow-Methods', 'GET');
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
    const listaArquivos = fs.readdirSync(diretorioLog);
    if (listaArquivos.length > 0) {
        listaArquivos.forEach(arquivos => {
            nomeArquivos = `${nomeArquivos}"${transformaNomeLog(arquivos)}", `;
        });
        const jsonLogs = nomeArquivos.substring(0, nomeArquivos.lastIndexOf(','));
        const tempoGasto = tempoGastoLog(leLOG(listaArquivos[listaArquivos.length - 1].replace('.log', '')));
        response.status(200).json(JSON.parse(`{ "logs":[ ${jsonLogs} ], "duracao": "${tempoGasto}" }`));
    } else {
        response.status(200).json(JSON.parse('{ "logs":[ ], "duracao": " " }'));
    }
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
