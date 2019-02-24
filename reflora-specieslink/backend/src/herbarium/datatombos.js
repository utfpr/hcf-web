/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Q from 'q';
import {
    selectPais,
    selectEstado,
    selectCidade,
    selectLocalColeta,
    selectPaisSigla,
    //    selectVegetacao,
    selectTomboJson,
    selectFamilia,
    selectGenero,
    selectEspecie,
    selectAutor,
    selectVariedade,
    selectTipo,
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

function processaString(valor) {
    return valor.replace(/\s/g, '').toLowerCase();
}

export function ehIgualNroColeta(informacaoBd, informacaoReflora) {
    const nroColetaBd = informacaoBd.numero_coleta;
    const nroColetaReflora = informacaoReflora.recordnumber;
    if (valorEhIndefinido(nroColetaBd) || valorEhIndefinido(nroColetaReflora)) {
        return -1;
    }
    if (valorEhNulo(nroColetaBd) || valorEhNulo(nroColetaReflora)) {
        return -1;
    }
    const floatNroColetaBd = parseFloat(nroColetaBd);
    const floatNroColetaReflora = parseFloat(nroColetaReflora);
    if (!ehNumero(floatNroColetaBd) || !ehNumero(floatNroColetaReflora)) {
        return -1;
    }
    if (floatNroColetaBd === floatNroColetaReflora) {
        return -1;
    }
    return floatNroColetaReflora;
}


export function ehIgualAnoColeta(informacaoBd, informacaoReflora) {
    const anoColetaBd = informacaoBd.data_coleta_ano;
    const anoColetaReflora = informacaoReflora.year;
    if (valorEhIndefinido(anoColetaBd) || valorEhIndefinido(anoColetaReflora)) {
        return -1;
    }
    if (valorEhNulo(anoColetaBd) || valorEhNulo(anoColetaReflora)) {
        return -1;
    }
    const intAnoColetaBd = parseInt(anoColetaBd);
    const intAnoColetaReflora = parseInt(anoColetaReflora);
    if (!ehNumero(intAnoColetaBd) || !ehNumero(intAnoColetaReflora)) {
        return -1;
    }
    if (intAnoColetaBd === intAnoColetaReflora) {
        return -1;
    }
    return intAnoColetaReflora;
}

export function ehIgualMesColeta(informacaoBd, informacaoReflora) {
    const mesColetaBd = informacaoBd.data_coleta_mes;
    const mesColetaReflora = informacaoReflora.month;
    if (valorEhIndefinido(mesColetaBd) || valorEhIndefinido(mesColetaReflora)) {
        return -1;
    }
    if (valorEhNulo(mesColetaBd) || valorEhNulo(mesColetaReflora)) {
        return -1;
    }
    const intMesColetaBd = parseInt(mesColetaBd);
    const intMesColetaReflora = parseInt(mesColetaReflora);
    if (!ehNumero(intMesColetaBd) || !ehNumero(intMesColetaReflora)) {
        return -1;
    }
    if (intMesColetaBd === intMesColetaReflora) {
        return -1;
    }
    return intMesColetaReflora;
}

export function ehIgualDiaColeta(informacaoBd, informacaoReflora) {
    const diaColetaBd = informacaoBd.data_coleta_dia;
    const diaColetaReflora = informacaoReflora.day;
    if (valorEhIndefinido(diaColetaBd) || valorEhIndefinido(diaColetaReflora)) {
        return -1;
    }
    if (valorEhNulo(diaColetaBd) || valorEhNulo(diaColetaReflora)) {
        return -1;
    }
    const intDiaColetaBd = parseInt(diaColetaBd);
    const intDiaColetaReflora = parseInt(diaColetaReflora);
    if (!ehNumero(intDiaColetaBd) || !ehNumero(intDiaColetaReflora)) {
        return -1;
    }
    if (intDiaColetaBd === intDiaColetaReflora) {
        return -1;
    }
    return intDiaColetaReflora;
}

export function ehIgualObservacao(informacaoBd, informacaoReflora) {
    const observacaoBd = informacaoBd.observacao;
    const observacaoReflora = informacaoReflora.fieldnotes;
    if (valorEhIndefinido(observacaoBd) || valorEhIndefinido(observacaoReflora)) {
        return '';
    }
    if (valorEhNulo(observacaoBd) || valorEhNulo(observacaoReflora)) {
        return '';
    }
    if ((observacaoBd.length === 0) || (observacaoReflora.length === 0)) {
        return '';
    }
    const processaObservacaoBd = processaString(observacaoBd);
    const processaObservacaoReflora = processaString(observacaoReflora);
    if (processaObservacaoBd.includes(processaObservacaoReflora)) {
        return '';
    }
    return observacaoReflora;
}

export function getIdCidade(conexao, informacaoBd) {
    const promessa = Q.defer();
    const idLocalColeta = informacaoBd.local_coleta_id;
    selectLocalColeta(conexao, idLocalColeta).then(resultadoLocalColetaBd => {
        if (resultadoLocalColetaBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        return resultadoLocalColetaBd;
    }).then(resultadoLocalColetaBd => {
        const idCidade = parseInt(resultadoLocalColetaBd[0].dataValues.cidade_id);
        if (valorEhNulo(idCidade) || !ehNumero(idCidade)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(idCidade);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualPais(conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    selectPais(conexao, idCidade).then(resultadoPaisBd => {
        if (resultadoPaisBd === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        return resultadoPaisBd;
    }).then(resultadoPaisBd => {
        const nomePaisBd = resultadoPaisBd[0].dataValues.estados_paises_nome;
        const nomePaisReflora = informacaoReflora.country;
        if (valorEhIndefinido(nomePaisBd) || valorEhIndefinido(nomePaisReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomePaisBd) || valorEhNulo(nomePaisReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomePaisBd.length === 0) || (nomePaisReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomePaisBd = processaString(nomePaisBd);
        const processaNomePaisReflora = processaString(nomePaisReflora);
        if (processaNomePaisBd === processaNomePaisReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomePaisReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualPaisSigla(conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    selectPaisSigla(conexao, idCidade).then(resultadoPaisSiglaBd => {
        if (resultadoPaisSiglaBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        return resultadoPaisSiglaBd;
    }).then(resultadoPaisSiglaBd => {
        const nomePaisSiglaBd = resultadoPaisSiglaBd[0].dataValues.estados_paises_sigla;
        const nomePaisSiglaReflora = informacaoReflora.countrycode;
        if (valorEhIndefinido(nomePaisSiglaBd) || valorEhIndefinido(nomePaisSiglaReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomePaisSiglaBd) || valorEhNulo(nomePaisSiglaReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomePaisSiglaBd.length === 0) || (nomePaisSiglaReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomePaisSiglaBd = processaString(nomePaisSiglaBd);
        const processaNomePaisSiglaReflora = processaString(nomePaisSiglaReflora);
        if (processaNomePaisSiglaBd === processaNomePaisSiglaReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomePaisSiglaReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualEstado(conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    selectEstado(conexao, idCidade).then(resultadoEstadoBd => {
        if (resultadoEstadoBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        return resultadoEstadoBd;
    }).then(resultadoEstadoBd => {
        const nomeEstadoBd = resultadoEstadoBd[0].dataValues.estados_nome;
        const nomeEstadoReflora = informacaoReflora.stateprovince;
        if (valorEhIndefinido(nomeEstadoBd) || valorEhIndefinido(nomeEstadoReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeEstadoBd) || valorEhNulo(nomeEstadoReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeEstadoBd.length === 0) || (nomeEstadoReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeEstadoBd = processaString(nomeEstadoBd);
        const processaNomeEstadoReflora = processaString(nomeEstadoReflora);
        if (processaNomeEstadoBd === processaNomeEstadoReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeEstadoReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

// =======================================================

export function ehIgualCidade(nomeArquivo, conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    selectCidade(conexao, idCidade, resultadoCidadeTombo => {
        if (resultadoCidadeTombo.length > 0) {
            const nomeCidadeBD = resultadoCidadeTombo[0].dataValues.nome;
            const nomeCidadeReflora = informacaoReflora.municipality;
            if (valorEhIndefinido(nomeCidadeBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeCidadeBD}} o estado é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(nomeCidadeReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeCidadeReflora}} o estado é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeCidadeBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeCidadeBD}} o estado é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeCidadeReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeCidadeReflora}} o estado é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeCidadeBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomeCidadeBD}} as informações de estado é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeCidadeReflora.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomeCidadeReflora}} as informações de estado é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaNomeCidadeBD = processaString(nomeCidadeBD);
            const processaNomeCidadeReflora = processaString(nomeCidadeReflora);
            if (processaNomeCidadeBD === processaNomeCidadeReflora) {
                escreveLOG(nomeArquivo, `{BD: ${nomeCidadeBD}, Reflora: ${nomeCidadeReflora}} os estados são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomeCidadeBD}, Reflora: ${nomeCidadeReflora}} os estados são diferentes`);
            promessa.resolve(nomeCidadeReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de cidade');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualLocalidade(nomeArquivo, conexao, idLocalColeta, informacaoTomboBD, informacaoReflora) {
    const promessa = Q.defer();
    /* selectLocalColeta(conexao, idLocalColeta, resultadoLocalColetaTombo => {
        if (resultadoLocalColetaTombo.length === 0) {
            escreveLOG(nomeArquivo, 'Não foram retornados informações de local de coleta');
            promessa.resolve(-1);
            return promessa.promise;
        }
        const idVegetacaoBD = resultadoLocalColetaTombo[0].dataValues.vegetacao_id;
        if (valorEhNulo(idVegetacaoBD)) {
            escreveLOG(nomeArquivo, `{BD: ${idVegetacaoBD}} o valor de vegetação é nulo`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        const intVegetacaoBD = parseInt(idVegetacaoBD);
        if (!ehNumero(intVegetacaoBD)) {
            escreveLOG(nomeArquivo, `{BD: ${intVegetacaoBD}} o valor de vegetação não é número`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        // const intVegetacaoBD = 1;
        selectVegetacao(conexao, intVegetacaoBD, resultadoVegetacaoTombo => {
            const vegetacaoBD = resultadoVegetacaoTombo[0].dataValues.nome;
            // const vegetacaoBD = 'Floresta ombrófila densa submontana.';
            const observacaoTomboBD = informacaoTomboBD.observacao;
            // const observacaoTomboBD = 'Em barranco próximo ao rio. Estágio avançado. Rara no interior de fragmento.';
            const localidadeReflora = informacaoReflora.locality;
            if (valorEhNulo(vegetacaoBD)) {
                escreveLOG(nomeArquivo, `{BD: ${vegetacaoBD}} a vegetação é nula`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(observacaoTomboBD)) {
                escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}} a observação é nula`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(localidadeReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${localidadeReflora}} a localidade é nula`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (vegetacaoBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${vegetacaoBD}} não existe nome de vegetação`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (observacaoTomboBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}} não existe observação`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (localidadeReflora.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${vegetacaoBD}} não existe localidade`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaObservacaoBD = processaString(observacaoTomboBD);
            const processaVegetacaoBD = processaString(vegetacaoBD);
            const processaLocalidadeReflora = processaString(localidadeReflora);
            if (processaLocalidadeReflora.includes(processaObservacaoBD) && processaLocalidadeReflora.includes(processaVegetacaoBD)) {
                escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}, ${vegetacaoBD}, Reflora: ${localidadeReflora}} são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}, ${vegetacaoBD}, Reflora: ${localidadeReflora}} são diferentes`);
            promessa.resolve(localidadeReflora);
            return promessa.promise;
        });
        return promessa.promise;
    }); */
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
    if (valorEhIndefinido(altitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${altitudeBD}} a altitude é indefinido`);
        return -1;
    }
    if (valorEhIndefinido(minAltitudeReflora)) {
        escreveLOG(nomeArquivo, `{BD: ${minAltitudeReflora}} a mínima altitude é indefinido`);
        return -1;
    }
    if (valorEhIndefinido(maxAltitudeReflora)) {
        escreveLOG(nomeArquivo, `{BD: ${maxAltitudeReflora}} a máxima altitude é indefinido`);
        return -1;
    }
    if (valorEhNulo(altitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${altitudeBD}} a altitude é nula`);
        return -1;
    }
    if (valorEhNulo(minAltitudeReflora)) {
        escreveLOG(nomeArquivo, `{BD: ${minAltitudeReflora}} a mínima altitude é nula`);
        return -1;
    }
    if (valorEhNulo(maxAltitudeReflora)) {
        escreveLOG(nomeArquivo, `{BD: ${maxAltitudeReflora}} a máxima altitude é nula`);
        return -1;
    }
    const intAltitudeBD = parseInt(altitudeBD.toString().replace('m', ''));
    const intMinAltitudeReflora = parseInt(minAltitudeReflora);
    const intMaxAltitudeReflora = parseInt(maxAltitudeReflora);
    if (!ehNumero(intAltitudeBD)) {
        escreveLOG(nomeArquivo, `{BD: ${intAltitudeBD}} a altitude não é número`);
        return -1;
    }
    if (!ehNumero(intMinAltitudeReflora)) {
        escreveLOG(nomeArquivo, `{BD: ${intMinAltitudeReflora}} a mínima altitude não é número`);
        return -1;
    }
    if (!ehNumero(intMaxAltitudeReflora)) {
        escreveLOG(nomeArquivo, `{BD: ${intMaxAltitudeReflora}} a máxima altitude não é número`);
        return -1;
    }
    if (intAltitudeBD === intMinAltitudeReflora && intAltitudeBD === intMaxAltitudeReflora) {
        escreveLOG(nomeArquivo, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} altitudes são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${intAltitudeBD}, Reflora: ${intMinAltitudeReflora}, ${intMaxAltitudeReflora}} altitudes são diferentes`);
    return intMaxAltitudeReflora;
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
    /*
        Nessa função não é necessário fazer if individuais, ou seja, verificar um if se é nulo, indefinido ou número
        Porque se for nulo ou indefinido ou se não for número, não iremos adicionar na nossa String com a data de identificação
        Além disso, se colocar uma para cada aumentaria o tamanho do LOG
    */
    if (!valorEhNulo(dataIdentificacaoDiaBD) || !valorEhIndefinido(dataIdentificacaoDiaBD) || ehNumero(parseInt(dataIdentificacaoDiaBD))) {
        dataIdentificacao += `${dataIdentificacaoDiaBD}/`;
    }
    if (!valorEhNulo(dataIdentificacaoMesBD) || !valorEhIndefinido(dataIdentificacaoMesBD) || ehNumero(parseInt(dataIdentificacaoMesBD))) {
        dataIdentificacao += `${dataIdentificacaoMesBD}/`;
    }
    if (!valorEhNulo(dataIdentificacaoAnoBD) || !valorEhIndefinido(dataIdentificacaoAnoBD) || ehNumero(parseInt(dataIdentificacaoAnoBD))) {
        dataIdentificacao += `${dataIdentificacaoAnoBD}`;
    }
    if (dataIdentificacao === dataIdentificacaoReflora) {
        escreveLOG(nomeArquivo, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora}} datas de identificação são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${dataIdentificacao}, Reflora: ${dataIdentificacaoReflora}} datas de identificação são diferentes`);
    // return '2014';
    // return '11/2014';
    return dataIdentificacaoReflora;
}

export function ehIgualTipo(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    // const idTipo = informacaoBD.tipo_id;
    const idTipo = 1;
    selectTipo(conexao, idTipo, resultadoTipoTombo => {
        if (resultadoTipoTombo.length > 0) {
            const nomeTipoBD = resultadoTipoTombo[0].dataValues.nome;
            const nomeTipoReflora = informacaoReflora.typestatus;
            // const nomeTipoReflora = 'Isótipo';
            if (valorEhIndefinido(nomeTipoBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeTipoBD}} tipo é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(nomeTipoReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeTipoReflora}} tipo é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeTipoBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeTipoBD}} tipo é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeTipoReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeTipoReflora}} tipo é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeTipoBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomeTipoBD}} as informações de tipo são vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeTipoReflora.length === 0) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeTipoReflora}} as informações de tipo são vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaNomeTipoBD = processaString(nomeTipoBD);
            const processaNomeTipoReflora = processaString(nomeTipoReflora);
            if (processaNomeTipoBD === processaNomeTipoReflora) {
                escreveLOG(nomeArquivo, `{BD: ${nomeTipoBD}, Reflora: ${nomeTipoReflora}} os tipos são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${nomeTipoBD}, Reflora: ${nomeTipoReflora}} os tipos são diferentes`);
            promessa.resolve(nomeTipoReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações de tipo');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualNomeCientifico(nomeArquivo, informacaoBD, informacaoReflora) {
    const nomeCientificoBD = informacaoBD.nome_cientifico;
    const nomeCientificoReflora = informacaoReflora.scientificname;
    if (valorEhIndefinido(nomeCientificoBD)) {
        escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD}} nome científico é indefinido`);
        return '';
    }
    if (valorEhIndefinido(nomeCientificoReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${nomeCientificoReflora}} nome científico é indefinido`);
        return '';
    }
    if (valorEhNulo(nomeCientificoBD)) {
        escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD}} nome científico é nulo`);
        return '';
    }
    if (valorEhNulo(nomeCientificoReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${nomeCientificoReflora}} nome científico é nulo`);
        return '';
    }
    if (nomeCientificoBD.length === 0) {
        escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD}} o nome científicos é vazio`);
        return '';
    }
    if (nomeCientificoReflora.length === 0) {
        escreveLOG(nomeArquivo, `{Reflora: ${nomeCientificoReflora}} o nome científico é vazio`);
        return '';
    }
    const processaNomeCientificoBD = processaString(nomeCientificoBD);
    const processaNomeCientificoReflora = processaString(nomeCientificoReflora);
    if (processaNomeCientificoBD === processaNomeCientificoReflora) {
        escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD}, Reflora: ${nomeCientificoReflora}} nomes científicos são iguais`);
        return '';
    }
    escreveLOG(nomeArquivo, `{BD: ${nomeCientificoBD}, Reflora: ${nomeCientificoReflora}} nomes científicos são diferentes`);
    return nomeCientificoReflora;
}

/* (Aqui pra baixo ok) Esse processo de verificar o tamanho é necessário nas funções abaixo, pois estamos fazendo um outro select */
export function ehIgualFamilia(nomeArquivo, conexao, informacaoBD, informacaoReflora) {
    const promessa = Q.defer();
    const idNomeFamilia = informacaoBD.familia_id;
    // const idNomeFamilia = informacaoBD.familia_id - 265;
    selectFamilia(conexao, idNomeFamilia, resultadoFamiliaTombo => {
        if (resultadoFamiliaTombo.length > 0) {
            const nomeFamiliaBD = resultadoFamiliaTombo[0].dataValues.nome;
            const nomeFamiliaReflora = informacaoReflora.family;
            if (valorEhIndefinido(nomeFamiliaBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeFamiliaBD}} a família é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(nomeFamiliaReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeFamiliaReflora}} a família é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeFamiliaBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeFamiliaBD}} a família é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeFamiliaReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeFamiliaReflora}} a família é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeFamiliaBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomeFamiliaBD}} a família é vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeFamiliaReflora.length === 0) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeFamiliaReflora}} a família é vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaNomeFamiliaBD = processaString(nomeFamiliaBD);
            const processaNomeFamiliaReflora = processaString(nomeFamiliaReflora);
            if (processaNomeFamiliaBD === processaNomeFamiliaReflora) {
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
    // const idNomeGenero = informacaoBD.genero_id + 50;
    selectGenero(conexao, idNomeGenero, resultadoGeneroTombo => {
        if (resultadoGeneroTombo.length > 0) {
            const nomeGeneroBD = resultadoGeneroTombo[0].dataValues.nome;
            const nomeGeneroReflora = informacaoReflora.genus;
            if (valorEhIndefinido(nomeGeneroBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeGeneroBD}} o gênero é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(nomeGeneroReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeGeneroReflora}} o gênero é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeGeneroBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeGeneroBD}} o gênero é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeGeneroReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeGeneroReflora}} o gênero é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeGeneroBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomeGeneroBD}} o gênero é vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeGeneroReflora.length === 0) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeGeneroReflora}} o gênero é vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaNomeGeneroBD = processaString(nomeGeneroBD);
            const processaNomeGeneroReflora = processaString(nomeGeneroReflora);
            if (processaNomeGeneroBD === processaNomeGeneroReflora) {
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
    // const idNomeEspecie = 1;
    selectEspecie(conexao, idNomeEspecie, resultadoEspecieTombo => {
        if (resultadoEspecieTombo.length > 0) {
            const nomeEspecieBD = resultadoEspecieTombo[0].dataValues.nome;
            const nomeEspecieReflora = informacaoReflora.infraespecificepithet;
            if (valorEhIndefinido(nomeEspecieBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEspecieBD}} a espécie é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(nomeEspecieReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeEspecieReflora}} a espécie é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeEspecieBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEspecieBD}} a espécie é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeEspecieReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeEspecieReflora}} a espécie é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeEspecieBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEspecieBD}} as inforamções espécies são vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeEspecieReflora.length === 0) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeEspecieReflora}} as inforamções espécies são vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaNomeEspecieBD = processaString(nomeEspecieBD);
            const processaNomeEspecieReflora = processaString(nomeEspecieReflora);
            if (processaNomeEspecieBD === processaNomeEspecieReflora) {
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
    // const idVariedade = 1;
    selectVariedade(conexao, idVariedade, resultadoVariedadeTombo => {
        if (resultadoVariedadeTombo.length > 0) {
            const nomeVariedadeBD = resultadoVariedadeTombo[0].dataValues.nome;
            const nomeVariedadeReflora = informacaoReflora.infraespecificepithet;
            if (valorEhIndefinido(nomeVariedadeBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeVariedadeBD}} a variedade é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(nomeVariedadeReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeVariedadeReflora}} a variedade é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeVariedadeBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeVariedadeBD}} a variedade é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeVariedadeReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeVariedadeReflora}} a variedade é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeVariedadeBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomeVariedadeBD}} as informações de variedades são vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeVariedadeReflora.length === 0) {
                escreveLOG(nomeArquivo, `{Reflora: ${nomeVariedadeReflora}} as informações de variedades são vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaNomeVariedadeBD = processaString(nomeVariedadeBD);
            const processaNomeVariedadeReflora = processaString(nomeVariedadeReflora);
            if (processaNomeVariedadeBD === processaNomeVariedadeReflora) {
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

export function getIdAutor(nomeArquivo, conexao, informacaoBD) {
    const promessa = Q.defer();
    const idLocalColeta = informacaoBD.especie_id;
    selectEspecie(conexao, idLocalColeta, resultadoIDAutorTombo => {
        if (resultadoIDAutorTombo.length === 0) {
            escreveLOG(nomeArquivo, 'Não foram retornados informações de espécies');
            promessa.resolve(-1);
            return promessa.promise;
        }
        const idAutor = parseInt(resultadoIDAutorTombo[0].dataValues.autor_id);
        if (valorEhNulo(idAutor)) {
            escreveLOG(nomeArquivo, `{BD: ${idAutor}} o ID do autor é nulo`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (!ehNumero(idAutor)) {
            escreveLOG(nomeArquivo, `{BD: ${idAutor}} o ID do autor não é número`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, `{BD: ${idAutor}} o ID do autor é número`);
        promessa.resolve(idAutor);
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
            if (valorEhIndefinido(autorNomeCientificoBD)) {
                escreveLOG(nomeArquivo, `{BD: ${autorNomeCientificoBD}} o autor científico é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(autorNomeCientificoReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${autorNomeCientificoReflora}} o autor científico é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(autorNomeCientificoBD)) {
                escreveLOG(nomeArquivo, `{BD: ${autorNomeCientificoBD}} o autor científico é vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(autorNomeCientificoReflora)) {
                escreveLOG(nomeArquivo, `{Reflora: ${autorNomeCientificoReflora}} o autor científico é vazio`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (autorNomeCientificoBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${autorNomeCientificoBD}} a informação de autor científico é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (autorNomeCientificoReflora.length === 0) {
                escreveLOG(nomeArquivo, `{Reflora: ${autorNomeCientificoReflora}} a informação de autor científico é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaAutorNomeCientificoBD = processaString(autorNomeCientificoBD);
            const processaAutorNomeCientificoReflora = processaString(autorNomeCientificoReflora);
            if (processaAutorNomeCientificoBD === processaAutorNomeCientificoReflora) {
                escreveLOG(nomeArquivo, `{BD: ${autorNomeCientificoBD}, Reflora: ${autorNomeCientificoReflora}} os autores dos nomes científicos são iguais`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            escreveLOG(nomeArquivo, `{BD: ${autorNomeCientificoBD}, Reflora: ${autorNomeCientificoReflora}} os autores dos nomes científicos são diferentes`);
            promessa.resolve(autorNomeCientificoReflora);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, 'Não foram retornados informações dos autores dos nomes científicos');
        promessa.resolve(-1);
        return promessa.promise;
    });
    return promessa.promise;
}

function ehIgualJson(jsonBd, jsonGerado) {
    // const processaJsonBd = JSON.parse(jsonBd);
    // const processaJsonGerado = JSON.parse(jsonGerado);
    if (jsonBd === jsonGerado) {
        return true;
    }
    return false;
}

export function verificaAlteracaoSugerida(conexao, nomeArquivo, nroTombo, jsonGerado) {
    const promessa = Q.defer();
    selectTomboJson(conexao, nroTombo, listaTomboJson => {
        if (listaTomboJson.length === 0) {
            escreveLOG(nomeArquivo, `{BD: ${nroTombo}} o número de tombo não tem alterações`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(listaTomboJson)) {
            escreveLOG(nomeArquivo, `{BD: ${nroTombo}} o número de tombo tem alterações nula`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhIndefinido(listaTomboJson)) {
            escreveLOG(nomeArquivo, `{BD: ${nroTombo}} o número de tombo tem alterações indefinida`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        for (let i = 0; i < listaTomboJson.length; i += 1) {
            const tomboJson = listaTomboJson[i].dataValues.tombo_json;
            if (ehIgualJson(jsonGerado, tomboJson)) {
                escreveLOG(nomeArquivo, `{BD: ${nroTombo}} o número de tombo já existe uma alteração`);
                promessa.resolve(0);
                return promessa.promise;
            }
        }
        escreveLOG(nomeArquivo, `{BD: ${nroTombo}} o número de tombo não existe uma alteração`);
        promessa.resolve(1);
        return promessa.promise;
    });
    return promessa.promise;
}
