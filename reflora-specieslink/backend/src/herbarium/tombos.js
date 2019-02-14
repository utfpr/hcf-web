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

function ehIgualNroColeta(nomeArquivo, nroColetaBD, nroColetaReflora) {
    if (!valorEhNulo(nroColetaBD.numero_coleta) && !valorEhNulo(nroColetaReflora.recordnumber)) {
        const intNroColetaBD = parseInt(nroColetaBD.numero_coleta);
        const intNroColetaReflora = parseInt(nroColetaReflora.recordnumber);
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
    escreveLOG(nomeArquivo, `{BD: ${nroColetaBD.numero_coleta}, Reflora: ${nroColetaReflora.recordnumber}} números de coletas são nulos`);
    return -1;
}

function ehIgualDiaColeta(nomeArquivo, dataColetaBD, dataColetaReflora) {
    if (!valorEhNulo(dataColetaBD.data_coleta_dia) && !valorEhNulo(dataColetaReflora.day)) {
        const intDiaColetaBD = parseInt(dataColetaBD.data_coleta_dia);
        const intDiaColetaReflora = parseInt(dataColetaReflora.day);
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
    escreveLOG(nomeArquivo, `{BD: ${dataColetaBD.data_coleta_dia}, Reflora: ${dataColetaReflora.day}} dias de coletas são nulos`);
    return -1;
}

function ehIgualMesColeta(nomeArquivo, dataColetaBD, dataColetaReflora) {
    if (!valorEhNulo(dataColetaBD.data_coleta_mes) && !valorEhNulo(dataColetaReflora.month)) {
        const intMesColetaBD = parseInt(dataColetaBD.data_coleta_mes);
        const intMesColetaReflora = parseInt(dataColetaReflora.month);
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
    escreveLOG(nomeArquivo, `{BD: ${dataColetaBD.data_coleta_mes}, Reflora: ${dataColetaReflora.month}} mês da coletas são nulos`);
    return -1;
}

function ehIgualAnoColeta(nomeArquivo, dataColetaBD, dataColetaReflora) {
    if (!valorEhNulo(dataColetaBD.data_coleta_ano) && !valorEhNulo(dataColetaReflora.year)) {
        const intAnoColetaBD = parseInt(dataColetaBD.data_coleta_ano);
        const intAnoColetaReflora = parseInt(dataColetaReflora.year);
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
    escreveLOG(nomeArquivo, `{BD: ${dataColetaBD.data_coleta_ano}, Reflora: ${dataColetaReflora.year}} anos de coleta são nulos`);
    return -1;
}

function ehIgualAltitude(nomeArquivo, altitudeBD, altitudeReflora) {
    /*
        No BD não tem altitude mínima e nem máxima, então é igual para os mesmos valores
        Além disso, algumas altitude vem com m de metros então para comparar é necessário tirar.
        Isso, porque no reflora não contém esse m
    */
    if (!valorEhNulo(altitudeBD.altitude) && !valorEhNulo(altitudeReflora.minimumelevationinmeters) && !valorEhNulo(altitudeReflora.maximumelevationinmeters)) {
        const intAltitudeBD = parseInt(altitudeBD.altitude.toString().replace('m', ''));
        const intMinAltitudeReflora = parseInt(altitudeReflora.minimumelevationinmeters);
        const intMaxAltitudeReflora = parseInt(altitudeReflora.maximumelevationinmeters);
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
    escreveLOG(nomeArquivo, `{BD: ${altitudeBD.altitude}, Reflora: ${altitudeReflora.minimumelevationinmeters}, ${altitudeReflora.maximumelevationinmeters}} altitudes são nulos`);
    return -1;
}

function ehIgualLatitude(nomeArquivo, latitudeBD, latitudeReflora) {
    if (!valorEhNulo(latitudeBD.latitude) && !valorEhNulo(latitudeReflora.decimallatitude)) {
        const intLatitudeBD = parseFloat(latitudeBD.latitude);
        const intLatitudeReflora = parseFloat(latitudeReflora.decimallatitude) + 1;
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
    escreveLOG(nomeArquivo, `{BD: ${latitudeBD.latitude}, Reflora: ${latitudeReflora.decimallatitude}} latitudes são nulos`);
    return -1;
}

function ehIgualLongitude(nomeArquivo, longitudeBD, longitudeReflora) {
    if (!valorEhNulo(longitudeBD.longitude) && !valorEhNulo(longitudeReflora.decimallongitude)) {
        const intLongitudeBD = parseFloat(longitudeBD.longitude);
        const intLongitudeReflora = parseFloat(longitudeReflora.decimallongitude);
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
    escreveLOG(nomeArquivo, `{BD: ${longitudeBD.longitude}, Reflora: ${longitudeReflora.decimallongitude}} longitudes são nulos`);
    return -1;
}

function ehIgualDataIdentificacao(nomeArquivo, dataIdentificacaoBD, dataIdentificacaoReflora) {
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
    if (dataIdentificacao === dataIdentificacaoReflora.dateidentified) {
        escreveLOG(nomeArquivo, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora.dateidentified}} datas de identificação são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora.dateidentified}} datas de identificação são diferentes`);
    return dataIdentificacaoReflora.dateidentified;
}

function ehIgualNomeCientifico(nomeArquivo, nomeCientificoBD, nomeCientificoReflora) {
    if (nomeCientificoBD.nome_cientifico === nomeCientificoReflora.scientificname) {
        escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD.nome_cientifico}, Reflora: ${nomeCientificoReflora.scientificname}} nomes científicos são iguais`);
        return '';
    }
    escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD.nome_cientifico}, Reflora: ${nomeCientificoReflora.scientificname}} nomes científicos são diferentes`);
    return nomeCientificoReflora.scientificname;
}

function ehIgualFamilia(nomeArquivo, connection, familyBD, familyReflora) {
    const promessa = Q.defer();
    database.selectFamilia(connection, familyBD.familia_id, familyTombo => {
        const familyTomboString = familyTombo[0].dataValues.nome;
        if ((familyTomboString === familyReflora.family) && (!valorEhNulo(familyTomboString)) && (!valorEhNulo(familyReflora.family))) {
            escreveLOG(nomeArquivo, `{BD: ${familyTomboString}, Reflora: ${familyReflora.family}} as famílias são iguais`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, `{BD: ${familyTomboString}, Reflora: ${familyReflora.family}} as famílias são diferentes`);
        promessa.resolve(familyTomboString);
        return promessa.promise;
    });
    return promessa.promise;
}

function compareInformacoesTombos(nomeArquivo, conexao, codBarra, tomboBD, tomboReflora) {
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
            compareInformacoesTombos(nomeArquivo, conexao, codBarra, tombo, respostaReflora);
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
