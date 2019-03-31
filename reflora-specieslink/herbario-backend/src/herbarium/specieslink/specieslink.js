import Q from 'q';
import { selectTombo, insereAlteracaoSugerida } from '../database';
import {
    ehIgualFamilia,
    ehIgualGenero,
    ehIgualEspecie,
    ehIgualSubespecie,
    existeAlteracaoSugerida,
} from '../comparainformacao';

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
                    // a
                    existeAlteracaoSugerida(conexao, codBarra, alteracaoInformacao).then(existe => {
                        // console.log(existe);
                        if (!existe) {
                            insereAlteracaoSugerida(conexao, 10, 'ESPERANDO', codBarra, alteracaoInformacao);
                            // eslint-disable-next-line no-console
                            console.log(`R: ${listaConteudoArquivo.length}-${alteracaoInformacao}`);
                            promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
                        } else {
                            // eslint-disable-next-line no-console
                            console.log(`R: ${listaConteudoArquivo.length}-${alteracaoInformacao}`);
                            promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
                        }
                    });
                } else {
                    // eslint-disable-next-line no-console
                    console.log(`R: ${listaConteudoArquivo.length}-${alteracaoInformacao}`);
                    promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
                }
            }
        });
    }
    return promessa.promise;
    /*
        const identificador = conteudo[15];
    */
}

export default { };
