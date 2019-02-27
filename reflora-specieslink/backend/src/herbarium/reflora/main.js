import {
    criaConexao,
    criaTabelaReflora,
    insereTabelaReflora,
    selectCodBarra,
    apagaTabelaReflora,
    existeTabelaReflora,
} from '../database';
import { fazComparacaoTombo } from '../tombos';
import { fazRequisicaoReflora } from './reflora';
import { getNomeArquivo, escreveLOG } from '../log';

function main() {
    const nomeArquivo = getNomeArquivo();
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do {Reflora}.');
    const conexao = criaConexao();

    /**
     * 1.Cria a tabela do Reflora e insere os códigos de barra nela
     * 2.A partir de todos os códigos de barras presente na tabela faz a requisição
     * 3.Com os resultados das requisições presentes no BD, faz a comparação dessas informações
     * Detalhe: comentário com duas barras (//) são usados para testes
    */
    existeTabelaReflora(conexao).then(existe => {
        if (existe) {
            process.exit(0);
        }
        const tabelaReflora = criaTabelaReflora(conexao);
        selectCodBarra(conexao).then(listaCodBarra => {
            // insereTabelaReflora(tabelaReflora, listaCodBarra).then(() => {
            insereTabelaReflora(tabelaReflora, listaCodBarra.slice(0, 50)).then(() => {
                fazRequisicaoReflora(conexao, nomeArquivo).then(resultadoRequisicaoReflora => {
                    if (resultadoRequisicaoReflora) {
                        fazComparacaoTombo(conexao).then(resultadoComparacao => {
                            if (resultadoComparacao) {
                                escreveLOG(nomeArquivo, 'O processo de comparação do {Reflora} acabou.');
                                apagaTabelaReflora(conexao);
                                // process.exit(0);
                            }
                        });
                    }
                });
            });
        });
    });

}

main();
