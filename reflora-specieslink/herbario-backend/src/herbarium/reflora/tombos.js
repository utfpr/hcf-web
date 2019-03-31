/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Q from 'q';
import throttledQueue from 'throttled-queue';
import {
    ehIgualNroColeta,
    ehIgualAnoColeta,
    ehIgualMesColeta,
    ehIgualDiaColeta,
    ehIgualObservacao,
    getIdCidade,
    ehIgualPais,
    ehIgualPaisSigla,
    ehIgualEstado,
    ehIgualCidade,
    ehIgualLocalidade,
    ehIgualAltitude,
    ehIgualLatitude,
    ehIgualLongitude,
    ehIgualDataIdentificacao,
    processaDataIdentificacaoReflora,
    ehIgualTipo,
    ehIgualNomeCientifico,
    ehIgualFamilia,
    ehIgualGenero,
    ehIgualEspecie,
    ehIgualVariedade,
    getIdAutor,
    ehIgualAutorNomeCientifico,
    existeAlteracaoSugerida,
} from '../datatombos';
import {
    processaRespostaReflora,
    temResultadoRespostaReflora,
} from './reflora';
import {
    selectUmaInformacaoReflora,
    selectNroTomboNumBarra,
    selectTombo,
    atualizaJaComparouTabelaReflora,
    insereAlteracaoSugerida,
} from '../database';

