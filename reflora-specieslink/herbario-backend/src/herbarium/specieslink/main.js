import { processaArquivo } from './arquivo';
import { getHoraAtual, escreveLOG, processaNomeLog } from '../log';
import {
    criaConexao,
    selectTemExecucaoSpeciesLink,
    insereExecucaoSpeciesLink,
    selectEstaExecutandoSpeciesLink,
    atualizaNomeArquivoSpeciesLink,
    atualizaHoraFimSpeciesLink,
} from '../database';
import { realizaComparacao } from './specieslink';

/**
 * A função main(), faz um select verificando se tem o serviço do SpeciesLink
 * na tabela de configuração. Se o resultado dessa busca for zero, ou seja, não
 * tem nada insere um dado na tabela, caso contrário eu verifico significa
 * que tem um registro no banco de dados. Então eu pego esse registro no BD,
 * e verifico se o valor da coluna hora_fim é diferente de nulo e EXECUTANDO.
 * Se essa condição for verdade, significa que o processo já acabou, então posso
 * atualiza com os novos valores. Caso contrário está executando.
 * @params não tem nenhum parâmetro.
 * @returns não retorna nada.
 */
export function main(nomeArquivo, response) {
    const conexao = criaConexao();
    // const nomeArquivo = 'speciesLink_all_31546_20190313103805.txt';
    selectTemExecucaoSpeciesLink(conexao).then(execucaoSpeciesLink => {
        if (execucaoSpeciesLink.length === 0) {
            insereExecucaoSpeciesLink(conexao, getHoraAtual(), null, nomeArquivo, 2);
            // mensagem de sucesso.
            response.status(200).json(JSON.parse(' { "result": "success" } '));
        } else {
            const horaFim = execucaoSpeciesLink[0].dataValues.hora_fim;
            const { id } = execucaoSpeciesLink[0].dataValues;
            if ((horaFim !== null) && (horaFim !== 'EXECUTANDO')) {
                atualizaNomeArquivoSpeciesLink(conexao, id, getHoraAtual(), nomeArquivo);
                response.status(200).json(JSON.parse(' { "result": "success" } '));
                // mensagem de sucesso.
            } else {
                // mensagem de erro.
                response.status(200).json(JSON.parse(' { "result": "failed" } '));
            }
        }
    });
}

// insert into configuracao (hora_inicio, hora_fim, periodicidade, data_proxima_atualizacao, nome_arquivo, servico) values ('24/03/2019 16:05:00', null, null, null, 'speciesLink_all_31546_20190313103805.txt', 2);
/**
 * A função daemonSpeciesLink(), executa de um em um minuto. Nesse tempo
 * é feito um select verificando se existe algum registro de execução
 * do speciesLink na tabela de configuração. Se existe algum registro
 * verifico se o horário final é igual a nulo, se for mudo o valor dessa coluna,
 * processo o arquivo de entrada, escrevo no LOG, e realizo a comparação. Após,
 * o processo de comparação escrevo que terminou no LOG, e atualizo o horário de término no BD.
 * @params não tem nenhum parâmetro.
 * @returns não retorna nada.
 */
export function daemonSpeciesLink() {
    const conexao = criaConexao();
    setInterval(() => {
        selectEstaExecutandoSpeciesLink(conexao).then(statusExecucao => {
            /**
             * Se retornar resultado da requisição
             */
            if (statusExecucao.length > 0) {
                const horaFim = statusExecucao[0].dataValues.hora_fim;
                const horaInicio = statusExecucao[0].dataValues.hora_inicio;
                const nomeArquivo = processaNomeLog(horaInicio);
                const arquivoSpeciesLink = statusExecucao[0].dataValues.nome_arquivo;
                const { id } = statusExecucao[0].dataValues;
                if (horaFim === null) {
                    atualizaHoraFimSpeciesLink(conexao, id, 'EXECUTANDO').then(() => {
                        console.log('aqui');
                        const listaConteudoArquivo = processaArquivo(arquivoSpeciesLink);
                        escreveLOG(nomeArquivo, 'Inicializando a aplicação do SpeciesLink.');
                        realizaComparacao(conexao, horaInicio, listaConteudoArquivo).then(acabou => {
                            if (acabou) {
                                escreveLOG(nomeArquivo, 'O processo de comparação do SpeciesLink acabou.');
                                atualizaHoraFimSpeciesLink(conexao, id, getHoraAtual());
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

// main();
// daemonSpeciesLink();

export default { };
