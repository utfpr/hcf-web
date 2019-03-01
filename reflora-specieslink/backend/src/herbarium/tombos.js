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
} from './datatombos';
import {
    processaRespostaReflora,
    temResultadoRespostaReflora,
} from './reflora/reflora';
import {
    selectUmaInformacaoReflora,
    selectNroTomboNumBarra,
    selectTombo,
    atualizaJaComparouTabelaReflora,
    insereAlteracaoSugerida,
} from './database';

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
        const resultadoAnoColeta = ehIgualAnoColeta(processaInformacaoBd, informacaoReflora);
        if (resultadoAnoColeta !== -1) {
            alteracaoInformacao += `ano_coleta: ${resultadoAnoColeta}, `;
        }
        // mês de coleta
        const resultadoMesColeta = ehIgualMesColeta(processaInformacaoBd, informacaoReflora);
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
        const idCidade = await getIdCidade(conexao, processaInformacaoBd);
        if (idCidade !== -1) {
            // país
            await ehIgualPais(conexao, idCidade, informacaoReflora).then(pais => {
                if (pais !== -1) {
                    alteracaoInformacao += `pais: ${pais}, `;
                }
            });
            // sigla país
            await ehIgualPaisSigla(conexao, idCidade, informacaoReflora).then(paisSigla => {
                if (paisSigla !== -1) {
                    alteracaoInformacao += `pais_sigla: ${paisSigla}, `;
                }
            });
            // estado
            await ehIgualEstado(conexao, idCidade, informacaoReflora).then(estado => {
                if (estado !== -1) {
                    alteracaoInformacao += `estado: ${estado}, `;
                }
            });
            // cidade
            await ehIgualCidade(conexao, idCidade, informacaoReflora).then(cidade => {
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
        const resultadoLatitude = ehIgualLatitude(processaInformacaoBd, informacaoReflora);
        if (resultadoLatitude !== -1) {
            alteracaoInformacao += `latitude: ${resultadoLatitude}, `;
        }
        // longitude
        const resultadoLongitude = ehIgualLongitude(processaInformacaoBd, informacaoReflora);
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
        await ehIgualTipo(conexao, processaInformacaoBd, informacaoReflora).then(tipo => {
            if (tipo !== -1) {
                alteracaoInformacao += `tipo: ${tipo}, `;
            }
        });
        // nome científico
        const resultadoNomeCientifico = ehIgualNomeCientifico(processaInformacaoBd, informacaoReflora);
        if (resultadoNomeCientifico.length > 0) {
            alteracaoInformacao += `nome_cientifico: ${resultadoNomeCientifico}, `;
        }
        // família
        await ehIgualFamilia(conexao, processaInformacaoBd, informacaoReflora).then(familia => {
            if (familia !== -1) {
                alteracaoInformacao += `familia: ${familia}, `;
            }
        });
        // gênero
        await ehIgualGenero(conexao, processaInformacaoBd, informacaoReflora).then(genero => {
            if (genero !== -1) {
                alteracaoInformacao += `genero: ${genero}, `;
            }
        });
        // espécie
        await ehIgualEspecie(conexao, processaInformacaoBd, informacaoReflora).then(especie => {
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
        const idAutor = await getIdAutor(conexao, informacaoReflora);
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

export function fazComparacaoInformacao(conexao, codBarra, informacaoReflora) {
    /**
     * 1.Só vai fazer a comparação se tiver resultado na resposta do reflora
     * 2.Gera o JSON das informações que são divergentes
     * 3.Verifica se esse JSON já foi sugerido (Falta mais aqui, a comparação do json)
     * 4.Insere no banco de dados caso não exista (Falta habilitar)
     * (Parâmetros: id do usuário, status da aprovação, númerto do tombo e tombo no formato json)
     */
    const promessa = Q.defer();
    if (temResultadoRespostaReflora(informacaoReflora)) {
        selectNroTomboNumBarra(conexao, codBarra).then(nroTombo => {
            if (nroTombo.length > 0) {
                const getNroTombo = nroTombo[0].dataValues.tombo_hcf;
                const getInformacaoReflora = informacaoReflora.result[0];
                geraJsonAlteracao(conexao, getNroTombo, codBarra, getInformacaoReflora).then(alteracao => {
                    if (alteracao.length > 2) {
                        existeAlteracaoSugerida(conexao, getNroTombo, alteracao).then(existe => {
                            // console.log(existe);
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

export function fazComparacaoTombo(conexao) {
    /**
     * 1.Para uma dada quantidade de itens faz um select (usando limit e quando não tenha sido comparado)
     * 2.Com o valor retornado, pega o valor de código de barra e procurar informações daquele tombo no BD
     * 3.Faz a comparação de informações
     * Falta tratar quando chega na última iteração (Feito)
     */
    const promessa = Q.defer();
    const throttle = throttledQueue(1, 1000);
    throttle(() => {
        selectUmaInformacaoReflora(conexao).then(informacaoReflora => {
            if (informacaoReflora.length === 0) {
                promessa.resolve(true);
            } else {
                const getCodBarra = informacaoReflora[0].dataValues.cod_barra;
                const getInformacaoReflora = processaRespostaReflora(informacaoReflora[0].dataValues.tombo_json);
                fazComparacaoInformacao(conexao, getCodBarra, getInformacaoReflora).then(() => {
                    atualizaJaComparouTabelaReflora(conexao, getCodBarra);
                    promessa.resolve(fazComparacaoTombo(conexao));
                });
            }
        });
    });
    return promessa.promise;
}