export async function geraJsonAlteracao(conexao, nroTombo, codBarra, informacaoReflora) {
    const promessa = Q.defer();
    selectTombo(conexao, nroTombo).then(async tomboBd => {
        if (tomboBd.length === 0) {
            promessa.resolve();
        }
        let alteracaoInformacao = '{';
        const processaInformacaoBd = tomboBd[0].dataValues;
        // número de coleta
        const resultadoNroColeta = ehIgualNroColeta(processaInformacaoBd, informacaoReflora);
        if (resultadoNroColeta !== -1) {
            alteracaoInformacao += `numero_coleta: ${resultadoNroColeta},`;
        }
        // ano de coleta
        const resultadoAnoColeta = ehIgualAnoColeta(processaInformacaoBd.data_coleta_ano, informacaoReflora.year);
        if (resultadoAnoColeta !== -1) {
            alteracaoInformacao += `ano_coleta: ${resultadoAnoColeta}, `;
        }
        // mês de coleta
        const resultadoMesColeta = ehIgualMesColeta(processaInformacaoBd.data_coleta_mes, informacaoReflora.month);
        if (resultadoMesColeta !== -1) {
            alteracaoInformacao += `mes_coleta: ${resultadoMesColeta},`;
        }
        // dia de coleta
        const resultadoDiaColeta = ehIgualDiaColeta(processaInformacaoBd, informacaoReflora);
        if (resultadoDiaColeta !== -1) {
            alteracaoInformacao += `dia_coleta: ${resultadoDiaColeta},`;
        }
        // observação
        const resultadoObservacao = ehIgualObservacao(processaInformacaoBd, informacaoReflora);
        if (resultadoObservacao.length > 0) {
            alteracaoInformacao += `observacao: ${resultadoObservacao}, `;
        }
        // país, sigla país, estado e cidade
        const idCidade = await getIdCidade(conexao, processaInformacaoBd.local_coleta_id);
        if (idCidade !== -1) {
            // país
            await ehIgualPais(conexao, idCidade, informacaoReflora.country).then(pais => {
                if (pais !== -1) {
                    alteracaoInformacao += `pais: ${pais}, `;
                }
            });
            // sigla país
            await ehIgualPaisSigla(conexao, idCidade, informacaoReflora.countrycode).then(paisSigla => {
                if (paisSigla !== -1) {
                    alteracaoInformacao += `pais_sigla: ${paisSigla}, `;
                }
            });
            // estado
            await ehIgualEstado(conexao, idCidade, informacaoReflora.stateprovince).then(estado => {
                if (estado !== -1) {
                    alteracaoInformacao += `estado: ${estado}, `;
                }
            });
            // cidade
            await ehIgualCidade(conexao, idCidade, informacaoReflora.municipality).then(cidade => {
                if (cidade !== -1) {
                    alteracaoInformacao += `cidade: ${cidade}, `;
                }
            });
            /*
                A locality (chave do json do Reflora) é formada pelo atributo
                observacao da tabela tombos e da vegetação relacionada a esse tombo
            */
            // localidade
            await ehIgualLocalidade(conexao, idCidade, processaInformacaoBd, informacaoReflora).then(localidade => {
                if (localidade !== -1) {
                    alteracaoInformacao += `localidade: ${localidade}, `;
                }
            });
        }
        // altitude
        const resultadoAltitude = ehIgualAltitude(processaInformacaoBd, informacaoReflora);
        if (resultadoAltitude !== -1) {
            alteracaoInformacao += `altitude: ${resultadoAltitude}, `;
        }
        // latitude
        const resultadoLatitude = ehIgualLatitude(processaInformacaoBd.latitude, informacaoReflora.decimallatitude);
        if (resultadoLatitude !== -1) {
            alteracaoInformacao += `latitude: ${resultadoLatitude}, `;
        }
        // longitude
        const resultadoLongitude = ehIgualLongitude(processaInformacaoBd.longitude, informacaoReflora.decimallongitude);
        if (resultadoLongitude !== -1) {
            alteracaoInformacao += `longitude: ${resultadoLongitude}, `;
        }
        // data identificação
        const resultadoDataIdentificacao = ehIgualDataIdentificacao(processaInformacaoBd, informacaoReflora);
        if (resultadoDataIdentificacao !== -1) {
            const processaResultadoDataIdentificacao = processaDataIdentificacaoReflora(resultadoDataIdentificacao);
            // console.log(processaResultadoDataIdentificacao);
            if (processaResultadoDataIdentificacao.length > 0) {
                alteracaoInformacao += processaResultadoDataIdentificacao;
            }
        }
        // tipo
        await ehIgualTipo(conexao, processaInformacaoBd.tipo_id, informacaoReflora.typestatus).then(tipo => {
            if (tipo !== -1) {
                alteracaoInformacao += `tipo: ${tipo}, `;
            }
        });
        // nome científico
        const resultadoNomeCientifico = ehIgualNomeCientifico(processaInformacaoBd.nome_cientifico, informacaoReflora.scientificname);
        if (resultadoNomeCientifico.length > 0) {
            alteracaoInformacao += `nome_cientifico: ${resultadoNomeCientifico}, `;
        }
        // família
        await ehIgualFamilia(conexao, processaInformacaoBd.familia_id, informacaoReflora.family).then(familia => {
            if (familia !== -1) {
                alteracaoInformacao += `familia: ${familia}, `;
            }
        });
        // gênero
        await ehIgualGenero(conexao, processaInformacaoBd.genero_id, informacaoReflora.genus).then(genero => {
            if (genero !== -1) {
                alteracaoInformacao += `genero: ${genero}, `;
            }
        });
        // espécie
        await ehIgualEspecie(conexao, processaInformacaoBd.especie_id, informacaoReflora.infraespecificepithet).then(especie => {
            if (especie !== -1) {
                alteracaoInformacao += `especie: ${especie}, `;
            }
        });
        // variedade
        await ehIgualVariedade(conexao, processaInformacaoBd, informacaoReflora).then(variedade => {
            if (variedade !== -1) {
                alteracaoInformacao += `especie: ${variedade}, `;
            }
        });
        const idAutor = await getIdAutor(conexao, processaInformacaoBd.especie_id);
        if (idAutor !== -1) {
            // autor nome científico
            await ehIgualAutorNomeCientifico(conexao, idAutor, informacaoReflora).then(nomeAutorCientifico => {
                if (nomeAutorCientifico !== -1) {
                    alteracaoInformacao += `nome_cientifico_autor: ${nomeAutorCientifico}, `;
                }
            });
        }
        alteracaoInformacao = alteracaoInformacao.substring(0, alteracaoInformacao.lastIndexOf(','));
        alteracaoInformacao += '}';
        // eslint-disable-next-line no-console
        console.log('==============================================================================');
        // eslint-disable-next-line no-console
        console.log(`->${alteracaoInformacao}`);
        atualizaJaComparouTabelaReflora(conexao, codBarra);
        promessa.resolve(alteracaoInformacao);
    });
    return promessa.promise;
}

