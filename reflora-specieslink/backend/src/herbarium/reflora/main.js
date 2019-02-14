import database from '../database';
import tombos from '../tombos';
import reflora from './reflora';
import { getNomeArquivo, escreveLOG } from '../log';

function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');

    const conexao = database.criaConexao(nomeArquivo);
    database.selectMaxNumBarra(conexao, maxCodBarra => {
        const intMaiorCodBarra = tombos.processaMaiorCodBarra(nomeArquivo, maxCodBarra);
        reflora.requisicaoReflora(nomeArquivo, conexao, intMaiorCodBarra);
    });
}

main();
