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
    ehIgualTipo,
    ehIgualNomeCientifico,
    ehIgualFamilia,
    ehIgualGenero,
    ehIgualEspecie,
    ehIgualVariedade,
    getIdAutor,
    ehIgualAutorNomeCientifico,
    processaDataIdentificacaoReflora,
} from './datatombos';
import { processaRespostaReflora, temResultadoRespostaReflora } from './reflora/reflora';
import { selectUmaInformacaoReflora, selectNroTomboNumBarra, selectTombo } from './database';

export function geraJsonAlteracao(conexao, nroTombo, informacaoReflora) {
    const promessa = Q.defer();
    selectTombo(conexao, nroTombo).then(tomboBd => {
        if (tomboBd.length === 0) {
            promessa.resolve();
        }
        return tomboBd;
    }).then(async tomboBd => {
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
        }
        // eslint-disable-next-line no-console
        console.log(`${alteracaoInformacao}`);
        promessa.resolve(alteracaoInformacao);
    });
    return promessa.promise;
}

function fazComparacaoInformacao(conexao, codBarra, informacaoReflora) {
    const promessa = Q.defer();
    /**
     * Só vai fazer a comparação se tiver resultado
     */
    if (temResultadoRespostaReflora(informacaoReflora)) {
        selectNroTomboNumBarra(conexao, codBarra).then(nroTombo => {
            if (nroTombo.length === 0) {
                promessa.resolve();
            }
            return nroTombo;
        }).then(nroTombo => {
            const getNroTombo = nroTombo[0].dataValues.tombo_hcf;
            geraJsonAlteracao(conexao, getNroTombo, informacaoReflora);
            promessa.resolve();
        });
    }
    return promessa.promise;
}

export function fazComparacaoTombo(conexao, quantidadeCodBarra) {
    const throttle = throttledQueue(1, 4000);
    // const promessa = Q.defer();
    for (let i = 0, p = Promise.resolve(); i < quantidadeCodBarra + 1; i += 1) {
        p = p.then(_ => new Promise(resolve => {
            throttle(() => {
                selectUmaInformacaoReflora(conexao).then(informacaoReflora => {
                    if (informacaoReflora.length === 0) {
                        resolve();
                    }
                    return informacaoReflora;
                }).then(informacaoReflora => {
                    const getCodBarra = informacaoReflora[0].dataValues.cod_barra;
                    const getInformacaoReflora = processaRespostaReflora(informacaoReflora[0].dataValues.tombo_json);
                    fazComparacaoInformacao(conexao, getCodBarra, getInformacaoReflora);
                    // eslint-disable-next-line no-console
                    // console.log(getInformacaoReflora);
                    resolve();
                });
            });
        }));
        /* p = p.then(_ => new Promise(resolve => {
        })); */
    }
    // return promessa.promise;
}

export function processaMaiorCodBarra(maiorCodBarra) {
    const novoMaxCodBarra = maiorCodBarra.replace('HCF', '');
    return parseInt(novoMaxCodBarra);
}
