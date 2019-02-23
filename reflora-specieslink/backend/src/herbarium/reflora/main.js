import { criaConexao, selectMaxNumBarra } from '../database';
// import { processaMaiorCodBarra } from '../tombos';
/*  import reflora from './reflora'; */
import { criaArrayCodBarra } from './codbarra';
import { createTableReflora, insertTableReflora } from './reflora';
// import { createTableReflora } from './reflora';
import { getNomeArquivo, escreveLOG } from '../log';

async function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');
    const conexao = criaConexao(nomeArquivo);
    const tabelaReflora = createTableReflora(conexao);

    selectMaxNumBarra(conexao).then(maxCodBarra => {
        /* Faz o pré-processamento do código de barra */
        // const intMaiorCodBarra = processaMaiorCodBarra(nomeArquivo, maxCodBarra);
        const intMaiorCodBarra = 5;
        const arrayCodBarra = criaArrayCodBarra(nomeArquivo, intMaiorCodBarra).sort();
        return arrayCodBarra;
    }).then(arrayCodBarra => {
        insertTableReflora(tabelaReflora, arrayCodBarra).then(() => {
            console.log('a');
        });
    });
    // const intMaiorCodBarra = processaMaiorCodBarra(nomeArquivo, maxCodBarra);
    // const intMaiorCodBarra = 1;
    // const arrayCodBarra = criaArrayCodBarra(nomeArquivo, intMaiorCodBarra).sort();
    // insertTableReflora(tabelaReflora, arrayCodBarra);
    // });
    // eslint-disable-next-line no-console
    // console.log(`b${maiorCodBarra}`);
    /* selectMaxNumBarra(conexao, maxCodBarra => {

        // eslint-disable-next-line no-console
        console.log(intMaiorCodBarra);
        // const intMaiorCodBarra = 1;

        reflora.requisicaoReflora(nomeArquivo, conexao, arrayCodBarra);
    }); */
}

main();
