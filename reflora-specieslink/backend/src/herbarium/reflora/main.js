import { criaConexao, selectMaxNumBarra } from '../database';
import { processaMaiorCodBarra } from '../tombos';
import reflora from './reflora';
import { getNomeArquivo, escreveLOG } from '../log';

function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');

    const conexao = criaConexao(nomeArquivo);
    selectMaxNumBarra(conexao, maxCodBarra => {
        const intMaiorCodBarra = processaMaiorCodBarra(nomeArquivo, maxCodBarra);
        reflora.doRequest(nomeArquivo, conexao, intMaiorCodBarra);
    });
}

main();
