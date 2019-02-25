import {
    criaConexao,
    criaTabelaReflora,
    selectMaiorNumBarra,
    insereTabelaReflora,
} from '../database';
import {
    processaMaiorCodBarra,
    fazComparacaoTombo,
} from '../tombos';
import { criaListaCodBarra } from './codbarra';
import { fazRequisicaoReflora } from './reflora';
import { getNomeArquivo, escreveLOG } from '../log';

function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');
    const conexao = criaConexao();
    const tabelaReflora = criaTabelaReflora(conexao);

    selectMaiorNumBarra(conexao).then(maxCodBarra => {
        /**
         * 1.Faz o pré-processamento dos códigos de barras
         * 2.Cria uma tabela e insere os valores pré-processado nessa tabela
         * 3.A partir de todos os códigos de barras presente na tabela faz a requisição
         * 4.Com as requisições presentes no BD, faz a comparação na tabela desses tombos
         */
        const intMaiorCodBarra = processaMaiorCodBarra(maxCodBarra);
        // const intMaiorCodBarra = 3;
        const listaCodBarra = criaListaCodBarra(intMaiorCodBarra).sort();
        // const listaCodBarra = ['HCF000000001'];
        insereTabelaReflora(tabelaReflora, listaCodBarra).then(() => {
            fazRequisicaoReflora(conexao, nomeArquivo, listaCodBarra.length).then(resultadoRequisicaoReflora => {
                if (resultadoRequisicaoReflora) {
                    fazComparacaoTombo(conexao, listaCodBarra.length);
                }
            });
        });
    });
}

main();
