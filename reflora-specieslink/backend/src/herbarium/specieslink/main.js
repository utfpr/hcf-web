import { getHoraAtual } from '../log';
import {
    criaConexao,
    selectTemExecucaoSpeciesLink,
    insereExecucaoSpeciesLink,
    selectEstaExecutandoSpeciesLink,
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
                } else {
                    // Está atualizando
                }
            });
        }
    });
}

main();
