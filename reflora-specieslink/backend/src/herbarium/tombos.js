/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Q from 'q';
import database from './database';
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

function ehIgualNroColeta(nomeArquivo, informacaoBD, informacaoReflora) {
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

function ehIgualDiaColeta(nomeArquivo, informacaoBD, informacaoReflora) {
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

function ehIgualMesColeta(nomeArquivo, informacaoBD, informacaoReflora) {
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

function ehIgualAnoColeta(nomeArquivo, informacaoBD, informacaoReflora) {
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

function ehIgualAltitude(nomeArquivo, informacaoBD, informacaoReflora) {
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

function ehIgualLatitude(nomeArquivo, informacaoBD, informacaoReflora) {
    const latitudeBD = informacaoBD.latitude;
    const latitudeReflora = informacaoReflora.decimallatitude;
    if (!ehNumero(latitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${latitudeBD}} a latitude não é número`);
        return -1;
    }
    if (!ehNumero(latitudeReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${latitudeReflora}} a latitude não é número`);
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
    const intLatitudeBD = parseFloat(latitudeBD);
    const intLatitudeReflora = parseFloat(latitudeReflora);
    if (intLatitudeBD === intLatitudeReflora) {
        escreveLOG(nomeArquivo, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} latitudes são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${intLatitudeBD}, Reflora: ${intLatitudeReflora}} latitudes são diferentes`);
    return intLatitudeReflora;
}

function ehIgualLongitude(nomeArquivo, informacaoBD, informacaoReflora) {
    const longitudeBD = informacaoBD.longitude;
    const longitudeReflora = informacaoReflora.decimallatitude;
    if (!ehNumero(longitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${longitudeBD}} a longitude não é número`);
        return -1;
    }
    if (!ehNumero(longitudeReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${longitudeReflora}} a longitude não é número`);
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
    const intLongitudeBD = parseFloat(longitudeBD);
    const intLongitudeReflora = parseFloat(longitudeReflora);
    if (intLongitudeBD === intLongitudeReflora) {
        escreveLOG(nomeArquivo, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} longitudes são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${intLongitudeBD}, Reflora: ${intLongitudeReflora}} longitudes são diferentes`);
    return intLongitudeReflora;
}

function ehIgualDataIdentificacao(nomeArquivo, informacaoBD, informacaoReflora) {
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

function ehIgualNomeCientifico(nomeArquivo, informacaoBD, informacaoReflora) {
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

function ehIgualCidade(nomeArquivo, conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    database.selectCidade(conexao, idCidade, resultadoCidadeTombo => {
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

function ehIgualEstado(nomeArquivo, conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    database.selectEstado(conexao, idCidade, resultadoEstadoTombo => {
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

function ehIgualPais(nomeArquivo, conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    database.selectPais(conexao, idCidade, resultadoPaisTombo => {
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

function ehIgualPaisSigla(nomeArquivo, conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    database.selectPais(conexao, idCidade, resultadoPaisSiglaTombo => {
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

function ehIgualAutorNomeCientifico(nomeArquivo, conexao, idAutorNomeCientifico, informacaoReflora) {
    const promessa = Q.defer();
    database.selectAutor(conexao, idAutorNomeCientifico, resultadoAutorNomeCientificoTombo => {
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

function ehIgualObservacao(nomeArquivo, informacaoBD, informacaoReflora) {
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

function getIDCidade(nomeArquivo, conexao, informacaoBD) {
    const promessa = Q.defer();
    const idLocalColeta = informacaoBD.local_coleta_id;
    database.selectLocalColeta(conexao, idLocalColeta, resultadoLocalColetaTombo => {
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

function getIDAutor(nomeArquivo, conexao, informacaoBD) {
    const promessa = Q.defer();
    const idLocalColeta = informacaoBD.especie_id;
    database.selectEspecie(conexao, idLocalColeta, resultadoIDAutorTombo => {
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
        if (resultadoNomeCientifico.length > 0) {
            alteracaoInformacao += `nome_cientifico: ${resultadoNomeCientifico}, `;
        }
        escreveLOG(nomeArquivo, 'Comparando informações de observação');
        const resultadoObservacao = ehIgualObservacao(nomeArquivo, informacaoTomboBD, informacaoTomboReflora);
        if (resultadoObservacao.length > 0) {
            alteracaoInformacao += `observacao: ${resultadoObservacao}, `;
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
        const idCidade = await getIDCidade(nomeArquivo, conexao, informacaoTomboBD);
        if (idCidade !== -1) {
            await ehIgualCidade(nomeArquivo, conexao, idCidade, informacaoTomboReflora).then(cidade => {
                if (cidade !== -1) {
                    alteracaoInformacao += `cidade: ${cidade}, `;
                }
            });
            await ehIgualEstado(nomeArquivo, conexao, idCidade, informacaoTomboReflora).then(estado => {
                if (estado !== -1) {
                    alteracaoInformacao += `cidade: ${estado}, `;
                }
            });
            await ehIgualPais(nomeArquivo, conexao, idCidade, informacaoTomboReflora).then(pais => {
                if (pais !== -1) {
                    alteracaoInformacao += `pais: ${pais}, `;
                }
            });
            await ehIgualPaisSigla(nomeArquivo, conexao, idCidade, informacaoTomboReflora).then(paisSigla => {
                if (paisSigla !== -1) {
                    alteracaoInformacao += `pais_sigla: ${paisSigla}, `;
                }
            });
        }
        const idAutor = await getIDAutor(nomeArquivo, conexao, informacaoTomboBD);
        if (idAutor !== -1) {
            await ehIgualAutorNomeCientifico(nomeArquivo, conexao, idAutor, informacaoTomboReflora).then(nomeAutorCientifico => {
                // a
                if (nomeAutorCientifico !== -1) {
                    alteracaoInformacao += `nome_cientifico_autor: ${nomeAutorCientifico}, `;
                }
            });
        }
        // eslint-disable-next-line no-console
        console.log(`-> ${idCidade}`);
        alteracaoInformacao = alteracaoInformacao.substring(0, alteracaoInformacao.lastIndexOf(','));
        alteracaoInformacao += '}';
        // eslint-disable-next-line no-console
        console.log(`-> ${alteracaoInformacao}`);
    } else {
        escreveLOG(nomeArquivo, `Não será feito comparações, pois não foi encontrado informações do tombo ${codBarra}`);
    }
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
