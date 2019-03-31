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
import { fazComparacaoTombo } from './tombos';
import { fazRequisicaoReflora } from './reflora';
import {
    escreveLOG, leLOG, processaNomeLog, getHoraFim,
} from '../log';

/**
 * A função comecaAtualizacaoReflora, primeiramente pega o maior valor de código
 * de barra existente, e partir do código de barra HCF000000001 até o maior valor
 * de código de barra e insere na tabela do Reflora. Com todos os códigos carregados
 * é pego um código de barra de cada vez e faz a requisição desse código de barra e inserido
 * em uma coluna da tabela. Após, obter informações de todos os códigos de barras, é iniciado
 * a comparação, e por fim, quando acaba o processo de comparação de todos os códigos
 * barras, apaga-se essa tabela do Reflora.
 * @param {*} conexao, é a conexão com o banco de dados para obter e atualizar os
 * dados no banco de dados.
 * @param {*} nomeArquivo, é o nome do arquivo aonde será escrito quando iniciou, terminou
 * e algum erro que acontenceu durante o processo de comparação.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando acabar de realizar a comparação de informações.
 */
function comecaAtualizacaoReflora(conexao, nomeArquivo) {
    const promessa = Q.defer();
    escreveLOG(`reflora/${nomeArquivo}`, 'Inicializando a aplicação do Reflora.');
    const tabelaReflora = criaTabelaReflora(conexao);
    selectCodBarra(conexao).then(listaCodBarra => {
        insereTabelaReflora(tabelaReflora, listaCodBarra).then(() => {
            fazRequisicaoReflora(conexao, nomeArquivo).then(resultadoRequisicaoReflora => {
                if (resultadoRequisicaoReflora) {
                    fazComparacaoTombo(conexao).then(resultadoComparacao => {
                        if (resultadoComparacao) {
                            escreveLOG(`reflora/${nomeArquivo}`, 'O processo de comparação do Reflora acabou.');
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

/**
 * A função ehPossivelFazerComparacaoReflora, faz uma consulta no banco de dados
 * verificando se existe a tabela do reflora. Se essa tabela não existe
 * pode ser executado, caso contrário não pode ser executado.
 * @param {*} nomeArquivo, é o nome do arquivo aonde será escrito quando iniciou, terminou
 * e algum erro que acontenceu durante o processo de comparação.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando acabar de verificar se existe uma tabela do reflora.
 */
function ehPossivelFazerComparacaoReflora(nomeArquivo) {
    const promessa = Q.defer();
    const conexao = criaConexao();
    existeTabelaReflora(conexao).then(existe => {
        if (existe) {
            promessa.resolve();
        } else {
            comecaAtualizacaoReflora(conexao, nomeArquivo).then(() => {
                promessa.resolve();
            });
        }
    });

    return promessa.promise;
}

/**
 * A função preparaExecucaoReflora, pega o resultado da existência da execução
 * de Reflora na tabela de configuração e pega a hora de início que está
 * nesse resultado e transforma ele para que ele possa ser nome de arquivo.
 * Assim, ele verificar se é possível fazer a comparação do reflora, se foi
 * possível fazer, se foi feito a comparação do Reflora, ele verifica se
 * acabou mesmo o processo do Reflora, verificando se tem a mensagem desejada,
 * se sim atualiza com a hora que acabou o processo no banco de dados.
 * @param {*} conexao, é a conexão com o banco de dados para atualizar os
 * dados no banco de dados.
 * @param {*} existeExecucaoReflora, é o resultado da existência da execução
 * do Reflora na tabela de configuração.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando acabar de realizar a comparação de informações.
 */
function preparaExecucaoReflora(conexao, existeExecucaoReflora) {
    const promessa = Q.defer();
    const nomeArquivo = processaNomeLog(existeExecucaoReflora.dataValues.hora_inicio);
    ehPossivelFazerComparacaoReflora(nomeArquivo).then(() => {
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

/**
 * A função verificaRequisicoesAgendado, verifica a periodicidade
 * que foi definida pelo usuário e a partir disso calcula
 * a data da próxima atualização, que será utilizado se for atualizado.
 * Depois disso, é verificado se o dia atual é igual a data próxima
 * atualização registrada no BD, se for o mesmo dia verifico se a
 * hora é meia-noite, se for executo e no final da atualização
 * pego a data que foi feita anteriormente e atualizo para a data
 * da próxima atualização.
 * @param {*} conexao, é a conexão com o banco de dados para atualizar os
 * dados no banco de dados.
 * @param {*} existeExecucaoReflora, é o resultado da existência da execução
 * do Reflora na tabela de configuração.
 */
function verificaRequisicoesAgendado(conexao, existeExecucaoReflora) {
    let agendamento = -1;
    if (existeExecucaoReflora[0].periodicidade === 'SEMANAL') {
        agendamento = moment().isoWeekday() + 7;
    } else if (existeExecucaoReflora[0].periodicidade === '1MES') {
        agendamento = moment().isoWeekday() + 30;
    } else if (existeExecucaoReflora[0].periodicidade === '2MESES') {
        agendamento = moment().isoWeekday() + 60;
    }
    if (moment().format('DD/MM/YYYY') === existeExecucaoReflora[0].data_proxima_atualizacao) {
        if (moment().format('HH') === '00') {
            preparaExecucaoReflora(conexao, existeExecucaoReflora[0]).then(() => {
                atualizaProximaDataConfiguracao(conexao, existeExecucaoReflora[0].id, moment().day(agendamento).format('DD/MM/YYYY'));
            });
        } else {
            // eslint-disable-next-line no-console
            console.log(`Não tá na hora ${moment().format('HH')}`);
        }
    } else {
        // eslint-disable-next-line no-console
        console.log(`Não tá no dia ${moment().format('DD/MM/YYYY')}`);
    }
}

/**
 * A função daemonFazRequisicaoReflora, executa de um em um minuto,
 * e faz uma consulta na tabela de configuração, verificando se
 * é necessário realizar a comparação. Se é retornado alguma resultado
 * verifico se a periodicidade foi definida como manual ou não. Se foi
 * definida como manual significa que devo executar imediatamente,
 * caso seja um valor diferente disso, eu verifico qual a periodicidade.
 */
export function daemonFazRequisicaoReflora() {
    const conexao = criaConexao();
    setInterval(() => {
        selectExecutandoReflora(conexao).then(existeExecucaoReflora => {
            if (existeExecucaoReflora.length === 1) {
                if (existeExecucaoReflora[0].periodicidade === 'MANUAL') {
                    preparaExecucaoReflora(conexao, existeExecucaoReflora[0]);
                } else {
                    verificaRequisicoesAgendado(conexao, existeExecucaoReflora);
                }
            }
        });
    }, 60000);
}

export default {};
