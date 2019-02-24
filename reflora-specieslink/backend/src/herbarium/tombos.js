/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import { selectNroTomboNumBarra, selectTombo } from './database';
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
    verificaAlteracaoSugerida,
} from './datatombos';

async function comparaInformacoesTombos(conexao, nroTombo, codBarra, tomboBD, tomboReflora) {
    if (tomboBD.length > 0) {
        const informacaoTomboBD = tomboBD[0].dataValues;
        const informacaoTomboReflora = tomboReflora.result[0];
        let alteracaoInformacao = '{';
        // número de coleta
        const resultadoNroColeta = ehIgualNroColeta(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoNroColeta !== -1) {
            alteracaoInformacao += `numero_coleta: ${resultadoNroColeta},`;
        }
        // ano de coleta
        const resultadoAnoColeta = ehIgualAnoColeta(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoAnoColeta !== -1) {
            alteracaoInformacao += `ano_coleta: ${resultadoAnoColeta}, `;
        }
        // mês de coleta
        const resultadoMesColeta = ehIgualMesColeta(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoMesColeta !== -1) {
            alteracaoInformacao += `mes_coleta: ${resultadoMesColeta},`;
        }
        // dia de coleta
        const resultadoDiaColeta = ehIgualDiaColeta(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoDiaColeta !== -1) {
            alteracaoInformacao += `dia_coleta: ${resultadoDiaColeta},`;
        }
        // observação
        const resultadoObservacao = ehIgualObservacao(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoObservacao.length > 0) {
            alteracaoInformacao += `observacao: ${resultadoObservacao}, `;
        }
        // país, sigla país, estado e cidade
        const idCidade = await getIdCidade(conexao, informacaoTomboBD);
        // const idCidade = await getIDCidade(conexao, informacaoTomboBD) + 15;
        if (idCidade !== -1) {
            // país
            await ehIgualPais(conexao, idCidade, informacaoTomboReflora).then(pais => {
                if (pais !== -1) {
                    alteracaoInformacao += `pais: ${pais}, `;
                }
            });
            // sigla país
            await ehIgualPaisSigla(conexao, idCidade, informacaoTomboReflora).then(paisSigla => {
                if (paisSigla !== -1) {
                    alteracaoInformacao += `pais_sigla: ${paisSigla}, `;
                }
            });
            // estado
            await ehIgualEstado(conexao, idCidade, informacaoTomboReflora).then(estado => {
                if (estado !== -1) {
                    alteracaoInformacao += `estado: ${estado}, `;
                }
            });
            // cidade
            await ehIgualCidade(conexao, idCidade, informacaoTomboReflora).then(cidade => {
                if (cidade !== -1) {
                    alteracaoInformacao += `cidade: ${cidade}, `;
                }
            });
            /*
                A locality (chave do json do Reflora) é formada pelo atributo
                observacao da tabela tombos e da vegetação relacionada a esse tombo
            */
            // localidade
            await ehIgualLocalidade(conexao, idCidade, informacaoTomboBD, informacaoTomboReflora).then(localidade => {
                if (localidade !== -1) {
                    alteracaoInformacao += `localidade: ${localidade}, `;
                }
            });
        }
        // altitude
        const resultadoAltitude = ehIgualAltitude(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoAltitude !== -1) {
            alteracaoInformacao += `altitude: ${resultadoAltitude}, `;
        }
        // latitude
        const resultadoLatitude = ehIgualLatitude(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoLatitude !== -1) {
            alteracaoInformacao += `latitude: ${resultadoLatitude}, `;
        }
        // longitude
        const resultadoLongitude = ehIgualLongitude(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoLongitude !== -1) {
            alteracaoInformacao += `longitude: ${resultadoLongitude}, `;
        }
        // data identificação
        const resultadoDataIdentificacao = ehIgualDataIdentificacao(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoDataIdentificacao !== -1) {
            if ((resultadoDataIdentificacao.indexOf('/') === -1) && (resultadoDataIdentificacao.lastIndexOf('/') === -1)) {
                alteracaoInformacao += `data_identificacao_ano: ${resultadoDataIdentificacao}, `;
            } else if (resultadoDataIdentificacao.indexOf('/') === resultadoDataIdentificacao.lastIndexOf('/')) {
                alteracaoInformacao += `data_identificacao_mes: ${resultadoDataIdentificacao.substring(0, resultadoDataIdentificacao.indexOf('/'))}, `;
                alteracaoInformacao += `data_identificacao_ano: ${resultadoDataIdentificacao.substring(resultadoDataIdentificacao.indexOf('/') + 1, resultadoDataIdentificacao.length)}, `;
            } else if (resultadoDataIdentificacao.indexOf('/') !== resultadoDataIdentificacao.lastIndexOf('/')) {
                alteracaoInformacao += `data_identificacao_dia: ${resultadoDataIdentificacao.substring(0, resultadoDataIdentificacao.indexOf('/'))}, `;
                alteracaoInformacao += `data_identificacao_mes: ${resultadoDataIdentificacao.substring(resultadoDataIdentificacao.indexOf('/') + 1, resultadoDataIdentificacao.lastIndexOf('/'))}, `;
                alteracaoInformacao += `data_identificacao_ano: ${resultadoDataIdentificacao.substring(resultadoDataIdentificacao.lastIndexOf('/') + 1, resultadoDataIdentificacao.length)}, `;
            }
        }
        // tipo
        await ehIgualTipo(conexao, informacaoTomboBD, informacaoTomboReflora).then(tipo => {
            if (tipo !== -1) {
                alteracaoInformacao += `tipo: ${tipo}, `;
            }
        });
        // nome científico
        const resultadoNomeCientifico = ehIgualNomeCientifico(informacaoTomboBD, informacaoTomboReflora);
        if (resultadoNomeCientifico.length > 0) {
            alteracaoInformacao += `nome_cientifico: ${resultadoNomeCientifico}, `;
        }
        // família
        await ehIgualFamilia(conexao, informacaoTomboBD, informacaoTomboReflora).then(familia => {
            if (familia !== -1) {
                alteracaoInformacao += `familia: ${familia}, `;
            }
        });
        // gênero
        await ehIgualGenero(conexao, informacaoTomboBD, informacaoTomboReflora).then(genero => {
            if (genero !== -1) {
                alteracaoInformacao += `genero: ${genero}, `;
            }
        });
        // espécie
        await ehIgualEspecie(conexao, informacaoTomboBD, informacaoTomboReflora).then(especie => {
            if (especie !== -1) {
                alteracaoInformacao += `especie: ${especie}, `;
            }
        });
        // variedade
        await ehIgualVariedade(conexao, informacaoTomboBD, informacaoTomboReflora).then(variedade => {
            if (variedade !== -1) {
                alteracaoInformacao += `especie: ${variedade}, `;
            }
        });
        const idAutor = await getIdAutor(conexao, informacaoTomboBD);
        if (idAutor !== -1) {
            // autor nome científico
            await ehIgualAutorNomeCientifico(conexao, idAutor, informacaoTomboReflora).then(nomeAutorCientifico => {
                if (nomeAutorCientifico !== -1) {
                    alteracaoInformacao += `nome_cientifico_autor: ${nomeAutorCientifico}, `;
                }
            });
        }
        alteracaoInformacao = alteracaoInformacao.substring(0, alteracaoInformacao.lastIndexOf(','));
        alteracaoInformacao += '}';
        verificaAlteracaoSugerida(conexao, nroTombo, alteracaoInformacao).then(resultadoAlteracaoSugerida => {
            if (resultadoAlteracaoSugerida === 1) {
                // Concateno o nome do identificador do Reflora e faço o insert
                alteracaoInformacao = alteracaoInformacao.replace('}', `, nome_identificador: ${informacaoTomboReflora.identifiedby}}`);
                // eslint-disable-next-line no-console
                console.log(`->${codBarra}`);
                // eslint-disable-next-line no-console
                console.log(`->${alteracaoInformacao}`);
            } else {
                // eslint-disable-next-line no-console
                console.log(resultadoAlteracaoSugerida);
            }
        });
    }
}

export function comparaTombo(conexao, codBarra, respostaReflora) {
    selectNroTomboNumBarra(conexao, codBarra, nroTombo => {
        const nroTomboBD = nroTombo[0].dataValues.tombo_hcf;
        selectTombo(conexao, nroTomboBD, tombo => {
            comparaInformacoesTombos(conexao, nroTomboBD, codBarra, tombo, respostaReflora);
        });
    });
}

export function processaMaiorCodBarra(maiorCodBarra) {
    const novoMaxCodBarra = maiorCodBarra.replace('HCF', '');
    return parseInt(novoMaxCodBarra);
}
