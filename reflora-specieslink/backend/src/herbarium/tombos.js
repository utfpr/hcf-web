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
    writeFileLOG(fileName, `{BD: ${nroColetaBD.numero_coleta}, Reflora: ${nroColetaReflora.recordnumber}} são nulos?`);
    if (!valueIsNull(nroColetaBD.numero_coleta) && !valueIsNull(nroColetaReflora.recordnumber)) {
        const intNroColetaBD = parseInt(nroColetaBD.numero_coleta);
        const intNroColetaReflora = parseInt(nroColetaReflora.recordnumber);
        writeFileLOG(fileName, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} não são nulos`);
        writeFileLOG(fileName, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} são números?`);
        if (isNumber(intNroColetaBD) && isNumber(intNroColetaReflora)) {
            writeFileLOG(fileName, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} são números`);
            if (intNroColetaBD === intNroColetaReflora) {
                writeFileLOG(fileName, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} são diferentes`);
            return intNroColetaReflora;
        }
        writeFileLOG(fileName, `{BD: ${intNroColetaBD}, Reflora: ${intNroColetaReflora}} não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${nroColetaBD.numero_coleta}, Reflora: ${nroColetaReflora.recordnumber}} são nulos`);
    return -1;
}

function equalDiaColeta(fileName, dataColetaBD, dataColetaReflora) {
    writeFileLOG(fileName, `{BD: ${dataColetaBD.data_coleta_dia}, Reflora: ${dataColetaReflora.day}} são nulos?`);
    if (!valueIsNull(dataColetaBD.data_coleta_dia) && !valueIsNull(dataColetaReflora.day)) {
        const intDiaColetaBD = parseInt(dataColetaBD.data_coleta_dia);
        const intDiaColetaReflora = parseInt(dataColetaReflora.day);
        writeFileLOG(fileName, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} não são nulos`);
        writeFileLOG(fileName, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} são números?`);
        if (isNumber(intDiaColetaBD) && isNumber(intDiaColetaReflora)) {
            writeFileLOG(fileName, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} são números`);
            if (intDiaColetaBD === intDiaColetaReflora) {
                writeFileLOG(fileName, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} são diferentes`);
            return intDiaColetaReflora;
        }
        writeFileLOG(fileName, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${dataColetaBD.data_coleta_dia}, Reflora: ${dataColetaReflora.day}} são nulos`);
    return -1;
}

function equalMesColeta(fileName, dataColetaBD, dataColetaReflora) {
    writeFileLOG(fileName, `{BD: ${dataColetaBD.data_coleta_mes}, Reflora: ${dataColetaReflora.month}} são nulos?`);
    if (!valueIsNull(dataColetaBD.data_coleta_mes) && !valueIsNull(dataColetaReflora.month)) {
        const intMesColetaBD = parseInt(dataColetaBD.data_coleta_mes);
        const intMesColetaReflora = parseInt(dataColetaReflora.month);
        writeFileLOG(fileName, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} não são nulos`);
        writeFileLOG(fileName, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} são números?`);
        if (isNumber(intMesColetaBD) && isNumber(intMesColetaReflora)) {
            writeFileLOG(fileName, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} são números`);
            if (intMesColetaBD === intMesColetaReflora) {
                writeFileLOG(fileName, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} são diferentes`);
            return intMesColetaReflora;
        }
        writeFileLOG(fileName, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${dataColetaBD.data_coleta_mes}, Reflora: ${dataColetaReflora.month}} são nulos`);
    return -1;
}

