import Q from 'q';
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
import {
    getNomeArquivo,
    escreveLOG,
    leLOG,
    transformaLog,
} from '../log';

function comecaReflora(conexao, nomeArquivo) {
    const promessa = Q.defer();

    escreveLOG(nomeArquivo, 'Inicializando a aplicação do Reflora.');
    const tabelaReflora = criaTabelaReflora(conexao);
    selectCodBarra(conexao).then(listaCodBarra => {
        // insereTabelaReflora(tabelaReflora, listaCodBarra).then(() => {
        insereTabelaReflora(tabelaReflora, listaCodBarra.slice(0, 90)).then(() => {
            fazRequisicaoReflora(conexao, nomeArquivo).then(resultadoRequisicaoReflora => {
                if (resultadoRequisicaoReflora) {
                    fazComparacaoTombo(conexao).then(resultadoComparacao => {
                        if (resultadoComparacao) {
                            escreveLOG(nomeArquivo, 'O processo de comparação do Reflora acabou.');
                            apagaTabelaReflora(conexao).then(() => {
                                promessa.resolve();
                            });
                        }
                    });
                }
            });
        });
    });

    return promessa.promise;
}

function ehNecessarioFazerRequisicao(nomeArquivo) {
    const promessa = Q.defer();
    const conexao = criaConexao();

    /**
     * 1.Cria a tabela do Reflora e insere os códigos de barra nela
     * 2.A partir de todos os códigos de barras presente na tabela faz a requisição
     * 3.Com os resultados das requisições presentes no BD, faz a comparação dessas informações
     * Detalhe: comentário com duas barras (//) são usados para testes
    */
    existeTabelaReflora(conexao).then(existe => {
        if (existe) {
            promessa.resolve();
        } else {
            promessa.resolve(comecaReflora(conexao, nomeArquivo));
        }
    });
    return promessa.promise;
}

export function main() {
    const promessa = Q.defer();
    const nomeArquivo = getNomeArquivo();
    ehNecessarioFazerRequisicao(nomeArquivo).then(() => {
        // transformaLog(leLOG(nomeArquivo));
        // promessa.resolve(JSON.parse('{ "horario":"4040404", "log": [ { "name":"Ford" } , { "name":"BMW" } ] }'));
        promessa.resolve(transformaLog(leLOG(nomeArquivo)));
    });
    return promessa.promise;
}

export function agenda(horario, periodicidade) {
    const promessa = Q.defer();
    // eslint-disable-next-line no-console
    console.log(`h${horario}`);
    // eslint-disable-next-line no-console
    console.log(`p${periodicidade}`);
    promessa.resolve();
    return promessa.promise;
}

export default {};
