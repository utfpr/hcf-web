import {
    criaConexao,
    criaTabelaReflora,
    selectMaiorNumBarra,
    insertTabelaReflora,
} from '../database';
import { processaMaiorCodBarra } from '../tombos';
/*  import reflora from './reflora'; */
import { criaArrayCodBarra } from './codbarra';
import { fazRequisicaoReflora } from './reflora';
import { getNomeArquivo, escreveLOG } from '../log';

function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');
    const conexao = criaConexao(nomeArquivo);
    const tabelaReflora = criaTabelaReflora(conexao);

    selectMaiorNumBarra(conexao).then(maxCodBarra => {
        /* Faz o pré-processamento do código de barra */
        const intMaiorCodBarra = processaMaiorCodBarra(nomeArquivo, maxCodBarra);
        // const intMaiorCodBarra = 5;
        const arrayCodBarra = criaArrayCodBarra(nomeArquivo, intMaiorCodBarra).sort();
        return arrayCodBarra;
    }).then(arrayCodBarra => {
        insertTabelaReflora(tabelaReflora, arrayCodBarra).then(() => {
            // select * from reflora where contador=0 limit 1
            // update reflora set contador=0 where cod_barra='HCF000000001'
            // eslint-disable-next-line no-console
            // console.log('a');
            fazRequisicaoReflora(conexao, arrayCodBarra.length);
        });
    });
    // const intMaiorCodBarra = processaMaiorCodBarra(nomeArquivo, maxCodBarra);
    // const intMaiorCodBarra = 1;
    // const arrayCodBarra = criaArrayCodBarra(nomeArquivo, intMaiorCodBarra).sort();
    // insertTableReflora(tabelaReflora, arrayCodBarra);
    // });
    // eslint-disbale-next-line no-console
    // console.log(`b${maiorCodBarra}`);
    /* selectMaxNumBarra(conexao, maxCodBarra => {

        // eslint-disable-next-line no-console
        console.log(intMaiorCodBarra);
        // const intMaiorCodBarra = 1;

        reflora.requisicaoReflora(nomeArquivo, conexao, arrayCodBarra);
    }); */
}

main();
