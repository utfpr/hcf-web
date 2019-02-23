import { criaConexao, selectMaxNumBarra } from '../database';
import { processaMaiorCodBarra } from '../tombos';
/*  import reflora from './reflora'; */
import { criaArrayCodBarra } from './codbarra';
import { createTableReflora, insertTableReflora } from './reflora';
import { getNomeArquivo, escreveLOG } from '../log';

async function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');
    const conexao = criaConexao(nomeArquivo);
    const tabelaReflora = createTableReflora(conexao);

    selectMaxNumBarra(conexao, maxCodBarra => {
        // maxCodBarra
        const intMaiorCodBarra = processaMaiorCodBarra(nomeArquivo, maxCodBarra);
        const arrayCodBarra = criaArrayCodBarra(nomeArquivo, intMaiorCodBarra).sort();
        insertTableReflora(tabelaReflora, arrayCodBarra);
        // console.log(arrayCodBarra);
        // insert
    });
    // console.log(`b${maiorCodBarra}`);
    /* selectMaxNumBarra(conexao, maxCodBarra => {

        // eslint-disable-next-line no-console
        console.log(intMaiorCodBarra);
        // const intMaiorCodBarra = 1;

        reflora.requisicaoReflora(nomeArquivo, conexao, arrayCodBarra);
    }); */
}

main();
