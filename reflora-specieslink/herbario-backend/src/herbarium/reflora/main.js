import Q from 'q';
import moment from 'moment';
import {
    criaConexao,
    criaTabelaReflora,
    insereTabelaReflora,
    selectCodBarra,
    apagaTabelaReflora,
    existeTabelaReflora,
} from '../database';
import { fazComparacaoTombo } from '../tombos';
import { fazRequisicaoReflora } from './reflora';
import {
    getNomeArquivo,
    escreveLOG,
} from '../log';
import refloraController, {
    estadosExecucao,
    getHorarioAtualizacao,
    getPeriodicidadeAtualizacao,
    getDiaDaSemana,
    getDiaDoMes,
} from '../../controllers/reflora-controller';

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
            promessa.resolve(comecaReflora(conexao, nomeArquivo));
        }
    });

    return promessa.promise;
}

export function daemonReflora() {
    setInterval(() => {
        /**
         * Como eu percebi que é para eu fazer a execução eu faço ela
         * Fazendo ela eu mudo de estado, para executando e quando termino mudo
         * para o estado de executado.
         */
        if (refloraController.getExecucao() === estadosExecucao.FACAEXECUCAO) {
            refloraController.setExecucao(estadosExecucao.EXECUTANDO);
            const nomeArquivo = getNomeArquivo();
            ehNecessarioFazerRequisicao(nomeArquivo).then(() => {
                refloraController.setExecucao(estadosExecucao.NAOEXECUTANDO);
            });
        }
    }, 60000);
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
        const periodicidadeAtualizacao = getPeriodicidadeAtualizacao();
        const horarioAtualizacao = getHorarioAtualizacao();
        if ((periodicidadeAtualizacao.length > 0) && (horarioAtualizacao.length > 0)) {
            if (periodicidadeAtualizacao === 'semanal') {
                if (moment().isoWeekday() === getDiaDaSemana()) {
                    if (moment().format('HH') === getHorarioAtualizacao()) {
                        if (refloraController.getExecucao() === estadosExecucao.NAOEXECUTANDO) {
                            refloraController.setExecucao(estadosExecucao.FACAEXECUCAO);
                        }
                    }
                }
            } else if (periodicidadeAtualizacao === 'mensal') {
                if (moment().format('DD') === getDiaDoMes()) {
                    if (moment().format('HH') === getHorarioAtualizacao()) {
                        if (refloraController.getExecucao() === estadosExecucao.NAOEXECUTANDO) {
                            refloraController.setExecucao(estadosExecucao.FACAEXECUCAO);
                        }
                    }
                }
            }
        }
    }, 3600000);
}

export default {};
