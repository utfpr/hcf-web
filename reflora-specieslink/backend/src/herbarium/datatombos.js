/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Q from 'q';
import {
    selectLocalColeta,
    selectFamilia,
    selectGenero,
    selectEspecie,
    selectAutor,
    selectTipo,
    selectVariedade,
    selectCidade,
    selectEstado,
    selectPais,
} from './database';
import { escreveLOG } from './log';

function valorEhIndefinido(valor) {
    if (valor === undefined) {
        return true;
    }
    return false;
}

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

export function ehIgualNroColeta(nomeArquivo, informacaoBD, informacaoReflora) {
    const nroColetaBD = informacaoBD.latitude;
    const nroColetaReflora = informacaoReflora.recordnumber;
    if (valorEhIndefinido(nroColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${nroColetaBD}} o número de coleta é indefinido`);
        return -1;
    }
    if (valorEhIndefinido(nroColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${nroColetaReflora}} o número de coleta é indefinido`);
        return -1;
    }
    if (valorEhNulo(nroColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${nroColetaBD}} o número de coleta é nula`);
        return -1;
    }
    if (valorEhNulo(nroColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${nroColetaReflora}} o número de coleta é nula`);
        return -1;
    }
    const floatNroColetaBD = parseFloat(nroColetaBD);
    const floatNroColetaReflora = parseFloat(nroColetaReflora);
    if (!ehNumero(floatNroColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${floatNroColetaBD}} o número de coleta não é número`);
        return -1;
    }
    if (!ehNumero(floatNroColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${floatNroColetaReflora}} o número de coleta não é número`);
        return -1;
    }
    if (floatNroColetaBD === floatNroColetaReflora) {
        escreveLOG(nomeArquivo, `{BD: ${floatNroColetaBD}, Reflora: ${floatNroColetaReflora}} números de coletas são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${floatNroColetaBD}, Reflora: ${floatNroColetaReflora}} números de coletas são diferentes`);
    return floatNroColetaReflora;
}

