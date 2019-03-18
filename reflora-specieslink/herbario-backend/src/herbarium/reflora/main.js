/* eslint-disable max-len */
import Q from 'q';
import moment from 'moment';
import {
    criaConexao,
    criaTabelaReflora,
    insereTabelaReflora,
    selectCodBarra,
    apagaTabelaReflora,
    existeTabelaReflora,
    selectExecutandoReflora,
    atualizaFimTabelaConfiguracao,
    atualizaProximaDataConfiguracao,
} from '../database';
import { fazComparacaoTombo } from '../tombos';
import { fazRequisicaoReflora } from './reflora';
import {
    escreveLOG, leLOG, processaNomeLog, getHoraFim,
} from '../log';

function comecaReflora(conexao, nomeArquivo) {
    const promessa = Q.defer();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do Reflora.');
    const tabelaReflora = criaTabelaReflora(conexao);
    selectCodBarra(conexao).then(listaCodBarra => {
        // insereTabelaReflora(tabelaReflora, listaCodBarra).then(() => {
        insereTabelaReflora(tabelaReflora, listaCodBarra.slice(0, 10)).then(() => {
            fazRequisicaoReflora(conexao, nomeArquivo).then(resultadoRequisicaoReflora => {
                if (resultadoRequisicaoReflora) {
                    fazComparacaoTombo(conexao).then(resultadoComparacao => {
                        if (resultadoComparacao) {
                            escreveLOG(nomeArquivo, 'O processo de comparação do Reflora acabou.');
                            apagaTabelaReflora(conexao).then(() => {
                                promessa.resolve();
                            });
                        }
                    });
                }
            });
        });
    });

    return promessa.promise;
}

function ehNecessarioFazerRequisicao(nomeArquivo) {
    const promessa = Q.defer();
    const conexao = criaConexao();
    /**
     * 1.Cria a tabela do Reflora e insere os códigos de barra nela
     * 2.A partir de todos os códigos de barras presente na tabela faz a requisição
     * 3.Com os resultados das requisições presentes no BD, faz a comparação dessas informações
     * Detalhe: comentário com duas barras (//) são usados para testes
    */
    existeTabelaReflora(conexao).then(existe => {
        if (existe) {
            promessa.resolve();
        } else {
            comecaReflora(conexao, nomeArquivo).then(() => {
                promessa.resolve();
            });
        }
    });

    return promessa.promise;
}

function executaReflora(conexao, existeExecucaoReflora) {
    const promessa = Q.defer();
    const nomeArquivo = processaNomeLog(existeExecucaoReflora.dataValues.hora_inicio);
    ehNecessarioFazerRequisicao(nomeArquivo).then(() => {
        const { id } = existeExecucaoReflora.dataValues;
        const conteudoLOG = leLOG(nomeArquivo);
        if (conteudoLOG.includes('O processo de comparação do Reflora acabou.')) {
            const horaFim = getHoraFim(conteudoLOG);
            atualizaFimTabelaConfiguracao(conexao, id, horaFim);
            promessa.resolve();
        }
    });
    return promessa.promise;
}

export function daemonFazRequisicaoReflora() {
    const conexao = criaConexao();
    /**
     * De um em um minuto, eu verifico se tem na tabela de configuração
     * algum registro que tenha a data de fim igual a nula e o serviço
     * seja Reflora. Se existir um (que vai ter apenas um registro) eu verifico
     * a periodicidade dele, se for manual executo na hora. Se for semanal
     * verifico o valor da coluna data_proxima_atualizacao se é igual a data atual,
     * eu verifico se a hora é igual a meia-noite, se for eu posso realizar
     * o processo de comparação do Reflora. Por fim, depois de realizar o processo
     * de comparação, eu atualizo com a nova data de próxima atualização.
     */
    setInterval(() => {
        selectExecutandoReflora(conexao).then(existeExecucaoReflora => {
            if (existeExecucaoReflora.length === 1) {
                if (existeExecucaoReflora[0].periodicidade === 'MANUAL') {
                    executaReflora(conexao, existeExecucaoReflora[0]);
                }
                if (existeExecucaoReflora[0].periodicidade === 'SEMANAL') {
                    if (moment().format('DD/MM/YYYY') === existeExecucaoReflora[0].data_proxima_atualizacao) {
                        if (moment().format('HH') === '00') {
                            executaReflora(conexao, existeExecucaoReflora[0]).then(() => {
                                atualizaProximaDataConfiguracao(conexao, existeExecucaoReflora[0].id, moment().day(7).format('DD/MM/YYYY'));
                            });
                        }
                    }
                }
                if (existeExecucaoReflora[0].periodicidade === '1MES') {
                    if (moment().format('DD/MM/YYYY') === existeExecucaoReflora[0].data_proxima_atualizacao) {
                        if (moment().format('HH') === '00') {
                            executaReflora(conexao, existeExecucaoReflora[0]).then(() => {
                                atualizaProximaDataConfiguracao(conexao, existeExecucaoReflora[0].id, moment().day(30).format('DD/MM/YYYY'));
                            });
                        }
                    }
                }
                if (existeExecucaoReflora[0].periodicidade === '2MESES') {
                    if (moment().format('DD/MM/YYYY') === existeExecucaoReflora[0].data_proxima_atualizacao) {
                        if (moment().format('HH') === '00') {
                            executaReflora(conexao, existeExecucaoReflora[0]).then(() => {
                                atualizaProximaDataConfiguracao(conexao, existeExecucaoReflora[0].id, moment().day(60).format('DD/MM/YYYY'));
                            });
                        }
                    }
                }
            }
        });
    }, 60000);
}

export default {};

/**
 * 1 - Então se eu quero atualizar imediatar, e tento programar não dá certo.
 * 1.1 - (FALTA) desabilitar esse botões de programação.
 * 2 - Então se eu programei, não chego no dia e eu quero atualizar imediatamente eu devo conseguir.
 */
