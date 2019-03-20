/* eslint-disable max-len */
import moment from 'moment';
import {
    getHoraAtual,
    transformaLog,
    leLOG,
    transformaNomeLog,
    tempoGastoLog,
} from '../herbarium/log';
import {
    criaConexao,
    selectExisteServicoReflora,
    insereExecucao,
    atualizaInicioTabelaConfiguracao,
    selectExecutandoReflora,
} from '../herbarium/database';

const fs = require('fs');

export const preparaRequisicao = (request, response, next) => {
    /**
     * Então primeiramente faço um select no banco verificando se tem registros
     * onde o horário de fim é nulo e o serviço é REFLORA. Se o resultado dessa consulta
     * é maior que zero significa que foi retornado algum registro. Se existe algum registro no BD,
     * onde a data de fim é nula e o serviço é Reflora eu verifico a periodicidade que é. Se a
     * periodicidade for manual, ele não pode nem agendar nem pedir novamente. Agora se a periodicidade
     * for semanal, mensal ou a cada dois meses, verificamos se a data atual é diferente dá data de
     * próxima atualização se for eu atualizo com o novo valor, independentemente se é manual ou periódica.
     * Caso seja a mesma data não poderá ser feito a troca.
     */
    const { periodicidade } = request.query;
    const proximaAtualizacao = request.query.data_proxima_atualizacao;
    const conexao = criaConexao();
    selectExecutandoReflora(conexao).then(listaExecucaoReflora => {
        if (listaExecucaoReflora.length > 0) {
            const periodicidadeBD = listaExecucaoReflora[0].dataValues.periodicidade;
            if (periodicidadeBD === 'MANUAL') {
                response.status(200).json(JSON.parse(' { "result": "failed" } '));
                // conexao.close();
            } else if ((periodicidadeBD === 'SEMANAL') || (periodicidadeBD === '1MES') || (periodicidadeBD === '2MESES')) {
                if (moment().format('DD/MM/YYYY') !== listaExecucaoReflora[0].dataValues.data_proxima_atualizacao) {
                    const { id } = listaExecucaoReflora[0].dataValues;
                    atualizaInicioTabelaConfiguracao(conexao, id, getHoraAtual(), null, periodicidade, proximaAtualizacao).then(() => {
                        response.status(200).json(JSON.parse(' { "result": "success" } '));
                        // conexao.close();
                    });
                } else {
                    response.status(200).json(JSON.parse(' { "result": "failed" } '));
                    // conexao.close();
                }
            }
        } else {
            selectExisteServicoReflora(conexao).then(execucaoReflora => {
                if (execucaoReflora.length === 0) {
                    insereExecucao(conexao, getHoraAtual(), null, periodicidade, proximaAtualizacao, 1).then(() => {
                        response.status(200).json(JSON.parse(' { "result": "success" } '));
                        // conexao.close();
                    });
                } else {
                    const { id } = execucaoReflora[0].dataValues;
                    atualizaInicioTabelaConfiguracao(conexao, id, getHoraAtual(), null, periodicidade, proximaAtualizacao).then(() => {
                        response.status(200).json(JSON.parse(' { "result": "success" } '));
                        // conexao.close();
                    });
                }
            });
        }
    });
};

export const estaExecutando = (request, response, next) => {
    const conexao = criaConexao();
    selectExecutandoReflora(conexao).then(listaExecucaoReflora => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
        response.header('Access-Control-Allow-Methods', 'GET');
        if (listaExecucaoReflora.length > 0) {
            const { periodicidade } = listaExecucaoReflora[0].dataValues;
            if (periodicidade === 'MANUAL') {
                response.status(200).json(JSON.parse(' { "executando": "true", "periodicidade": " " } '));
            } else if ((periodicidade === 'SEMANAL') || (periodicidade === '1MES') || (periodicidade === '2MESES')) {
                if (moment().format('DD/MM/YYYY') !== listaExecucaoReflora[0].dataValues.data_proxima_atualizacao) {
                    response.status(200).json(JSON.parse(` { "executando": "false", "periodicidade": "${periodicidade}" } `));
                } else {
                    response.status(200).json(JSON.parse(` { "executando": "true", "periodicidade": "${periodicidade}" } `));
                }
            }
        } else {
            response.status(200).json(JSON.parse(' { "executando": "false", "periodicidade": " " } '));
        }
        // conexao.close();
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