export function ehIgualAnoColeta(nomeArquivo, informacaoBD, informacaoReflora) {
    const anoColetaBD = informacaoBD.data_coleta_ano;
    const anoColetaReflora = informacaoReflora.year;
    if (!valorEhNulo(anoColetaBD) && !valorEhNulo(anoColetaReflora)) {
        const intAnoColetaBD = parseInt(anoColetaBD);
        const intAnoColetaReflora = parseInt(anoColetaReflora);
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
    escreveLOG(nomeArquivo, `{BD: ${anoColetaBD}, Reflora: ${anoColetaReflora}} anos de coleta são nulos`);
    return -1;
}

export function ehIgualMesColeta(nomeArquivo, informacaoBD, informacaoReflora) {
    const mesColetaBD = informacaoBD.data_coleta_mes;
    const mesColetaReflora = informacaoReflora.month;
    if (!valorEhNulo(mesColetaBD) && !valorEhNulo(mesColetaReflora)) {
        const intMesColetaBD = parseInt(mesColetaBD);
        const intMesColetaReflora = parseInt(mesColetaReflora);
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
    escreveLOG(nomeArquivo, `{BD: ${mesColetaBD}, Reflora: ${mesColetaReflora}} mês da coletas são nulos`);
    return -1;
}

export function ehIgualDiaColeta(nomeArquivo, informacaoBD, informacaoReflora) {
    const diaColetaBD = informacaoBD.data_coleta_dia;
    const diaColetaReflora = informacaoReflora.day;
    if (!valorEhNulo(diaColetaBD) && !valorEhNulo(diaColetaReflora)) {
        const intDiaColetaBD = parseInt(diaColetaBD);
        const intDiaColetaReflora = parseInt(diaColetaReflora);
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
    escreveLOG(nomeArquivo, `{BD: ${diaColetaBD}, Reflora: ${diaColetaReflora}} dias de coletas são nulos`);
    return -1;
}

export function ehIgualObservacao(nomeArquivo, informacaoBD, informacaoReflora) {
    const observacaoTomboBD = informacaoBD.observacao;
    const observacaoTomboReflora = informacaoReflora.fieldnotes;
    if (valorEhNulo(observacaoTomboBD)) {
        escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}} as observações são nulas`);
        return '';
    }
    if (valorEhNulo(observacaoTomboReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${observacaoTomboReflora}} as observações são nulas`);
        return '';
    }
    if (observacaoTomboBD.length === 0) {
        escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}} as informações de observações são vazias`);
        return '';
    }
    if (observacaoTomboReflora.length === 0) {
        escreveLOG(nomeArquivo, `{Reflora: ${observacaoTomboReflora}} as informações de observações são vazias`);
        return '';
    }
    if (observacaoTomboBD === observacaoTomboReflora) {
        escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}, Reflora: ${observacaoTomboReflora}} as observações são iguais`);
        return '';
    }
    escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}, Reflora: ${observacaoTomboReflora}} as observações são diferentes`);
    return observacaoTomboReflora;
}

export function getIDCidade(nomeArquivo, conexao, informacaoBD) {
    const promessa = Q.defer();
    const idLocalColeta = informacaoBD.local_coleta_id;
    selectLocalColeta(conexao, idLocalColeta, resultadoLocalColetaTombo => {
        if (resultadoLocalColetaTombo.length > 0) {
            const idCidade = parseInt(resultadoLocalColetaTombo[0].dataValues.cidade_id);
            if (!valorEhNulo(idCidade) && ehNumero(idCidade)) {
                promessa.resolve(idCidade);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${idCidade}} o ID da cidade não é válido`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de local de coleta');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualPais(nomeArquivo, conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    selectPais(conexao, idCidade, resultadoPaisTombo => {
        if (resultadoPaisTombo.length > 0) {
            const nomePaisBD = resultadoPaisTombo[0].dataValues.estados_paises_nome;
            const nomePaisReflora = informacaoReflora.country;
            if ((nomePaisBD === nomePaisReflora) && !valorEhNulo(nomePaisBD) && !valorEhNulo(nomePaisReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisBD}, Reflora: ${nomePaisReflora}} os países são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomePaisBD}, Reflora: ${nomePaisReflora}} os países são diferentes`);
            promessa.resolve(nomePaisReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de países');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualPaisSigla(nomeArquivo, conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    selectPais(conexao, idCidade, resultadoPaisSiglaTombo => {
        if (resultadoPaisSiglaTombo.length > 0) {
            const nomePaisSiglaBD = resultadoPaisSiglaTombo[0].dataValues.estados_paises_sigla;
            const nomePaisSiglaReflora = informacaoReflora.countrycode;
            if ((nomePaisSiglaBD === nomePaisSiglaReflora) && !valorEhNulo(nomePaisSiglaBD) && !valorEhNulo(nomePaisSiglaReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisSiglaBD}, Reflora: ${nomePaisSiglaReflora}} as siglas dos países são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomePaisSiglaBD}, Reflora: ${nomePaisSiglaReflora}} as siglas dos países são diferentes`);
            promessa.resolve(nomePaisSiglaReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de sigla dos países');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualEstado(nomeArquivo, conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    selectEstado(conexao, idCidade, resultadoEstadoTombo => {
        if (resultadoEstadoTombo.length > 0) {
            const nomeEstadoBD = resultadoEstadoTombo[0].dataValues.estados_nome;
            const nomeEstadoReflora = informacaoReflora.stateprovince;
            if ((nomeEstadoBD === nomeEstadoReflora) && !valorEhNulo(nomeEstadoBD) && !valorEhNulo(nomeEstadoReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEstadoBD}, Reflora: ${nomeEstadoReflora}} os estados são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomeEstadoBD}, Reflora: ${nomeEstadoReflora}} os estados são diferentes`);
            promessa.resolve(nomeEstadoReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de estados');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualCidade(nomeArquivo, conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    selectCidade(conexao, idCidade, resultadoCidadeTombo => {
        if (resultadoCidadeTombo.length > 0) {
            const nomeCidadeBD = resultadoCidadeTombo[0].dataValues.nome;
            const nomeCidadeReflora = informacaoReflora.municipality;
            if ((nomeCidadeBD === nomeCidadeReflora) && !valorEhNulo(nomeCidadeBD) && !valorEhNulo(nomeCidadeReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeCidadeBD}, Reflora: ${nomeCidadeReflora}} as cidades são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomeCidadeBD}, Reflora: ${nomeCidadeReflora}} as cidades são diferentes`);
            promessa.resolve(nomeCidadeReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de cidade');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualAltitude(nomeArquivo, informacaoBD, informacaoReflora) {
    /*
        No BD não tem altitude mínima e nem máxima, então é igual para os mesmos valores
        Além disso, algumas altitude vem com m de metros então para comparar é necessário tirar.
        Isso, porque no reflora não contém esse m
    */
    const altitudeBD = informacaoBD.altitude;
    const minAltitudeReflora = informacaoReflora.minimumelevationinmeters;
    const maxAltitudeReflora = informacaoReflora.maximumelevationinmeters;
    if (!valorEhNulo(altitudeBD) && !valorEhNulo(minAltitudeReflora) && !valorEhNulo(maxAltitudeReflora)) {
        const intAltitudeBD = parseInt(altitudeBD.toString().replace('m', ''));
        const intMinAltitudeReflora = parseInt(minAltitudeReflora);
        const intMaxAltitudeReflora = parseInt(maxAltitudeReflora);
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
    escreveLOG(nomeArquivo, `{BD: ${altitudeBD}, Reflora: ${minAltitudeReflora}, ${maxAltitudeReflora}} altitudes são nulos`);
    return -1;
}

export function ehIgualLatitude(nomeArquivo, informacaoBD, informacaoReflora) {
    const latitudeBD = informacaoBD.latitude;
    const latitudeReflora = informacaoReflora.decimallatitude;
    if (valorEhIndefinido(latitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${latitudeBD}} a latitude é indefinido`);
        return -1;
    }
    if (valorEhIndefinido(latitudeReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${latitudeReflora}} a latitude é indefinido`);
        return -1;
    }
    if (valorEhNulo(latitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${latitudeBD}} a latitude é nula`);
        return -1;
    }
    if (valorEhNulo(latitudeReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${latitudeReflora}} a latitude é nula`);
        return -1;
    }
    const floatLatitudeBD = parseFloat(latitudeBD);
    const floatLatitudeReflora = parseFloat(latitudeReflora);
    if (!ehNumero(floatLatitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${floatLatitudeBD}} a latitude não é número`);
        return -1;
    }
    if (!ehNumero(latitudeReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${latitudeReflora}} a latitude não é número`);
        return -1;
    }
    if (floatLatitudeBD === floatLatitudeReflora) {
        escreveLOG(nomeArquivo, `{BD: ${floatLatitudeBD}, Reflora: ${floatLatitudeReflora}} latitudes são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${floatLatitudeBD}, Reflora: ${floatLatitudeReflora}} latitudes são diferentes`);
    return floatLatitudeReflora;
}

