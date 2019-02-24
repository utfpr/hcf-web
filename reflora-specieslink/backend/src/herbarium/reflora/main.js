import {
    criaConexao,
    criaTabelaReflora,
    selectMaiorNumBarra,
    insereTabelaReflora,
} from '../database';
// import { processaMaiorCodBarra } from '../tombos';
import { criaListaCodBarra } from './codbarra';
import { fazRequisicaoReflora } from './reflora';
import { fazComparacaoTombo } from '../tombos';
import { getNomeArquivo, escreveLOG } from '../log';

function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');
    const conexao = criaConexao();
    const tabelaReflora = criaTabelaReflora(conexao);

    selectMaiorNumBarra(conexao).then(maxCodBarra => {
        /* Faz o pré-processamento do código de barra */
        // const intMaiorCodBarra = processaMaiorCodBarra(maxCodBarra);
        const intMaiorCodBarra = 1;
        const listaCodBarra = criaListaCodBarra(intMaiorCodBarra).sort();
        insereTabelaReflora(tabelaReflora, listaCodBarra).then(() => {
            fazRequisicaoReflora(conexao, nomeArquivo, listaCodBarra.length).then(resultadoRequisicaoReflora => {
                if (resultadoRequisicaoReflora) {
                    fazComparacaoTombo(conexao, listaCodBarra.length);
                    // a
                }
            });
        });
    });
}

main();
