/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Q from 'q';
import database from './database';
import { escreveLOG } from './log';

function valorEhNulo(valor) {
    /* Afim de evitar problemas na conversão do parseInt */
    if (valor === null) {
        return true;
    }
    return false;
}

function ehNumero(valor) {
    if (Number.isNaN(valor)) {
        return false;
    }
    return true;
}

function ehIgualNroColeta(nomeArquivo, nroColetaBD, informacaoReflora) {
    if (!valorEhNulo(nroColetaBD.numero_coleta) && !valorEhNulo(informacaoReflora.recordnumber)) {
        const intNroColetaBD = parseInt(nroColetaBD.numero_coleta);
        const intNroColetaReflora = parseInt(informacaoReflora.recordnumber);
        if (ehNumero(intNroColetaBD) && ehNumero(intNroColetaReflora)) {
            if (intNroColetaBD === intNroColetaReflora) {
                escreveLOG(nomeArquivo, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} números de coletas são iguais`);
                return -1;
            }
            escreveLOG(nomeArquivo, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} números de coletas são diferentes`);
            return intNroColetaReflora;
        }
        escreveLOG(nomeArquivo, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} números de coletas não são números`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${nroColetaBD.numero_coleta}, Reflora: ${informacaoReflora.recordnumber}} números de coletas são nulos`);
    return -1;
}

function ehIgualDiaColeta(nomeArquivo, dataColetaBD, informacaoReflora) {
    if (!valorEhNulo(dataColetaBD.data_coleta_dia) && !valorEhNulo(informacaoReflora.day)) {
        const intDiaColetaBD = parseInt(dataColetaBD.data_coleta_dia);
        const intDiaColetaReflora = parseInt(informacaoReflora.day);
        if (ehNumero(intDiaColetaBD) && ehNumero(intDiaColetaReflora)) {
            if (intDiaColetaBD === intDiaColetaReflora) {
                escreveLOG(nomeArquivo, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} dias de coletas são iguais`);
                return -1;
            }
            escreveLOG(nomeArquivo, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} dias de coletas são diferentes`);
            return intDiaColetaReflora;
        }
        escreveLOG(nomeArquivo, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} dias de coletas não são números`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${dataColetaBD.data_coleta_dia}, Reflora: ${informacaoReflora.day}} dias de coletas são nulos`);
    return -1;
}

function ehIgualMesColeta(nomeArquivo, dataColetaBD, informacaoReflora) {
    if (!valorEhNulo(dataColetaBD.data_coleta_mes) && !valorEhNulo(informacaoReflora.month)) {
        const intMesColetaBD = parseInt(dataColetaBD.data_coleta_mes);
        const intMesColetaReflora = parseInt(informacaoReflora.month);
        if (ehNumero(intMesColetaBD) && ehNumero(intMesColetaReflora)) {
            if (intMesColetaBD === intMesColetaReflora) {
                escreveLOG(nomeArquivo, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} mês da coletas são iguais`);
                return -1;
            }
            escreveLOG(nomeArquivo, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} mês da coletas são diferentes`);
            return intMesColetaReflora;
        }
        escreveLOG(nomeArquivo, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} mês da coletas não são números`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${dataColetaBD.data_coleta_mes}, Reflora: ${informacaoReflora.month}} mês da coletas são nulos`);
    return -1;
}

function ehIgualAnoColeta(nomeArquivo, dataColetaBD, informacaoReflora) {
    if (!valorEhNulo(dataColetaBD.data_coleta_ano) && !valorEhNulo(informacaoReflora.year)) {
        const intAnoColetaBD = parseInt(dataColetaBD.data_coleta_ano);
        const intAnoColetaReflora = parseInt(informacaoReflora.year);
        if (ehNumero(intAnoColetaBD) && ehNumero(intAnoColetaReflora)) {
            if (intAnoColetaBD === intAnoColetaReflora) {
                escreveLOG(nomeArquivo, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} anos de coleta são iguais`);
                return -1;
            }
            escreveLOG(nomeArquivo, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} anos de coleta são diferentes`);
            return intAnoColetaReflora;
        }
        escreveLOG(nomeArquivo, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} anos de coleta não são números`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${dataColetaBD.data_coleta_ano}, Reflora: ${informacaoReflora.year}} anos de coleta são nulos`);
    return -1;
}