export function ehIgualLongitude(nomeArquivo, informacaoBD, informacaoReflora) {
    const longitudeBD = informacaoBD.longitude;
    const longitudeReflora = informacaoReflora.decimallongitude;
    if (valorEhIndefinido(longitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${longitudeBD}} a longitude é indefinido`);
        return -1;
    }
    if (valorEhIndefinido(longitudeReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${longitudeReflora}} a longitude é indefinido`);
        return -1;
    }
    if (valorEhNulo(longitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${longitudeBD}} a longitude é nula`);
        return -1;
    }
    if (valorEhNulo(longitudeReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${longitudeReflora}} a longitude é nula`);
        return -1;
    }
    const floatLongitudeBD = parseFloat(longitudeBD);
    const floatLongitudeReflora = parseFloat(longitudeReflora);
    if (!ehNumero(floatLongitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${floatLongitudeBD}} a longitude não é número`);
        return -1;
    }
    if (!ehNumero(floatLongitudeReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${floatLongitudeReflora}} a longitude não é número`);
        return -1;
    }
    if (floatLongitudeBD === floatLongitudeReflora) {
        escreveLOG(nomeArquivo, `{BD: ${floatLongitudeBD}, Reflora: ${floatLongitudeReflora}} longitudes são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${floatLongitudeBD}, Reflora: ${floatLongitudeReflora}} longitudes são diferentes`);
    return floatLongitudeReflora;
}

