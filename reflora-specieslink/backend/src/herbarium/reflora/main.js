import {
    criaConexao,
    criaTabelaReflora,
    selectMaiorNumBarra,
    insertTabelaReflora,
} from '../database';
// import { processaMaiorCodBarra } from '../tombos';
/*  import reflora from './reflora'; */
import { criaListaCodBarra } from './codbarra';
import { fazRequisicaoReflora } from './reflora';
import { getNomeArquivo, escreveLOG } from '../log';

function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');
    const conexao = criaConexao();
    const tabelaReflora = criaTabelaReflora(conexao);

    selectMaiorNumBarra(conexao).then(maxCodBarra => {
        /* Faz o pré-processamento do código de barra */
        // const intMaiorCodBarra = processaMaiorCodBarra(maxCodBarra);
        const intMaiorCodBarra = 3;
        const listaCodBarra = criaListaCodBarra(intMaiorCodBarra).sort();
        return listaCodBarra;
    }).then(listaCodBarra => {
        insertTabelaReflora(tabelaReflora, listaCodBarra).then(() => {
            fazRequisicaoReflora(conexao, nomeArquivo, listaCodBarra.length).then(resultadoRequisicaoReflora => {
                if (resultadoRequisicaoReflora) {
                    // a
                }
            });
        });
    });
}

main();
