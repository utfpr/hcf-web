/* eslint-disable max-len */
import Q from 'q';
import Sequelize from 'sequelize';
import {
    criaConexao,
    criaTabelaReflora,
    insereTabelaReflora,
    selectCodBarra,
    apagaTabelaReflora,
    existeTabelaReflora,
    selectExecutandoReflora,
    atualizaTabelaConfiguracao,
} from '../database';
import { fazComparacaoTombo } from '../tombos';
import { fazRequisicaoReflora } from './reflora';
import {
    escreveLOG, leLOG, processaNomeLog, getHoraFim,
} from '../log';
import modeloConfiguracao from '../../models/Configuracao';


function comecaReflora(conexao, nomeArquivo) {
    const promessa = Q.defer();

    escreveLOG(nomeArquivo, 'Inicializando a aplicação do Reflora.');
    const tabelaReflora = criaTabelaReflora(conexao);
    selectCodBarra(conexao).then(listaCodBarra => {
        // insereTabelaReflora(tabelaReflora, listaCodBarra).then(() => {
        insereTabelaReflora(tabelaReflora, listaCodBarra.slice(0, 5)).then(() => {
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

export function ehNecessarioFazerRequisicao(nomeArquivo) {
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

export function daemonFazRequisicaoReflora() {
    const conexao = criaConexao();
    setInterval(() => {
        selectExecutandoReflora(conexao).then(listaExecucaoReflora => {
            if (listaExecucaoReflora.length === 1) {
                const nomeArquivo = processaNomeLog(listaExecucaoReflora[0].dataValues.hora_inicio);
                // console.log(nomeArquivo);
                ehNecessarioFazerRequisicao(nomeArquivo).then(() => {
                    const { id } = listaExecucaoReflora[0].dataValues;
                    const horaFim = getHoraFim(leLOG(nomeArquivo));
                    atualizaTabelaConfiguracao(conexao, id, horaFim);
                    // console.log(horaTermino);
                    // console.log(id);
                });
            }
        });
    }, 5000);
}

export function refloraExecutando(conexao) {
    const promessa = Q.defer();
    selectExecutandoReflora(conexao).then(listaExecucaoReflora => {
        if (listaExecucaoReflora.length === 0) {
            promessa.resolve(false);
        } else {
            promessa.resolve(true);
        }

    });
    return promessa.promise;
}

export function insereExecucao(conexao, horaAtual, horaFim, periodicidadeUsuario, servicoUsuario) {
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    const promessa = Q.defer();
    tabelaConfiguracao.create({
        hora_inicio: horaAtual,
        hora_fim: horaFim,
        periodicidade: periodicidadeUsuario,
        servico: servicoUsuario,
    }).then(() => {
        promessa.resolve();
    });
    return promessa.promise;
}

/**
 * daemonAgendaReflora() é uma função que inicia junto com o backend.
 * A cada uma hora, ela pega o valor de periodicidade da atualização
 * e o horário da atualização (Esses valores retornam nulos). Se ambos
 * valores forem maiores que zero, verifica qual é a periodicidade.
 * Se a periodicidade for semanal, irá ser verificado se o dia atual
 * é igual ao dia da semana. Se for o mesmo dia semana, verifica se
 * a hora atual é igual a hora que foi definido pelo usuário.
 * Caso seja a mesma hora ele irá verificar se está sendo executado
 * a atualização do Reflora, caso não esteja sendo feito será feito
 * o processo de atualização. Essa mesma ideia se aplica quando
 * a periodicidade é mensal, só que invés de ser verificado o dia
 * da semana é verificado o dia do mês.
 * @params nenhum.
 */
export function daemonAgendaReflora() {
    setInterval(() => {
    }, 3600000);
}

export default {};
