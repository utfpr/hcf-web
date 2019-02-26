import {
    criaConexao,
    criaTabelaReflora,
    insereTabelaReflora,
    selectCodBarra,
} from '../database';
// import { fazComparacaoTombo } from '../tombos';
import { fazRequisicaoReflora } from './reflora';
import { getNomeArquivo, escreveLOG } from '../log';

function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}');
    const conexao = criaConexao();
    const tabelaReflora = criaTabelaReflora(conexao);

    /**
     * 1.Faz o pré-processamento dos códigos de barras
     * 2.Cria uma tabela e insere os valores pré-processado nessa tabela
     * 3.A partir de todos os códigos de barras presente na tabela faz a requisição
     * 4.Com as requisições presentes no BD, faz a comparação na tabela desses tombos
    */
    selectCodBarra(conexao).then(listaCodBarra => {
        // insereTabelaReflora(tabelaReflora, listaCodBarra).then(() => {
        insereTabelaReflora(tabelaReflora, listaCodBarra.slice(0, 3)).then(async () => {
            fazRequisicaoReflora(conexao, nomeArquivo).then(b => {
                // eslint-disable-next-line no-console
                console.log('=================================================================');
                // eslint-disable-next-line no-console
                console.log(`${b}`);
                // eslint-disable-next-line no-console
                console.log('=================================================================');
            });
            /* fazRequisicaoReflora(conexao, nomeArquivo, listaCodBarra.length).then(resultadoRequisicaoReflora => {
                if (resultadoRequisicaoReflora) {
                    fazComparacaoTombo(conexao, listaCodBarra.length);
                }
            }); */
        });
    });
}

main();
