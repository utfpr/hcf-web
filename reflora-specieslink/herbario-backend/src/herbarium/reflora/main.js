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
        insereTabelaReflora(tabelaReflora, listaCodBarra.slice(0, 1)).then(() => {
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
    const nomeArquivo = processaNomeLog(existeExecucaoReflora.dataValues.hora_inicio);
    ehNecessarioFazerRequisicao(nomeArquivo).then(() => {
        const { id } = existeExecucaoReflora.dataValues;
        const conteudoLOG = leLOG(nomeArquivo);
        if (conteudoLOG.includes('O processo de comparação do Reflora acabou.')) {
            const horaFim = getHoraFim(conteudoLOG);
            atualizaFimTabelaConfiguracao(conexao, id, horaFim);
        }
    });
}

export function daemonFazRequisicaoReflora() {
    const conexao = criaConexao();
    setInterval(() => {
        selectExecutandoReflora(conexao).then(existeExecucaoReflora => {
            if (existeExecucaoReflora.length === 1) {
                if (existeExecucaoReflora[0].periodicidade === 'MANUAL') {
                    executaReflora(conexao, existeExecucaoReflora[0]);
                }
                if (existeExecucaoReflora[0].periodicidade === 'SEMANAL') {
                    if (moment().isoWeekday() === existeExecucaoReflora[0].dia_semanal) {
                        if (moment().format('HH') === '00') {
                            executaReflora(conexao, existeExecucaoReflora[0]);
                        }
                    }
                }
                if (existeExecucaoReflora[0].periodicidade === '1MES') {
                    if (parseInt(moment().format('DD')) === existeExecucaoReflora[0].dia_periodicidade) {
                        if (moment().format('HH') === '00') {
                            executaReflora(conexao, existeExecucaoReflora[0]);
                        }
                    }
                }
                if (existeExecucaoReflora[0].periodicidade === '2MESES') {
                    // a
                }
            }
        });
    }, 60000);
}

export default {};