function equalAnoColeta(fileName, dataColetaBD, dataColetaReflora) {
    writeFileLOG(fileName, `{BD: ${dataColetaBD.data_coleta_ano}, Reflora: ${dataColetaReflora.year}} são nulos?`);
    if (!valueIsNull(dataColetaBD.data_coleta_ano) && !valueIsNull(dataColetaReflora.year)) {
        const intAnoColetaBD = parseInt(dataColetaBD.data_coleta_ano);
        const intAnoColetaReflora = parseInt(dataColetaReflora.year);
        writeFileLOG(fileName, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} não são nulos`);
        writeFileLOG(fileName, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} são números?`);
        if (isNumber(intAnoColetaBD) && isNumber(intAnoColetaReflora)) {
            writeFileLOG(fileName, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} são números`);
            if (intAnoColetaBD === intAnoColetaReflora) {
                writeFileLOG(fileName, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} são diferentes`);
            return intAnoColetaReflora;
        }
        writeFileLOG(fileName, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${dataColetaBD.data_coleta_ano}, Reflora: ${dataColetaReflora.year}} são nulos`);
    return -1;
}

function equalAltitude(fileName, altitudeBD, altitudeReflora) {
    /*
        No BD não tem altitude mínima e nem máxima, então é igual para os mesmos valores
        Além disso, algumas altitude vem com m de metros então para comparar é necessário tirar.
        Isso, porque no reflora não contém esse m
    */
    writeFileLOG(fileName, `{BD: ${altitudeBD.altitude}, Reflora: ${altitudeReflora.minimumelevationinmeters}, ${altitudeReflora.maximumelevationinmeters}} são nulos?`);
    if (!valueIsNull(altitudeBD.altitude) && !valueIsNull(altitudeReflora.minimumelevationinmeters) && !valueIsNull(altitudeReflora.maximumelevationinmeters)) {
        const intAltitudeBD = parseInt(altitudeBD.altitude.toString().replace('m', ''));
        const intMinAltitudeReflora = parseInt(altitudeReflora.minimumelevationinmeters);
        const intMaxAltitudeReflora = parseInt(altitudeReflora.maximumelevationinmeters);
        writeFileLOG(fileName, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} não são nulos`);
        writeFileLOG(fileName, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} são números?`);
        if (isNumber(intAltitudeBD) && isNumber(intMinAltitudeReflora) && isNumber(intMaxAltitudeReflora)) {
            writeFileLOG(fileName, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} são números`);
            if (intAltitudeBD === intMinAltitudeReflora && intAltitudeBD === intMaxAltitudeReflora) {
                writeFileLOG(fileName, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} são iguais`);
                return -1;
            }
            writeFileLOG(fileName, 'Os valores de altitude do BD e do Reflora são diferentes');
            return intMaxAltitudeReflora;
        }
        writeFileLOG(fileName, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${altitudeBD.altitude}, Reflora: ${altitudeReflora.minimumelevationinmeters}, ${altitudeReflora.maximumelevationinmeters}} são nulos`);
    return -1;
}