function ehIgualAltitude(nomeArquivo, altitudeBD, informacaoReflora) {
    /*
        No BD não tem altitude mínima e nem máxima, então é igual para os mesmos valores
        Além disso, algumas altitude vem com m de metros então para comparar é necessário tirar.
        Isso, porque no reflora não contém esse m
    */
    if (!valorEhNulo(altitudeBD.altitude) && !valorEhNulo(informacaoReflora.minimumelevationinmeters) && !valorEhNulo(informacaoReflora.maximumelevationinmeters)) {
        const intAltitudeBD = parseInt(altitudeBD.altitude.toString().replace('m', ''));
        const intMinAltitudeReflora = parseInt(informacaoReflora.minimumelevationinmeters);
        const intMaxAltitudeReflora = parseInt(informacaoReflora.maximumelevationinmeters);
        if (ehNumero(intAltitudeBD) && ehNumero(intMinAltitudeReflora) && ehNumero(intMaxAltitudeReflora)) {
            if (intAltitudeBD === intMinAltitudeReflora && intAltitudeBD === intMaxAltitudeReflora) {
                escreveLOG(nomeArquivo, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} altitudes são iguais`);
                return -1;
            }
            escreveLOG(nomeArquivo, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} altitudes são diferentes`);
            return intMaxAltitudeReflora;
        }
        escreveLOG(nomeArquivo, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} altitudes não são números`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${altitudeBD.altitude}, Reflora: ${informacaoReflora.minimumelevationinmeters}, ${informacaoReflora.maximumelevationinmeters}} altitudes são nulos`);
    return -1;
}

function ehIgualLatitude(nomeArquivo, latitudeBD, informacaoReflora) {
    if (!valorEhNulo(latitudeBD.latitude) && !valorEhNulo(informacaoReflora.decimallatitude)) {
        const intLatitudeBD = parseFloat(latitudeBD.latitude);
        const intLatitudeReflora = parseFloat(informacaoReflora.decimallatitude) + 1;
        if (ehNumero(intLatitudeBD) && ehNumero(intLatitudeReflora)) {
            if (intLatitudeBD === intLatitudeReflora) {
                escreveLOG(nomeArquivo, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} latitudes são iguais`);
                return -1;
            }
            escreveLOG(nomeArquivo, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} latitudes são diferentes`);
            return intLatitudeReflora;
        }
        escreveLOG(nomeArquivo, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} latitudes não são números`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${latitudeBD.latitude}, Reflora: ${informacaoReflora.decimallatitude}} latitudes são nulos`);
    return -1;
}

function ehIgualLongitude(nomeArquivo, longitudeBD, informacaoReflora) {
    if (!valorEhNulo(longitudeBD.longitude) && !valorEhNulo(informacaoReflora.decimallongitude)) {
        const intLongitudeBD = parseFloat(longitudeBD.longitude);
        const intLongitudeReflora = parseFloat(informacaoReflora.decimallongitude);
        if (ehNumero(intLongitudeBD) && ehNumero(intLongitudeReflora)) {
            if (intLongitudeBD === intLongitudeReflora) {
                escreveLOG(nomeArquivo, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} longitudes são iguais`);
                return -1;
            }
            escreveLOG(nomeArquivo, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} longitudes são diferentes`);
            return intLongitudeReflora;
        }
        escreveLOG(nomeArquivo, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} longitudes não são números`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${longitudeBD.longitude}, Reflora: ${informacaoReflora.decimallongitude}} longitudes são nulos`);
    return -1;
}

function ehIgualDataIdentificacao(nomeArquivo, dataIdentificacaoBD, informacaoReflora) {
    let dataIdentificacao = '';
    if (!valorEhNulo(dataIdentificacaoBD.data_identificacao_dia)) {
        dataIdentificacao += `${dataIdentificacaoBD.data_identificacao_dia}/`;
    }
    if (!valorEhNulo(dataIdentificacaoBD.data_identificacao_mes)) {
        dataIdentificacao += `${dataIdentificacaoBD.data_identificacao_mes}/`;
    }
    if (!valorEhNulo(dataIdentificacaoBD.data_identificacao_ano)) {
        dataIdentificacao += `${dataIdentificacaoBD.data_identificacao_ano}`;
    }
    if (dataIdentificacao === informacaoReflora.dateidentified) {
        escreveLOG(nomeArquivo, `{BD: ${dataIdentificacao}, Reflora: ${informacaoReflora.dateidentified}} datas de identificação são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${dataIdentificacao}, Reflora: ${informacaoReflora.dateidentified}} datas de identificação são diferentes`);
    return informacaoReflora.dateidentified;
}

function ehIgualNomeCientifico(nomeArquivo, nomeCientificoBD, informacaoReflora) {
    if (nomeCientificoBD.nome_cientifico === informacaoReflora.scientificname) {
        escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD.nome_cientifico}, Reflora: ${informacaoReflora.scientificname}} nomes científicos são iguais`);
        return '';
    }
    escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD.nome_cientifico}, Reflora: ${informacaoReflora.scientificname}} nomes científicos são diferentes`);
    return informacaoReflora.scientificname;
}

