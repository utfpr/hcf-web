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

export function main() {
    const conexao = criaConexao();
    const nomeArquivo = 'speciesLink_all_31546_20190313103805.txt';
    selectTemExecucaoSpeciesLink(conexao).then(execucaoSpeciesLink => {
        if (execucaoSpeciesLink.length === 0) {
            insereExecucaoSpeciesLink(conexao, getHoraAtual(), null, nomeArquivo, 2);
        } else {
            selectEstaExecutandoSpeciesLink(conexao).then(estaExecutando => {
                if (estaExecutando.length === 0) {
                    // atualiza
                    const { id } = estaExecutando[0].dataValues;
                    atualizaNomeArquivoSpeciesLink(conexao, id, nomeArquivo);
                } else {
                    // Está atualizando
                }
            });
        }
    });
}

// insert into configuracao (hora_inicio, hora_fim, periodicidade, data_proxima_atualizacao, nome_arquivo, servico) values ('24/03/2019 16:05:00', null, null, null, 'speciesLink_all_31546_20190313103805.txt', 2);
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
    }, 6000);
}

main();
daemonSpeciesLink();

export default { };
