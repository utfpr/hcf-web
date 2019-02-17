/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import { selectNroTomboNumBarra, selectTombo } from './database';
import { escreveLOG } from './log';
import {
    ehIgualNroColeta,
    ehIgualAnoColeta,
    ehIgualMesColeta,
    ehIgualDiaColeta,
    ehIgualObservacao,
    getIDCidade,
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
    getIDAutor,
    ehIgualAutorNomeCientifico,
} from './datatombos';

async function comparaInformacoesTombos(nomeArquivo, conexao, codBarra, tomboBD, tomboReflora) {
    escreveLOG(nomeArquivo, `Comparando informações do tombo de código de barra {${codBarra}}`);
    if (tomboBD.length > 0) {
        const informacaoTomboBD = tomboBD[0].dataValues;
        const informacaoTomboReflora = tomboReflora.result[0];
        let alteracaoInformacao = '{';
        escreveLOG(nomeArquivo, 'Comparando informações de número de coleta');
        const resultadoNroColeta = ehIgualNroColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoNroColeta !== -1) {
            alteracaoInformacao += `numero_coleta: ${resultadoNroColeta},`;
        }
        escreveLOG(nomeArquivo, 'Comparando informações de ano de coleta');
        const resultadoAnoColeta = ehIgualAnoColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoAnoColeta !== -1) {
            alteracaoInformacao += `ano_coleta: ${resultadoAnoColeta}, `;
        }
        escreveLOG(nomeArquivo, 'Comparando informações de mês de coleta');
        const resultadoMesColeta = ehIgualMesColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoMesColeta !== -1) {
            alteracaoInformacao += `mes_coleta: ${resultadoMesColeta},`;
        }
        escreveLOG(nomeArquivo, 'Comparando informações de dia de coleta');
        const resultadoDiaColeta = ehIgualDiaColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoDiaColeta !== -1) {
            alteracaoInformacao += `dia_coleta: ${resultadoDiaColeta},`;
        }
        escreveLOG(nomeArquivo, 'Comparando informações de observação');
        const resultadoObservacao = ehIgualObservacao(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoObservacao.length > 0) {
            alteracaoInformacao += `observacao: ${resultadoObservacao}, `;
        }
        escreveLOG(nomeArquivo, 'Comparando informações de país, sigla país, estado e cidade');
        const idCidade = await getIDCidade(nomeArquivo, conexao, informacaoTomboBD);
        // const idCidade = await getIDCidade(nomeArquivo, conexao, informacaoTomboBD) + 15;
        if (idCidade !== -1) {
            escreveLOG(nomeArquivo, 'Comparando informações de país');
            await ehIgualPais(nomeArquivo, conexao, idCidade, informacaoTomboReflora).then(pais => {
                if (pais !== -1) {
                    alteracaoInformacao += `pais: ${pais}, `;
                }
            });
            escreveLOG(nomeArquivo, 'Comparando informações de sigla de país');
            await ehIgualPaisSigla(nomeArquivo, conexao, idCidade, informacaoTomboReflora).then(paisSigla => {
                if (paisSigla !== -1) {
                    alteracaoInformacao += `pais_sigla: ${paisSigla}, `;
                }
            });
            escreveLOG(nomeArquivo, 'Comparando informações de estado');
            await ehIgualEstado(nomeArquivo, conexao, idCidade, informacaoTomboReflora).then(estado => {
                if (estado !== -1) {
                    alteracaoInformacao += `estado: ${estado}, `;
                }
            });
            escreveLOG(nomeArquivo, 'Comparando informações de cidade');
            await ehIgualCidade(nomeArquivo, conexao, idCidade, informacaoTomboReflora).then(cidade => {
                if (cidade !== -1) {
                    alteracaoInformacao += `cidade: ${cidade}, `;
                }
            });
            /*
                A locality (chave do json do Reflora) é formada pelo atributo
                observacao da tabela tombos e da vegetação relacionada a esse tombo
            */
            escreveLOG(nomeArquivo, 'Comparando informações de localidade');
            await ehIgualLocalidade(nomeArquivo, conexao, idCidade, informacaoTomboBD, informacaoTomboReflora).then(localidade => {
                if (localidade !== -1) {
                    alteracaoInformacao += `localidade: ${localidade}, `;
                }
            });
        }
        escreveLOG(nomeArquivo, 'Comparando informações de altitude');
        const resultadoAltitude = ehIgualAltitude(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoAltitude !== -1) {
            alteracaoInformacao += `altitude: ${resultadoAltitude}, `;
        }
        escreveLOG(nomeArquivo, 'Comparando informações de latitude');
        const resultadoLatitude = ehIgualLatitude(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoLatitude !== -1) {
            alteracaoInformacao += `latitude: ${resultadoLatitude}, `;
        }
        escreveLOG(nomeArquivo, 'Comparando informações de longitude');
        const resultadoLongitude = ehIgualLongitude(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoLongitude !== -1) {
            alteracaoInformacao += `longitude: ${resultadoLongitude}, `;
        }
        escreveLOG(nomeArquivo, 'Comparando informações de data de identificação');
        const resultadoDataIdentificacao = ehIgualDataIdentificacao(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
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
        escreveLOG(nomeArquivo, 'Comparando informações de tipo');
        await ehIgualTipo(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(tipo => {
            if (tipo !== -1) {
                alteracaoInformacao += `tipo: ${tipo}, `;
            }
        });
        escreveLOG(nomeArquivo, 'Comparando informações de nome científico');
        const resultadoNomeCientifico = ehIgualNomeCientifico(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoNomeCientifico.length > 0) {
            alteracaoInformacao += `nome_cientifico: ${resultadoNomeCientifico}, `;
        }

        escreveLOG(nomeArquivo, 'Comparando informações de família');
        await ehIgualFamilia(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(familia => {
            if (familia !== -1) {
                alteracaoInformacao += `familia: ${familia}, `;
            }
        });
        escreveLOG(nomeArquivo, 'Comparando informações de gênero');
        await ehIgualGenero(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(genero => {
            if (genero !== -1) {
                alteracaoInformacao += `genero: ${genero}, `;
            }
        });
        escreveLOG(nomeArquivo, 'Comparando informações de espécie');
        await ehIgualEspecie(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(especie => {
            if (especie !== -1) {
                alteracaoInformacao += `especie: ${especie}, `;
            }
        });
        escreveLOG(nomeArquivo, 'Comparando informações de variedade');
        await ehIgualVariedade(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(variedade => {
            if (variedade !== -1) {
                alteracaoInformacao += `especie: ${variedade}, `;
            }
        });
        escreveLOG(nomeArquivo, 'Comparando informações de nome científico');
        const idAutor = await getIDAutor(nomeArquivo, conexao, informacaoTomboBD);
        // const idAutor = await getIDAutor(nomeArquivo, conexao, informacaoTomboBD) + 10;
        if (idAutor !== -1) {
            escreveLOG(nomeArquivo, 'Comparando informações de autor de nome científico');
            await ehIgualAutorNomeCientifico(nomeArquivo, conexao, idAutor, informacaoTomboReflora).then(nomeAutorCientifico => {
                if (nomeAutorCientifico !== -1) {
                    alteracaoInformacao += `nome_cientifico_autor: ${nomeAutorCientifico}, `;
                }
            });
        }
        alteracaoInformacao = alteracaoInformacao.substring(0, alteracaoInformacao.lastIndexOf(','));
        alteracaoInformacao += '}';
        // eslint-disable-next-line no-console
        console.log(`-> ${alteracaoInformacao}`);
    } else {
        escreveLOG(nomeArquivo, `Não será feito comparações, pois não foi encontrado informações do tombo ${codBarra}`);
    }
}

export function comparaTombo(nomeArquivo, conexao, codBarra, respostaReflora) {
    selectNroTomboNumBarra(conexao, codBarra, nroTombo => {
        escreveLOG(nomeArquivo, `O tombo do código de barra {${codBarra}} é {${nroTombo[0].dataValues.tombo_hcf}}`);
        selectTombo(conexao, nroTombo[0].dataValues.tombo_hcf, tombo => {
            comparaInformacoesTombos(nomeArquivo, conexao, codBarra, tombo, respostaReflora);
        });
    });
}

export function processaMaiorCodBarra(nomeArquivo, maiorCodBarra) {
    const novoMaxCodBarra = maiorCodBarra.replace('HCF', '');
    escreveLOG(nomeArquivo, `Processando o maior código de barra que é {${maiorCodBarra}}`);
    return parseInt(novoMaxCodBarra);
}