export function ehIgualDataIdentificacao(nomeArquivo, informacaoBD, informacaoReflora) {
    let dataIdentificacao = '';
    const dataIdentificacaoDiaBD = informacaoBD.data_identificacao_dia;
    const dataIdentificacaoMesBD = informacaoBD.data_identificacao_mes;
    const dataIdentificacaoAnoBD = informacaoBD.data_identificacao_ano;
    const dataIdentificacaoReflora = informacaoReflora.dateidentified;
    if (!valorEhNulo(dataIdentificacaoDiaBD)) {
        dataIdentificacao += `${dataIdentificacaoDiaBD}/`;
    }
    if (!valorEhNulo(dataIdentificacaoMesBD)) {
        dataIdentificacao += `${dataIdentificacaoMesBD}/`;
    }
    if (!valorEhNulo(dataIdentificacaoAnoBD)) {
        dataIdentificacao += `${dataIdentificacaoAnoBD}`;
    }
    if (dataIdentificacao === dataIdentificacaoReflora) {
        escreveLOG(nomeArquivo, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora}} datas de identificação são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora}} datas de identificação são diferentes`);
    return dataIdentificacaoReflora;
}

export function ehIgualTipo(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idTipo = informacaoBD.tipo_id;
    selectTipo(conexao, idTipo, resultadoTipoTombo => {
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

export function ehIgualNomeCientifico(nomeArquivo, informacaoBD, informacaoReflora) {
    const nomeCientificoBD = informacaoBD.nome_cientifico;
    const nomeEspecieReflora = informacaoReflora.scientificname;
    if (nomeCientificoBD === nomeEspecieReflora) {
        escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD}, Reflora: ${nomeEspecieReflora}} nomes científicos são iguais`);
        return '';
    }
    escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD}, Reflora: ${nomeEspecieReflora}} nomes científicos são diferentes`);
    return nomeEspecieReflora;
}

/* (Aqui pra baixo ok) Esse processo de verificar o tamanho é necessário nas funções abaixo, pois estamos fazendo um outro select */
export function ehIgualFamilia(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idNomeFamilia = informacaoBD.familia_id;
    selectFamilia(conexao, idNomeFamilia, resultadoFamiliaTombo => {
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

export function ehIgualGenero(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idNomeGenero = informacaoBD.genero_id;
    selectGenero(conexao, idNomeGenero, resultadoGeneroTombo => {
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

export function ehIgualEspecie(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idNomeEspecie = informacaoBD.especie_id;
    selectEspecie(conexao, idNomeEspecie, resultadoEspecieTombo => {
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

export function ehIgualVariedade(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idVariedade = informacaoBD.variedade_id;
    selectVariedade(conexao, idVariedade, resultadoVariedadeTombo => {
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

export function getIDAutor(nomeArquivo, conexao, informacaoBD) {
    const promessa = Q.defer();
    const idLocalColeta = informacaoBD.especie_id;
    selectEspecie(conexao, idLocalColeta, resultadoIDAutorTombo => {
        if (resultadoIDAutorTombo.length > 0) {
            const idAutor = parseInt(resultadoIDAutorTombo[0].dataValues.autor_id);
            if (!valorEhNulo(idAutor) && ehNumero(idAutor)) {
                promessa.resolve(idAutor);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${idAutor}} o ID do autor não é válido`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de espécies');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualAutorNomeCientifico(nomeArquivo, conexao, idAutorNomeCientifico, informacaoReflora) {
    const promessa = Q.defer();
    selectAutor(conexao, idAutorNomeCientifico, resultadoAutorNomeCientificoTombo => {
        if (resultadoAutorNomeCientificoTombo.length > 0) {
            const autorNomeCientificoBD = resultadoAutorNomeCientificoTombo[0].dataValues.nome;
            const autorNomeCientificoReflora = informacaoReflora.scientificnameauthorship;
            if ((autorNomeCientificoBD === autorNomeCientificoReflora) && !valorEhNulo(autorNomeCientificoBD) && !valorEhNulo(autorNomeCientificoReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${autorNomeCientificoBD}, Reflora: ${autorNomeCientificoReflora}} dos autores dos nomes científicos são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${autorNomeCientificoBD}, Reflora: ${autorNomeCientificoReflora}} dos autores dos nomes científicos são diferentes`);
            promessa.resolve(autorNomeCientificoReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações dos autores dos nomes científicos');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}
