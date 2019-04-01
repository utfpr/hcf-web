import Q from 'q';
import { selectTombo, insereAlteracaoSugerida } from '../database';
import {
    ehIgualFamilia,
    ehIgualGenero,
    ehIgualEspecie,
    ehIgualSubespecie,
    existeAlteracaoSugerida,
} from '../comparainformacao';

/**
 * A função realizaComparacao, ela percorre a lista de conteúdo de informações
 * presentes no arquivo do species Link que foi passado por parâmetro, e de maneira
 * recursivamente, e em cada iteração que retorna um elemento da lista é feito a
 * comparação das informações. Todas as informações que forem divergentes que forem encontradas
 * serão adicionadas no JSON. Com esse JSON gerado, é verificado se esse JSON já
 * está presente na tabela de alterações, se está na tabela de alterações não será inserido,
 * caso não esteja presente é inserido essa alteração.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @param {*} nomeArquivo, é o nome do arquivo aonde será escrito quando iniciou ou terminou
 * o processo de comparação.
 * @param {*} listaConteudoArquivo, é o conteúdo do arquivo do species Link carregado nessa lista.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando acabar de realizar a comparação de informações.
 */
export function realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo) {
    const promessa = Q.defer();
    if (listaConteudoArquivo.length === 0) {
        promessa.resolve(true);
    } else {
        const conteudo = listaConteudoArquivo.pop();
        const codBarra = conteudo[3];
        selectTombo(conexao, codBarra).then(async tombo => {
            if (tombo.length === 0) {
                promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
            } else {
                let alteracaoInformacao = '{';
                const informacoesTomboBd = tombo[0].dataValues;
                // INFORMAÇÕES DO SPECIESLINK
                const nomeFamilia = conteudo[10];
                const nomeGenero = conteudo[11];
                const nomeEspecie = conteudo[12];
                const nomeSubespecie = conteudo[13];
                await ehIgualFamilia(conexao, informacoesTomboBd.familia_id, nomeFamilia).then(familia => {
                    if (familia !== -1) {
                        alteracaoInformacao += `familia: ${familia}, `;
                    }
                });
                await ehIgualGenero(conexao, informacoesTomboBd.genero_id, nomeGenero).then(genero => {
                    if (genero !== -1) {
                        alteracaoInformacao += `genero: ${genero}, `;
                    }
                });
                await ehIgualEspecie(conexao, informacoesTomboBd.especie_id, nomeEspecie).then(especie => {
                    if (especie !== -1) {
                        alteracaoInformacao += `especie: ${especie}, `;
                    }
                });
                // subespecie
                await ehIgualSubespecie(conexao, informacoesTomboBd.sub_especie_id, nomeSubespecie).then(subespecie => {
                    if (subespecie !== -1) {
                        alteracaoInformacao += `subespecie: ${subespecie}, `;
                    }
                });
                alteracaoInformacao = alteracaoInformacao.substring(0, alteracaoInformacao.lastIndexOf(','));
                alteracaoInformacao += '}';
                if (alteracaoInformacao.length > 2) {
                    existeAlteracaoSugerida(conexao, codBarra, alteracaoInformacao).then(existe => {
                        if (!existe) {
                            insereAlteracaoSugerida(conexao, 10, 'ESPERANDO', codBarra, alteracaoInformacao);
                            promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
                        } else {
                            promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
                        }
                    });
                } else {
                    promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
                }
            }
        });
    }
    return promessa.promise;
}

export default { };
