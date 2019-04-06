/* eslint-disable max-len */
import { processaArquivo } from './arquivo';
import { getHoraAtual, escreveLOG, processaNomeLog } from '../log';
import {
    selectTemExecucaoServico,
    insereExecucaoSpeciesLink,
    selectEstaExecutandoServico,
    atualizaNomeArquivoSpeciesLink,
    atualizaHoraFimSpeciesLink,
} from '../herbariumdatabase';
import { realizaComparacao } from './specieslink';
import models from '../../models';

const { sequelize } = models;

/**
 * A função agendaComparacaoSpeciesLink(), faz um select verificando se tem o serviço do SpeciesLink
 * na tabela de configuração. Se o resultado dessa busca for zero, ou seja, não
 * tem nada insere um dado na tabela, caso contrário eu verifico significa
 * que tem um registro no banco de dados. Então eu pego esse registro no BD,
 * e verifico se o valor da coluna hora_fim é diferente de nulo e EXECUTANDO.
 * Se essa condição for verdade, significa que o processo já acabou, então posso
 * atualiza com os novos valores. Caso contrário está executando.
 */
export function agendaComparacaoSpeciesLink(nomeArquivo, response) {
    selectTemExecucaoServico(sequelize, 2).then(execucaoSpeciesLink => {
        if (execucaoSpeciesLink.length === 0) {
            insereExecucaoSpeciesLink(sequelize, getHoraAtual(), null, nomeArquivo, 2);
            response.status(200).json(JSON.parse(' { "result": "success" } '));
        } else {
            const horaFim = execucaoSpeciesLink[0].dataValues.hora_fim;
            const { id } = execucaoSpeciesLink[0].dataValues;
            if ((horaFim !== null) && (horaFim !== 'EXECUTANDO')) {
                atualizaNomeArquivoSpeciesLink(sequelize, id, getHoraAtual(), nomeArquivo);
                response.status(200).json(JSON.parse(' { "result": "success" } '));
            } else {
                response.status(200).json(JSON.parse(' { "result": "failed" } '));
            }
        }
    });
}

/**
 * A função daemonSpeciesLink(), executa de um em um minuto. Nesse tempo
 * é feito um select verificando se existe algum registro de execução
 * do speciesLink na tabela de configuração. Se existe algum registro
 * verifico se o horário final é igual a nulo, se for mudo o valor dessa coluna,
 * processo o arquivo de entrada, escrevo no LOG, e realizo a comparação. Após,
 * o processo de comparação escrevo que terminou no LOG, e atualizo o horário
 * de término no BD.
 */
export function daemonSpeciesLink() {
    setInterval(() => {
        selectEstaExecutandoServico(sequelize, 2).then(statusExecucao => {
            if (statusExecucao.length > 0) {
                const horaFim = statusExecucao[0].dataValues.hora_fim;
                const horaInicio = statusExecucao[0].dataValues.hora_inicio;
                const nomeArquivo = processaNomeLog(horaInicio);
                const arquivoSpeciesLink = statusExecucao[0].dataValues.nome_arquivo;
                const { id } = statusExecucao[0].dataValues;
                if (horaFim === null) {
                    atualizaHoraFimSpeciesLink(sequelize, id, 'EXECUTANDO').then(() => {
                        const listaConteudoArquivo = processaArquivo(arquivoSpeciesLink);
                        escreveLOG(`specieslink/${nomeArquivo}`, 'Inicializando a aplicação do SpeciesLink.');
                        realizaComparacao(sequelize, horaInicio, listaConteudoArquivo).then(acabou => {
                            if (acabou) {
                                escreveLOG(`specieslink/${nomeArquivo}`, 'O processo de comparação do SpeciesLink acabou.');
                                atualizaHoraFimSpeciesLink(sequelize, id, getHoraAtual());
                            }
                        });
                    });
                } else if (horaFim === 'EXECUTANDO') {
                    // eslint-disable-next-line no-console
                    console.log('TÁ EXECUTANDO!!!!11');
                }
            }
        });
    }, 2000);
}

export default { };