/**
 * A função fazComparacaoInformacao, primeiramente verifica se tem informações
 * do reflora esperado. Se tem as informações esperada eu pego o número de tombo
 * equivalente aquele tombo de código de barra, e com esse valor de número de tombo
 * eu consigo pegar informações relacionadas a esse tombo. Comparando as informações
 * vindas do Reflora com as presentes no banco de dados, eu verifico se me gerou
 * um JSON. Quando me retorna JSON, eu verifico se existe essa alteração no banco
 * de dados se não existe eu insiro ela no banco de dados.
 * @param {*} conexao, conexão com o banco de dados para que se possa ser feito o select.
 * @param {*} codBarra, é o código de barra relacionado ao tombo do HCF.
 * @param {*} informacaoReflora, informação do tombo que está exposta do Reflora.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando acabar de realizar a comparação de informações.
 */
export function fazComparacaoInformacao(conexao, codBarra, informacaoReflora) {
    const promessa = Q.defer();
    if (temResultadoRespostaReflora(informacaoReflora)) {
        selectNroTomboNumBarra(conexao, codBarra).then(nroTombo => {
            if (nroTombo.length > 0) {
                const getNroTombo = nroTombo[0].dataValues.tombo_hcf;
                const getInformacaoReflora = informacaoReflora.result[0];
                geraJsonAlteracao(conexao, getNroTombo, codBarra, getInformacaoReflora).then(alteracao => {
                    if (alteracao.length > 2) {
                        existeAlteracaoSugerida(conexao, getNroTombo, alteracao).then(existe => {
                            if (!existe) {
                                insereAlteracaoSugerida(conexao, 10, 'ESPERANDO', getNroTombo, alteracao);
                                // eslint-disable-next-line no-console
                                console.log(alteracao);
                                promessa.resolve();
                            }
                            promessa.resolve();
                        });
                    }
                });
            }
        });
    } else {
        promessa.resolve();
    }
    return promessa.promise;
}

/**
 * A função fazComparacaoTombo, faz um select na tabela do reflora verificando
 * se tem algum tombo que já foi comparado ou não. Se o resultado dessa requisição
 * é maior que zero, então eu pego o json e começo a realizar as comparações, e depois
 * marco que esse json já foi comparado. Após isso, eu chamo novamente essa função
 * e faço isso até com que seja comparado todos os json.
 * @param {*} conexao, conexão com o banco de dados para que se possa ser feito o select.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando acabar de realizar a recursão.
 */
export function fazComparacaoTombo(conexao) {
    const promessa = Q.defer();
    const throttle = throttledQueue(1, 1000);
    selectUmaInformacaoReflora(conexao).then(informacaoReflora => {
        if (informacaoReflora.length === 0) {
            promessa.resolve(true);
        } else {
            const getCodBarra = informacaoReflora[0].dataValues.cod_barra;
            const getInformacaoReflora = processaRespostaReflora(informacaoReflora[0].dataValues.tombo_json);
            throttle(() => {
                fazComparacaoInformacao(conexao, getCodBarra, getInformacaoReflora).then(() => {
                    atualizaJaComparouTabelaReflora(conexao, getCodBarra);
                    promessa.resolve(fazComparacaoTombo(conexao));
                });
            });
        }
    });
    return promessa.promise;
}
