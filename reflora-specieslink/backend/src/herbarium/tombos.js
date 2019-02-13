import database from './database';
import { writeFileLOG } from './log';

function valueIsNull(value) {
    /* Afim de evitar problemas na conversão do parseInt */
    if (value === null) {
        return true;
    }
    return false;
}

function isNumber(value) {
    if (Number.isNaN(value)) {
        return false;
    }
    return true;
}

function equalNroColeta(fileName, nroColetaBD, nroColetaReflora) {
    if (!valueIsNull(nroColetaBD.numero_coleta) && !valueIsNull(nroColetaReflora.recordnumber)) {
        const intNroColetaBD = parseInt(nroColetaBD.numero_coleta);
        const intNroColetaReflora = parseInt(nroColetaReflora.recordnumber);
        if (isNumber(intNroColetaBD) && isNumber(intNroColetaReflora)) {
            if (intNroColetaBD === intNroColetaReflora) {
                writeFileLOG(fileName, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} números de coletas são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} números de coletas são diferentes`);
            return intNroColetaReflora;
        }
        writeFileLOG(fileName, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} números de coletas não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${nroColetaBD.numero_coleta}, Reflora: ${nroColetaReflora.recordnumber}} números de coletas são nulos`);
    return -1;
}

function equalDiaColeta(fileName, dataColetaBD, dataColetaReflora) {
    if (!valueIsNull(dataColetaBD.data_coleta_dia) && !valueIsNull(dataColetaReflora.day)) {
        const intDiaColetaBD = parseInt(dataColetaBD.data_coleta_dia);
        const intDiaColetaReflora = parseInt(dataColetaReflora.day);
        if (isNumber(intDiaColetaBD) && isNumber(intDiaColetaReflora)) {
            if (intDiaColetaBD === intDiaColetaReflora) {
                writeFileLOG(fileName, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} dias de coletas são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} dias de coletas são diferentes`);
            return intDiaColetaReflora;
        }
        writeFileLOG(fileName, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} dias de coletas não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${dataColetaBD.data_coleta_dia}, Reflora: ${dataColetaReflora.day}} dias de coletas são nulos`);
    return -1;
}

function equalMesColeta(fileName, dataColetaBD, dataColetaReflora) {
    if (!valueIsNull(dataColetaBD.data_coleta_mes) && !valueIsNull(dataColetaReflora.month)) {
        const intMesColetaBD = parseInt(dataColetaBD.data_coleta_mes);
        const intMesColetaReflora = parseInt(dataColetaReflora.month);
        if (isNumber(intMesColetaBD) && isNumber(intMesColetaReflora)) {
            if (intMesColetaBD === intMesColetaReflora) {
                writeFileLOG(fileName, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} mês da coletas são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} mês da coletas são diferentes`);
            return intMesColetaReflora;
        }
        writeFileLOG(fileName, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} mês da coletas não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${dataColetaBD.data_coleta_mes}, Reflora: ${dataColetaReflora.month}} mês da coletas são nulos`);
    return -1;
}

function equalAnoColeta(fileName, dataColetaBD, dataColetaReflora) {
    if (!valueIsNull(dataColetaBD.data_coleta_ano) && !valueIsNull(dataColetaReflora.year)) {
        const intAnoColetaBD = parseInt(dataColetaBD.data_coleta_ano);
        const intAnoColetaReflora = parseInt(dataColetaReflora.year);
        if (isNumber(intAnoColetaBD) && isNumber(intAnoColetaReflora)) {
            if (intAnoColetaBD === intAnoColetaReflora) {
                writeFileLOG(fileName, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} anos de coleta são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} anos de coleta são diferentes`);
            return intAnoColetaReflora;
        }
        writeFileLOG(fileName, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} anos de coleta não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${dataColetaBD.data_coleta_ano}, Reflora: ${dataColetaReflora.year}} anos de coleta são nulos`);
    return -1;
}

function equalAltitude(fileName, altitudeBD, altitudeReflora) {
    /*
        No BD não tem altitude mínima e nem máxima, então é igual para os mesmos valores
        Além disso, algumas altitude vem com m de metros então para comparar é necessário tirar.
        Isso, porque no reflora não contém esse m
    */
    if (!valueIsNull(altitudeBD.altitude) && !valueIsNull(altitudeReflora.minimumelevationinmeters) && !valueIsNull(altitudeReflora.maximumelevationinmeters)) {
        const intAltitudeBD = parseInt(altitudeBD.altitude.toString().replace('m', ''));
        const intMinAltitudeReflora = parseInt(altitudeReflora.minimumelevationinmeters);
        const intMaxAltitudeReflora = parseInt(altitudeReflora.maximumelevationinmeters);
        if (isNumber(intAltitudeBD) && isNumber(intMinAltitudeReflora) && isNumber(intMaxAltitudeReflora)) {
            if (intAltitudeBD === intMinAltitudeReflora && intAltitudeBD === intMaxAltitudeReflora) {
                writeFileLOG(fileName, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} altitudes são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} altitudes são diferentes`);
            return intMaxAltitudeReflora;
        }
        writeFileLOG(fileName, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} altitudes não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${altitudeBD.altitude}, Reflora: ${altitudeReflora.minimumelevationinmeters}, ${altitudeReflora.maximumelevationinmeters}} altitudes são nulos`);
    return -1;
}

function equalLatitude(fileName, latitudeBD, latitudeReflora) {
    if (!valueIsNull(latitudeBD.latitude) && !valueIsNull(latitudeReflora.decimallatitude)) {
        const intLatitudeBD = parseFloat(latitudeBD.latitude);
        const intLatitudeReflora = parseFloat(latitudeReflora.decimallatitude) + 1;
        if (isNumber(intLatitudeBD) && isNumber(intLatitudeReflora)) {
            if (intLatitudeBD === intLatitudeReflora) {
                writeFileLOG(fileName, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} latitudes são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} latitudes são diferentes`);
            return intLatitudeReflora;
        }
        writeFileLOG(fileName, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} latitudes não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${latitudeBD.latitude}, Reflora: ${latitudeReflora.decimallatitude}} latitudes são nulos`);
    return -1;
}

function equalLongitude(fileName, longitudeBD, longitudeReflora) {
    if (!valueIsNull(longitudeBD.longitude) && !valueIsNull(longitudeReflora.decimallongitude)) {
        const intLongitudeBD = parseFloat(longitudeBD.longitude);
        const intLongitudeReflora = parseFloat(longitudeReflora.decimallongitude);
        if (isNumber(intLongitudeBD) && isNumber(intLongitudeReflora)) {
            if (intLongitudeBD === intLongitudeReflora) {
                writeFileLOG(fileName, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} longitudes são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} longitudes são diferentes`);
            return intLongitudeReflora;
        }
        writeFileLOG(fileName, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} longitudes não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${longitudeBD.longitude}, Reflora: ${longitudeReflora.decimallongitude}} longitudes são nulos`);
    return -1;
}

function equalDataIdentificacao(fileName, dataIdentificacaoBD, dataIdentificacaoReflora) {
    let dataIdentificacao = '';
    if (!valueIsNull(dataIdentificacaoBD.data_identificacao_dia)) {
        dataIdentificacao += `${dataIdentificacaoBD.data_identificacao_dia}/`;
    }
    if (!valueIsNull(dataIdentificacaoBD.data_identificacao_mes)) {
        dataIdentificacao += `${dataIdentificacaoBD.data_identificacao_mes}/`;
    }
    if (!valueIsNull(dataIdentificacaoBD.data_identificacao_ano)) {
        dataIdentificacao += `${dataIdentificacaoBD.data_identificacao_ano}`;
    }
    if (dataIdentificacao === dataIdentificacaoReflora.dateidentified) {
        writeFileLOG(fileName, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora.dateidentified}} datas de identificação são iguais`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora.dateidentified}} datas de identificação são diferentes`);
    return dataIdentificacaoReflora.dateidentified;
}

function equalNomeCientifico(fileName, nomeCientificoBD, nomeCientificoReflora) {
    if (nomeCientificoBD.nome_cientifico === nomeCientificoReflora.scientificname) {
        writeFileLOG(fileName, `{BD: ${nomeCientificoBD.nome_cientifico}, Reflora: ${nomeCientificoReflora.scientificname}} nomes científicos são iguais`);
        return '';
    }
    writeFileLOG(fileName, `{BD: ${nomeCientificoBD.nome_cientifico}, Reflora: ${nomeCientificoReflora.scientificname}} nomes científicos são diferentes`);
    return nomeCientificoReflora.scientificname;
}

function compareInfoTombos(fileName, codBarra, tomboBD, tomboReflora) {
    writeFileLOG(fileName, `Comparando informações do tombo de código de barra {${codBarra}}`);
    const infoTomboBD = tomboBD[0].dataValues;
    const infoTomboReflora = tomboReflora.result[0];
    writeFileLOG(fileName, 'Comparando informações de número de coleta');
    equalNroColeta(fileName, infoTomboBD, infoTomboReflora);
    writeFileLOG(fileName, 'Comparando informações de dia de coleta');
    equalDiaColeta(fileName, infoTomboBD, infoTomboReflora);
    writeFileLOG(fileName, 'Comparando informações de mês de coleta');
    equalMesColeta(fileName, infoTomboBD, infoTomboReflora);
    writeFileLOG(fileName, 'Comparando informações de ano de coleta');
    equalAnoColeta(fileName, infoTomboBD, infoTomboReflora);
    writeFileLOG(fileName, 'Comparando informações de altitude');
    equalAltitude(fileName, infoTomboBD, infoTomboReflora);
    writeFileLOG(fileName, 'Comparando informações de latitude');
    equalLatitude(fileName, infoTomboBD, infoTomboReflora);
    writeFileLOG(fileName, 'Comparando informações de longitude');
    equalLongitude(fileName, infoTomboBD, infoTomboReflora);
    writeFileLOG(fileName, 'Comparando informações de data de identificação');
    equalDataIdentificacao(fileName, infoTomboBD, infoTomboReflora);
    writeFileLOG(fileName, 'Comparando informações de nome científico');
    equalNomeCientifico(fileName, infoTomboBD, infoTomboReflora);
}

function compareTombo(fileName, connection, codBarra, responseReflora) {
    database.selectNroTomboNumBarra(connection, codBarra, nroTombo => {
        writeFileLOG(fileName, `O tombo do código de barra {${codBarra}} é {${nroTombo[0].dataValues.tombo_hcf}}`);
        database.selectTombo(connection, nroTombo[0].dataValues.tombo_hcf, tombo => {
            compareInfoTombos(fileName, codBarra, tombo, responseReflora);
        });
    });
}

function proccessMaxCodBarra(fileName, maxCodBarra) {
    const newMaxCodBarra = maxCodBarra.replace('HCF', '');
    writeFileLOG(fileName, `Processando o maior código de barra que é {${maxCodBarra}}`);
    return parseInt(newMaxCodBarra);
}

export default {
    proccessMaxCodBarra, compareTombo,
};
