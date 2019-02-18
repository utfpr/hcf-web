import { criaConexao, selectMaxNumBarra } from '../database';
import { processaMaiorCodBarra } from '../tombos';
import reflora from './reflora';
import { criaArrayCodBarra } from './codbarra';
import { getNomeArquivo, escreveLOG } from '../log';

function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');

    const conexao = criaConexao(nomeArquivo);
    selectMaxNumBarra(conexao, maxCodBarra => {
        const intMaiorCodBarra = processaMaiorCodBarra(nomeArquivo, maxCodBarra);
        // const intMaiorCodBarra = 5;
        const arrayCodBarra = criaArrayCodBarra(nomeArquivo, intMaiorCodBarra).sort();
        reflora.requisicaoReflora(nomeArquivo, conexao, arrayCodBarra);
    });
}

main();