function equalLatitude(fileName, latitudeBD, latitudeReflora) {
    writeFileLOG(fileName, `{BD: ${latitudeBD.latitude}, Reflora: ${latitudeReflora.decimallatitude}} são nulos?`);
    if (!valueIsNull(latitudeBD.latitude) && !valueIsNull(latitudeReflora.decimallatitude)) {
        const intLatitudeBD = parseFloat(latitudeBD.latitude);
        const intLatitudeReflora = parseFloat(latitudeReflora.decimallatitude) + 1;
        writeFileLOG(fileName, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} não são nulos`);
        writeFileLOG(fileName, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} são números?`);
        if (isNumber(intLatitudeBD) && isNumber(intLatitudeReflora)) {
            writeFileLOG(fileName, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} são números`);
            if (intLatitudeBD === intLatitudeReflora) {
                writeFileLOG(fileName, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} são diferentes`);
            return intLatitudeReflora;
        }
        writeFileLOG(fileName, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${latitudeBD.latitude}, Reflora: ${latitudeReflora.decimallatitude}} são nulos`);
    return -1;
}

function equalLongitude(fileName, longitudeBD, longitudeReflora) {
    writeFileLOG(fileName, `{BD: ${longitudeBD.longitude}, Reflora: ${longitudeReflora.decimallongitude}} são nulos?`);
    if (!valueIsNull(longitudeBD.longitude) && !valueIsNull(longitudeReflora.decimallongitude)) {
        const intLongitudeBD = parseFloat(longitudeBD.longitude);
        const intLongitudeReflora = parseFloat(longitudeReflora.decimallongitude);
        writeFileLOG(fileName, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} não são nulos`);
        writeFileLOG(fileName, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} são números?`);
        if (isNumber(intLongitudeBD) && isNumber(intLongitudeReflora)) {
            if (intLongitudeBD === intLongitudeReflora) {
                writeFileLOG(fileName, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} são iguais`);
                return -1;
            }
            writeFileLOG(fileName, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} são diferentes`);
            return intLongitudeReflora;
        }
        writeFileLOG(fileName, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} não são números`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${longitudeBD.longitude}, Reflora: ${longitudeReflora.decimallongitude}} são nulos`);
    return -1;
}

function equalDataIdentificacao(fileName, dataIdentificacaoBD, dataIdentificacaoReflora) {
    let dataIdentificacao = '';
    writeFileLOG(fileName, 'Montando a string da data de identificação');
    if (!valueIsNull(dataIdentificacaoBD.data_identificacao_dia)) {
        dataIdentificacao += `${dataIdentificacaoBD.data_identificacao_dia}/`;
    }
    if (!valueIsNull(dataIdentificacaoBD.data_identificacao_mes)) {
        dataIdentificacao += `${dataIdentificacaoBD.data_identificacao_mes}/`;
    }
    if (!valueIsNull(dataIdentificacaoBD.data_identificacao_ano)) {
        dataIdentificacao += `${dataIdentificacaoBD.data_identificacao_ano}`;
    }
    writeFileLOG(fileName, `A data de identificação no BD é ${dataIdentificacao}`);
    writeFileLOG(fileName, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora.dateidentified}} comparando elas`);
    if (dataIdentificacao === dataIdentificacaoReflora.dateidentified) {
        writeFileLOG(fileName, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora.dateidentified}} são iguais`);
        return -1;
    }
    writeFileLOG(fileName, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora.dateidentified}} são diferentes`);
    return dataIdentificacaoReflora.dateidentified;
}

function equalNomeCientifico(fileName, nomeCientificoBD, nomeCientificoReflora) {
    writeFileLOG(fileName, `{BD: ${nomeCientificoBD.nome_cientifico}, Reflora: ${nomeCientificoReflora.scientificname}} comparando elas`);
    if (nomeCientificoBD.nome_cientifico === nomeCientificoReflora.scientificname) {
        writeFileLOG(fileName, `{BD: ${nomeCientificoBD.nome_cientifico}, Reflora: ${nomeCientificoReflora.scientificname}} são iguais`);
        return '';
    }
    writeFileLOG(fileName, `{BD: ${nomeCientificoBD.nome_cientifico}, Reflora: ${nomeCientificoReflora.scientificname}} são diferentes`);
    return nomeCientificoReflora.scientificname;
}

function compareInfoTombos(fileName, codBarra, tomboBD, tomboReflora) {
    writeFileLOG(fileName, `Comparando informações do tombo ${codBarra}`);
    const infoTomboBD = tomboBD[0].dataValues;
    const infoTomboReflora = tomboReflora.result[0];
    // eslint-disable-next-line no-console
    // console.log(infoTomboBD);
    // eslint-disable-next-line no-console
    // console.log(infoTomboReflora);
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
        writeFileLOG(fileName, `O tombo do código de barra ${codBarra} é ${nroTombo[0].dataValues.tombo_hcf}`);
        database.selectTombo(connection, nroTombo[0].dataValues.tombo_hcf, tombo => {
            compareInfoTombos(fileName, codBarra, tombo, responseReflora);
        });
    });
}

function proccessMaxCodBarra(fileName, maxCodBarra) {
    const newMaxCodBarra = maxCodBarra.replace('HCF', '');
    writeFileLOG(fileName, `Processando o maior código de barra que é ${maxCodBarra}`);
    return parseInt(newMaxCodBarra);
}

export default {
    proccessMaxCodBarra, compareTombo,
};