function ehIgualFamilia(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idNomeFamilia = informacaoBD.familia_id;
    database.selectFamilia(conexao, idNomeFamilia, resultadoFamiliaTombo => {
        if (resultadoFamiliaTombo.length > 0) {
            const nomeFamiliaBD = resultadoFamiliaTombo[0].dataValues.nome;
            const nomeFamiliaReflora = informacaoReflora.family;
            if ((nomeFamiliaBD === nomeFamiliaReflora) && !valorEhNulo(nomeFamiliaBD) && !valorEhNulo(informacaoReflora.family)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeFamiliaBD}, Reflora: ${nomeFamiliaReflora}} as famílias são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomeFamiliaBD}, Reflora: ${nomeFamiliaReflora}} as famílias são diferentes`);
            promessa.resolve(nomeFamiliaReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de família');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}


function ehIgualEspecie(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idNomeEspecie = informacaoBD.especie_id;
    database.selectEspecie(conexao, idNomeEspecie, resultadoEspecieTombo => {
        if (resultadoEspecieTombo.length > 0) {
            const nomeEspecieBD = resultadoEspecieTombo[0].dataValues.nome;
            const nomeEspecieReflora = informacaoReflora.infraespecificepithet;
            if ((nomeEspecieBD === nomeEspecieReflora) && !valorEhNulo(nomeEspecieBD) && !valorEhNulo(nomeEspecieReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEspecieBD}, Reflora: ${nomeEspecieReflora}} as espécies são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomeEspecieBD}, Reflora: ${nomeEspecieReflora}} as espécies são diferentes`);
            promessa.resolve(nomeEspecieReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de espécie');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

function ehIgualGenero(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idNomeGenero = informacaoBD.genero_id;
    database.selectGenero(conexao, idNomeGenero, resultadoGeneroTombo => {
        if (resultadoGeneroTombo.length > 0) {
            const nomeGeneroBD = resultadoGeneroTombo[0].dataValues.nome;
            const nomeGeneroReflora = informacaoReflora.genus;
            if ((nomeGeneroBD === nomeGeneroReflora) && !valorEhNulo(nomeGeneroBD) && !valorEhNulo(nomeGeneroReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeGeneroBD}, Reflora: ${nomeGeneroReflora}} os gêneros são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomeGeneroBD}, Reflora: ${nomeGeneroReflora}} os gêneros são diferentes`);
            promessa.resolve(nomeGeneroReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de gênero');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

function ehIgualTipo(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idTipo = informacaoBD.tipo_id;
    database.selectTipo(conexao, idTipo, resultadoTipoTombo => {
        if (resultadoTipoTombo.length > 0) {
            const nomeTipoBD = resultadoTipoTombo[0].dataValues.nome;
            const nomeTipoReflora = informacaoReflora.typestatus;
            if ((nomeTipoBD === nomeTipoReflora) && !valorEhNulo(nomeTipoBD) && !valorEhNulo(nomeTipoReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeTipoBD}, Reflora: ${nomeTipoReflora}} os tipos são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomeTipoBD}, Reflora: ${nomeTipoReflora}} os tipos são diferentes`);
            promessa.resolve(nomeTipoReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de gênero');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

function ehIgualVariedade(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idVariedade = informacaoBD.variedade_id;
    database.selectVariedade(conexao, idVariedade, resultadoVariedadeTombo => {
        if (resultadoVariedadeTombo.length > 0) {
            const nomeVariedadeBD = resultadoVariedadeTombo[0].dataValues.nome;
            const nomeVariedadeReflora = informacaoReflora.infraespecificepithet;
            if ((nomeVariedadeBD === nomeVariedadeReflora) && !valorEhNulo(nomeVariedadeBD) && !valorEhNulo(nomeVariedadeReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeVariedadeBD}, Reflora: ${nomeVariedadeReflora}} as variedades são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomeVariedadeBD}, Reflora: ${nomeVariedadeReflora}} as variedades são diferentes`);
            promessa.resolve(nomeVariedadeReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de variedade');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

async function comparaInformacoesTombos(nomeArquivo, conexao, codBarra, tomboBD, tomboReflora) {
    escreveLOG(nomeArquivo, `Comparando informações do tombo de código de barra {${codBarra}}`);
    const informacaoTomboBD = tomboBD[0].dataValues;
    const informacaoTomboReflora = tomboReflora.result[0];
    let alteracaoInformacao = '{';
    escreveLOG(nomeArquivo, 'Comparando informações de número de coleta');
    const resultadoNroColeta = ehIgualNroColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    if (resultadoNroColeta !== -1) {
        alteracaoInformacao += `numero_coleta: ${resultadoNroColeta},`;
    }
    escreveLOG(nomeArquivo, 'Comparando informações de dia de coleta');
    const resultadoDiaColeta = ehIgualDiaColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    if (resultadoDiaColeta !== -1) {
        alteracaoInformacao += `dia_coleta: ${resultadoDiaColeta},`;
    }
    escreveLOG(nomeArquivo, 'Comparando informações de mês de coleta');
    const resultadoMesColeta = ehIgualMesColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    if (resultadoMesColeta !== -1) {
        alteracaoInformacao += `mes_coleta: ${resultadoMesColeta},`;
    }
    escreveLOG(nomeArquivo, 'Comparando informações de ano de coleta');
    const resultadoAnoColeta = ehIgualAnoColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    if (resultadoAnoColeta !== -1) {
        alteracaoInformacao += `ano_coleta: ${resultadoAnoColeta}, `;
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
        alteracaoInformacao += `data_identificacao_dia: ${resultadoDataIdentificacao}, `;
    }
    escreveLOG(nomeArquivo, 'Comparando informações de nome científico');
    const resultadoNomeCientifico = ehIgualNomeCientifico(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    if (resultadoNomeCientifico !== -1) {
        alteracaoInformacao += `nome_cientifico: ${resultadoNomeCientifico}, `;
    }
    escreveLOG(nomeArquivo, 'Comparando informações de família');
    await ehIgualFamilia(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(familia => {
        if (familia !== -1) {
            alteracaoInformacao += `familia: ${familia}, `;
        }
    });
    escreveLOG(nomeArquivo, 'Comparando informações de espécie');
    await ehIgualEspecie(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(especie => {
        if (especie !== -1) {
            alteracaoInformacao += `especie: ${especie}, `;
        }
    });
    escreveLOG(nomeArquivo, 'Comparando informações de gênero');
    await ehIgualGenero(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(genero => {
        if (genero !== -1) {
            alteracaoInformacao += `genero: ${genero}, `;
        }
    });
    escreveLOG(nomeArquivo, 'Comparando informações de tipo');
    await ehIgualTipo(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(tipo => {
        if (tipo !== -1) {
            alteracaoInformacao += `tipoe: ${tipo}, `;
        }
    });
    escreveLOG(nomeArquivo, 'Comparando informações de variedade');
    await ehIgualVariedade(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(variedade => {
        if (variedade !== -1) {
            alteracaoInformacao += `especie: ${variedade}, `;
        }
    });
    alteracaoInformacao = alteracaoInformacao.substring(0, alteracaoInformacao.lastIndexOf(','));
    alteracaoInformacao += '}';
    // eslint-disable-next-line no-console
    console.log(`-> ${alteracaoInformacao}`);
}

function comparaTombo(nomeArquivo, conexao, codBarra, respostaReflora) {
    database.selectNroTomboNumBarra(conexao, codBarra, nroTombo => {
        escreveLOG(nomeArquivo, `O tombo do código de barra {${codBarra}} é {${nroTombo[0].dataValues.tombo_hcf}}`);
        database.selectTombo(conexao, nroTombo[0].dataValues.tombo_hcf, tombo => {
            comparaInformacoesTombos(nomeArquivo, conexao, codBarra, tombo, respostaReflora);
        });
    });
}

function processaMaiorCodBarra(nomeArquivo, maiorCodBarra) {
    const novoMaxCodBarra = maiorCodBarra.replace('HCF', '');
    escreveLOG(nomeArquivo, `Processando o maior código de barra que é {${maiorCodBarra}}`);
    return parseInt(novoMaxCodBarra);
}

export default {
    processaMaiorCodBarra, comparaTombo,
};
