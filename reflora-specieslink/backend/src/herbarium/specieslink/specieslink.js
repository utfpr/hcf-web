import Q from 'q';
//  import { escreveLOG } from '../log';
import { selectTombo, insereAlteracaoSugerida } from '../database';
import {
    ehIgualNomeCientifico,
    ehIgualFamilia,
    ehIgualGenero,
    ehIgualEspecie,
    getIdAutor,
    ehIgualAutorNomeCientifico,
    ehIgualTipo,
    ehIgualAnoColeta,
    ehIgualMesColeta,
    getIdCidade,
    ehIgualPais,
    ehIgualEstado,
    ehIgualCidade,
    ehIgualLongitude,
    ehIgualLatitude,
    ehIgualSubespecie,
    ehIgualDataIdentificacaoAnoSl,
    ehIgualDataIdentificacaoMesSl,
    ehIgualDataIdentificacaoDiaSl,
    existeAlteracaoSugerida,
} from '../datatombos';

export function realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo) {
    // escreveLOG(nomeArquivo, 'Inicializando a aplicação do SpeciesLink.');
    const promessa = Q.defer();
    // for (let i =)
    if (listaConteudoArquivo.length === 0) {
        // console.log('acabou');
        promessa.resolve(true);
    } else {
        const conteudo = listaConteudoArquivo.pop();
        const codBarra = conteudo[3];
        selectTombo(conexao, codBarra).then(async tombo => {
            // const informacoesTomboBd = tombo[0].dataValues;
            if (tombo.length === 0) {
                // eslint-disable-next-line no-console
                console.log(`R: ${listaConteudoArquivo.length}-${tombo}`);
                promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
            } else {
                let alteracaoInformacao = '{';
                const informacoesTomboBd = tombo[0].dataValues;
                // INFORMAÇÕES DO SPECIESLINK
                const nomeCientifico = conteudo[4];
                const nomeFamilia = conteudo[10];
                const nomeGenero = conteudo[11];
                const nomeEspecie = conteudo[12];
                const nomeSubespecie = conteudo[13];
                const autorEspecie = conteudo[14]; // autor do nome cientifico
                const anoIdentificacao = conteudo[16];
                const mesIdentificacao = conteudo[17];
                const diaIdentificacao = conteudo[18];
                const nomeTipo = conteudo[19];
                const anoColeta = conteudo[23];
                const mesColeta = conteudo[24];
                const paisSl = conteudo[29];
                const estadoSl = conteudo[30];
                const cidadeSl = conteudo[31];
                const longitude = conteudo[39];
                const latitude = conteudo[40];
                const resultadoNomeCientifico = ehIgualNomeCientifico(informacoesTomboBd.nome_cientifico, nomeCientifico);
                if (resultadoNomeCientifico.length > 0) {
                    alteracaoInformacao += `nome_cientifico: ${resultadoNomeCientifico}, `;
                }
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
                const idAutor = await getIdAutor(conexao, informacoesTomboBd.especie_id);
                if (idAutor !== -1) {
                    // autor nome científico
                    await ehIgualAutorNomeCientifico(conexao, idAutor, autorEspecie).then(nomeAutorCientifico => {
                        if (nomeAutorCientifico !== -1) {
                            alteracaoInformacao += `nome_cientifico_autor: ${nomeAutorCientifico}, `;
                        }
                    });
                }
                const resultadoAnoIdentificacao = ehIgualDataIdentificacaoAnoSl(informacoesTomboBd, anoIdentificacao);
                if (resultadoAnoIdentificacao.length > 0) {
                    alteracaoInformacao += `data_ano_identificacao: ${resultadoAnoIdentificacao}, `;
                }
                const resultadoMesIdentificacao = ehIgualDataIdentificacaoMesSl(informacoesTomboBd, mesIdentificacao);
                if (resultadoMesIdentificacao.length > 0) {
                    alteracaoInformacao += `data_mes_identificacao: ${resultadoMesIdentificacao}, `;
                }
                const resultadoDiaIdentificacao = ehIgualDataIdentificacaoDiaSl(informacoesTomboBd, diaIdentificacao);
                if (resultadoDiaIdentificacao.length > 0) {
                    alteracaoInformacao += `data_dia_identificacao: ${resultadoDiaIdentificacao}, `;
                }
                await ehIgualTipo(conexao, informacoesTomboBd.tipo_id, nomeTipo).then(tipo => {
                    if (tipo !== -1) {
                        alteracaoInformacao += `tipo: ${tipo}, `;
                    }
                });
                // ano de coleta
                const resultadoAnoColeta = ehIgualAnoColeta(informacoesTomboBd.data_coleta_ano, anoColeta);
                if (resultadoAnoColeta !== -1) {
                    alteracaoInformacao += `ano_coleta: ${resultadoAnoColeta}, `;
                }
                // mês de coleta
                const resultadoMesColeta = ehIgualMesColeta(informacoesTomboBd.data_coleta_mes, mesColeta);
                if (resultadoMesColeta !== -1) {
                    alteracaoInformacao += `mes_coleta: ${resultadoMesColeta},`;
                }
                // país, sigla país, estado e cidade
                const idCidade = await getIdCidade(conexao, informacoesTomboBd.local_coleta_id);
                if (idCidade !== -1) {
                    // país
                    await ehIgualPais(conexao, idCidade, paisSl).then(pais => {
                        if (pais !== -1) {
                            alteracaoInformacao += `pais: ${pais}, `;
                        }
                    });
                    // estado
                    await ehIgualEstado(conexao, idCidade, estadoSl).then(estado => {
                        if (estado !== -1) {
                            alteracaoInformacao += `estado: ${estado}, `;
                        }
                    });
                    // cidade
                    await ehIgualCidade(conexao, idCidade, cidadeSl).then(cidade => {
                        if (cidade !== -1) {
                            alteracaoInformacao += `cidade: ${cidade}, `;
                        }
                    });
                }
                // longitude
                const resultadoLongitude = ehIgualLongitude(informacoesTomboBd.longitude, longitude);
                if (resultadoLongitude !== -1) {
                    alteracaoInformacao += `longitude: ${resultadoLongitude}, `;
                }
                // latitude
                const resultadoLatitude = ehIgualLatitude(informacoesTomboBd.latitude, latitude);
                if (resultadoLatitude !== -1) {
                    alteracaoInformacao += `latitude: ${resultadoLatitude}, `;
                }
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
