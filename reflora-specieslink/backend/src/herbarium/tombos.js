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

function ehIgualFamilia(nomeArquivo, conexao, familiaBD, informacaoReflora) {
    const promessa = Q.defer();
    database.selectFamilia(conexao, familiaBD.familia_id, familiaTombo => {
        const nomeFamilia = familiaTombo[0].dataValues.nome;
        if ((nomeFamilia === informacaoReflora.family) && (!valorEhNulo(nomeFamilia)) && (!valorEhNulo(informacaoReflora.family))) {
            escreveLOG(nomeArquivo, `{BD: ${nomeFamilia}, Reflora: ${informacaoReflora.family}} as famílias são iguais`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, `{BD: ${nomeFamilia}, Reflora: ${informacaoReflora.family}} as famílias são diferentes`);
        promessa.resolve(nomeFamilia);
        return promessa.promise;
    });
    return promessa.promise;
}

/*
function ehIgualEspecie(nomeArquivo, conexao, especieBD, informacaoReflora) {
    const promessa = Q.defer();
    database.selectEspecie(conexao, especieBD.especie_id, especieTombo => {
        const nomeEspecie = especieTombo[0].dataValues.nome;
        if ((nomeEspecie === informacaoReflora.infraespecificepithet) && (!valorEhNulo(nomeEspecie)) && (!valorEhNulo(informacaoReflora.infraespecificepithet))) {
            escreveLOG(nomeArquivo, `{BD: ${nomeEspecie}, Reflora: ${informacaoReflora.infraespecificepithet}} as espécies são iguais`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, `{BD: ${nomeEspecie}, Reflora: ${informacaoReflora.infraespecificepithet}} as espécies são diferentes`);
        promessa.resolve(nomeEspecie);
        return promessa.promise;
    });
    return promessa.promise;
}

function ehIgualGenero(nomeArquivo, conexao, generoBD, informacaoReflora) {
    const promessa = Q.defer();
    database.selectGenero(conexao, generoBD.genero_id, generoTombo => {
        const nomeGenero = generoTombo[0].dataValues.nome;
        if ((nomeGenero === informacaoReflora.genus) && (!valorEhNulo(nomeGenero)) && (!valorEhNulo(informacaoReflora.genus))) {
            escreveLOG(nomeArquivo, `{BD: ${nomeGenero}, Reflora: ${informacaoReflora.genus}} os gêneros são iguais`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, `{BD: ${nomeGenero}, Reflora: ${informacaoReflora.genus}} os gêneros são diferentes`);
        promessa.resolve(nomeGenero);
        return promessa.promise;
    });
    return promessa.promise;
}

function ehIgualTipo(nomeArquivo, conexao, tipoID, informacaoReflora) {
    const promessa = Q.defer();
    database.selectTipo(conexao, tipoID.tipo_id, tipoTombo => {
        const nomeTipo = tipoTombo[0].dataValues.nome;
        if ((nomeTipo === informacaoReflora.typestatus) && (!valorEhNulo(nomeTipo)) && (!valorEhNulo(informacaoReflora.typestatus))) {
            escreveLOG(nomeArquivo, `{BD: ${nomeTipo}, Reflora: ${informacaoReflora.typestatus}} os gêneros são iguais`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, `{BD: ${nomeTipo}, Reflora: ${informacaoReflora.typestatus}} os gêneros são diferentes`);
        promessa.resolve(nomeTipo);
        return promessa.promise;
    });
    return promessa.promise;
}

function ehIgualVariedade(nomeArquivo, conexao, variedadeID, informacaoReflora) {
    const promessa = Q.defer();
    database.selectVariedade(conexao, variedadeID.variedade_id, variedadeTombo => {
        const nomeVariedade = variedadeTombo[0].dataValues.nome;
        if ((nomeVariedade === informacaoReflora.infraespecificepithet) && (!valorEhNulo(nomeVariedade)) && (!valorEhNulo(informacaoReflora.infraespecificepithet))) {
            escreveLOG(nomeArquivo, `{BD: ${nomeVariedade}, Reflora: ${informacaoReflora.infraespecificepithet}} os gêneros são iguais`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, `{BD: ${nomeVariedade}, Reflora: ${informacaoReflora.infraespecificepithet}} os gêneros são diferentes`);
        promessa.resolve(nomeVariedade);
        return promessa.promise;
    });
    return promessa.promise;
}
*/
function comparaInformacoesTombos(nomeArquivo, conexao, codBarra, tomboBD, tomboReflora) {
    escreveLOG(nomeArquivo, `Comparando informações do tombo de código de barra {${codBarra}}`);
    const informacaoTomboBD = tomboBD[0].dataValues;
    const informacaoTomboReflora = tomboReflora.result[0];
    escreveLOG(nomeArquivo, 'Comparando informações de número de coleta');
    ehIgualNroColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    escreveLOG(nomeArquivo, 'Comparando informações de dia de coleta');
    ehIgualDiaColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    escreveLOG(nomeArquivo, 'Comparando informações de mês de coleta');
    ehIgualMesColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    escreveLOG(nomeArquivo, 'Comparando informações de ano de coleta');
    ehIgualAnoColeta(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    escreveLOG(nomeArquivo, 'Comparando informações de altitude');
    ehIgualAltitude(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    escreveLOG(nomeArquivo, 'Comparando informações de latitude');
    ehIgualLatitude(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    escreveLOG(nomeArquivo, 'Comparando informações de longitude');
    ehIgualLongitude(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    escreveLOG(nomeArquivo, 'Comparando informações de data de identificação');
    ehIgualDataIdentificacao(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    escreveLOG(nomeArquivo, 'Comparando informações de nome científico');
    ehIgualNomeCientifico(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
    escreveLOG(nomeArquivo, 'Comparando informações de família');
    ehIgualFamilia(nomeArquivo, conexao, informacaoTomboBD, informacaoTomboReflora).then(familia => {
        // eslint-disable-next-line no-console
        console.log(familia);
    });
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
