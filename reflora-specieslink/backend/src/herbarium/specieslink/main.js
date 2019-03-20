import { getArquivoSpeciesLink, getColunasArquivoSpeciesLink } from './arquivo';
import { getHoraAtual } from '../log';
import {
    criaConexao,
    selectTemExecucaoSpeciesLink,
    insereExecucaoSpeciesLink,
    selectEstaExecutandoSpeciesLink,
    atualizaNomeArquivoSpeciesLink,
} from '../database';

function main() {
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

export function daemonSpeciesLink() {
    const conexao = criaConexao();
    setInterval(() => {
        selectEstaExecutandoSpeciesLink(conexao).then(statusExecucao => {
            /**
             * Se retornar resultado da requisição
             */
            if (statusExecucao.length > 0) {
                const horaFim = statusExecucao[0].dataValues.hora_fim;
                const arquivoSpeciesLink = statusExecucao[0].dataValues.nome_arquivo;
                const { id } = statusExecucao[0].dataValues;
                if (horaFim === null) {
                    const conteudoArquivo = getArquivoSpeciesLink(arquivoSpeciesLink);
                    /**
                     * Remove o primeiro elemento da fila porque é aquele cabeçalho
                     * com o que significa aquela coluna
                     */
                    conteudoArquivo.shift();
                    conteudoArquivo.forEach(linha => {
                        // eslint-disable-next-line no-console
                        console.log(getColunasArquivoSpeciesLink(linha));
                    });
                    // eslint-disable-next-line no-console
                    console.log(conteudoArquivo[0]);
      
                    atualizaNomeArquivoSpeciesLink(conexao, id, 'EXECUTANDO');
                } else if (horaFim !== 'EXECUTANDO') {
                    // pode trocar
                }
            }
        });
    }, 1000);
}

main();

export default { };
