/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Q from 'q';
import {
    selectPais,
    selectEstado,
    selectCidade,
    selectLocalColeta,
    selectPaisSigla,
    selectVegetacao,
    selectInformacaoTomboJson,
    selectFamilia,
    selectGenero,
    selectEspecie,
    selectAutor,
    selectVariedade,
    selectTipo,
} from './database';

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

export function ehIgualCidade(conexao, idCidade, informacaoReflora) {
    const promessa = Q.defer();
    selectCidade(conexao, idCidade).then(resultadoCidadeBd => {
        if (resultadoCidadeBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeCidadeBd = resultadoCidadeBd[0].dataValues.nome;
        const nomeCidadeReflora = informacaoReflora.municipality;
        if (valorEhIndefinido(nomeCidadeBd) || valorEhIndefinido(nomeCidadeReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeCidadeBd) || valorEhNulo(nomeCidadeReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeCidadeBd.length === 0) || (nomeCidadeReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeCidadeBD = processaString(nomeCidadeBd);
        const processaNomeCidadeReflora = processaString(nomeCidadeReflora);
        if (processaNomeCidadeBD === processaNomeCidadeReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeCidadeReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualLocalidade(conexao, idLocalColeta, informacaoBd, informacaoReflora) {
    const promessa = Q.defer();
    selectLocalColeta(conexao, idLocalColeta).then(resultadoLocalColetaBd => {
        if (resultadoLocalColetaBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const idVegetacaoBd = resultadoLocalColetaBd[0].dataValues.vegetacao_id;
        if (valorEhNulo(idVegetacaoBd)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const intVegetacaoBd = parseInt(idVegetacaoBd);
        if (!ehNumero(intVegetacaoBd)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        selectVegetacao(conexao, intVegetacaoBd).then(resultadoVegetacaoTombo => {
            const vegetacaoBd = resultadoVegetacaoTombo[0].dataValues.nome;
            // const vegetacaoBD = 'Floresta ombrófila densa submontana.';
            const observacaoBd = informacaoBd.observacao;
            // const observacaoTomboBD = 'Em barranco próximo ao rio. Estágio avançado. Rara no interior de fragmento.';
            const localidadeReflora = informacaoReflora.locality;
            if (valorEhNulo(vegetacaoBd) || valorEhNulo(observacaoBd) || valorEhNulo(localidadeReflora)) {
                promessa.resolve(-1);
                return promessa.promise;
            }
            if ((vegetacaoBd.length === 0) || (observacaoBd.length === 0) || (localidadeReflora.length === 0)) {
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaObservacaoBD = processaString(observacaoBd);
            const processaVegetacaoBD = processaString(vegetacaoBd);
            const processaLocalidadeReflora = processaString(localidadeReflora);
            if (processaLocalidadeReflora.includes(processaObservacaoBD) && processaLocalidadeReflora.includes(processaVegetacaoBD)) {
                promessa.resolve(-1);
                return promessa.promise;
            }
            promessa.resolve(localidadeReflora);
            return promessa.promise;
        });
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualAltitude(informacaoBd, informacaoReflora) {
    /*
        No BD não tem altitude mínima e nem máxima, então é igual para os mesmos valores
        Além disso, algumas altitude vem com m de metros então para comparar é necessário tirar.
        Isso, porque no reflora não contém esse m
    */
    const altitudeBd = informacaoBd.altitude;
    const minAltitudeReflora = informacaoReflora.minimumelevationinmeters;
    const maxAltitudeReflora = informacaoReflora.maximumelevationinmeters;
    if (valorEhIndefinido(altitudeBd) || valorEhIndefinido(minAltitudeReflora) || valorEhIndefinido(maxAltitudeReflora)) {
        return -1;
    }
    if (valorEhNulo(altitudeBd) || valorEhNulo(minAltitudeReflora) || valorEhNulo(maxAltitudeReflora)) {
        return -1;
    }
    const intAltitudeBd = parseInt(altitudeBd.toString().replace('m', ''));
    const intMinAltitudeReflora = parseInt(minAltitudeReflora);
    const intMaxAltitudeReflora = parseInt(maxAltitudeReflora);
    if (!ehNumero(intAltitudeBd) || !ehNumero(intMinAltitudeReflora) || !ehNumero(intMaxAltitudeReflora)) {
        return -1;
    }
    if (intAltitudeBd === intMinAltitudeReflora && intAltitudeBd === intMaxAltitudeReflora) {
        return -1;
    }
    return intMaxAltitudeReflora;
}

export function ehIgualLatitude(informacaoBd, informacaoReflora) {
    const latitudeBd = informacaoBd.latitude;
    const latitudeReflora = informacaoReflora.decimallatitude;
    if (valorEhIndefinido(latitudeBd) || valorEhIndefinido(latitudeReflora)) {
        return -1;
    }
    if (valorEhNulo(latitudeBd) || valorEhNulo(latitudeReflora)) {
        return -1;
    }
    const floatLatitudeBd = parseFloat(latitudeBd);
    const floatLatitudeReflora = parseFloat(latitudeReflora);
    if (!ehNumero(floatLatitudeBd) || !ehNumero(latitudeReflora)) {
        return -1;
    }
    if (floatLatitudeBd === floatLatitudeReflora) {
        return -1;
    }
    return floatLatitudeReflora;
}

export function ehIgualLongitude(informacaoBd, informacaoReflora) {
    const longitudeBd = informacaoBd.longitude;
    const longitudeReflora = informacaoReflora.decimallongitude;
    if (valorEhIndefinido(longitudeBd) || valorEhIndefinido(longitudeReflora)) {
        return -1;
    }
    if (valorEhNulo(longitudeBd) || valorEhNulo(longitudeReflora)) {
        return -1;
    }
    const floatLongitudeBD = parseFloat(longitudeBd);
    const floatLongitudeReflora = parseFloat(longitudeReflora);
    if (!ehNumero(floatLongitudeBD) || !ehNumero(floatLongitudeReflora)) {
        return -1;
    }
    if (floatLongitudeBD === floatLongitudeReflora) {
        return -1;
    }
    return floatLongitudeReflora;
}

export function ehIgualDataIdentificacao(informacaoBd, informacaoReflora) {
    let dataIdentificacao = '';
    const dataIdentificacaoDiaBd = informacaoBd.data_identificacao_dia;
    const dataIdentificacaoMesBd = informacaoBd.data_identificacao_mes;
    const dataIdentificacaoAnoBd = informacaoBd.data_identificacao_ano;
    const dataIdentificacaoReflora = informacaoReflora.dateidentified;
    /*
        Nessa função não é necessário fazer if individuais, ou seja, verificar um if se é nulo, indefinido ou número
        Porque se for nulo ou indefinido ou se não for número, não iremos adicionar na nossa String com a data de identificação
        Além disso, se colocar uma para cada aumentaria o tamanho do LOG
    */
    /*
    console.log(`a${dataIdentificacaoDiaBd}`);
    console.log(`b${dataIdentificacaoMesBd}`);
    console.log(`c${dataIdentificacaoAnoBd}`);
    console.log(`d${dataIdentificacaoReflora}`);
    console.log(dataIdentificacaoReflora === undefined);
    */
    if (valorEhNulo(dataIdentificacaoReflora) || valorEhIndefinido(dataIdentificacaoReflora)) {
        return -1;
    }
    if (!valorEhNulo(dataIdentificacaoDiaBd) || !valorEhIndefinido(dataIdentificacaoDiaBd) || ehNumero(parseInt(dataIdentificacaoDiaBd))) {
        dataIdentificacao += `${dataIdentificacaoDiaBd}/`;
    }
    if (!valorEhNulo(dataIdentificacaoMesBd) || !valorEhIndefinido(dataIdentificacaoMesBd) || ehNumero(parseInt(dataIdentificacaoMesBd))) {
        dataIdentificacao += `${dataIdentificacaoMesBd}/`;
    }
    if (!valorEhNulo(dataIdentificacaoAnoBd) || !valorEhIndefinido(dataIdentificacaoAnoBd) || ehNumero(parseInt(dataIdentificacaoAnoBd))) {
        dataIdentificacao += `${dataIdentificacaoAnoBd}`;
    }
    if (dataIdentificacao === dataIdentificacaoReflora) {
        return -1;
    }
    // return '2014';
    // return '11/2014';
    return dataIdentificacaoReflora;
}

export function processaDataIdentificacaoReflora(dataIdentificacao) {
    let alteracaoInformacao = '';
    if ((dataIdentificacao.indexOf('/') === -1) && (dataIdentificacao.lastIndexOf('/') === -1)) {
        alteracaoInformacao += `data_identificacao_ano: ${dataIdentificacao}, `;
    } else if (dataIdentificacao.indexOf('/') === dataIdentificacao.lastIndexOf('/')) {
        alteracaoInformacao += `data_identificacao_mes: ${dataIdentificacao.substring(0, dataIdentificacao.indexOf('/'))}, `;
        alteracaoInformacao += `data_identificacao_ano: ${dataIdentificacao.substring(dataIdentificacao.indexOf('/') + 1, dataIdentificacao.length)}, `;
    } else if (dataIdentificacao.indexOf('/') !== dataIdentificacao.lastIndexOf('/')) {
        alteracaoInformacao += `data_identificacao_dia: ${dataIdentificacao.substring(0, dataIdentificacao.indexOf('/'))}, `;
        alteracaoInformacao += `data_identificacao_mes: ${dataIdentificacao.substring(dataIdentificacao.indexOf('/') + 1, dataIdentificacao.lastIndexOf('/'))}, `;
        alteracaoInformacao += `data_identificacao_ano: ${dataIdentificacao.substring(dataIdentificacao.lastIndexOf('/') + 1, dataIdentificacao.length)}, `;
    }
    return alteracaoInformacao;
}

export function ehIgualTipo(conexao, informacaoBd, informacaoReflora) {
    const promessa = Q.defer();
    const idTipo = informacaoBd.tipo_id;
    // const idTipo = 1;
    selectTipo(conexao, idTipo).then(resultadoTipoBd => {
        if (resultadoTipoBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeTipoBd = resultadoTipoBd[0].dataValues.nome;
        const nomeTipoReflora = informacaoReflora.typestatus;
        // const nomeTipoReflora = 'Isótipo';
        if (valorEhIndefinido(nomeTipoBd) || valorEhIndefinido(nomeTipoReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeTipoBd) || valorEhNulo(nomeTipoReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeTipoBd.length === 0) || (nomeTipoReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeTipoBd = processaString(nomeTipoBd);
        const processaNomeTipoReflora = processaString(nomeTipoReflora);
        if (processaNomeTipoBd === processaNomeTipoReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeTipoReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualNomeCientifico(nomeCientificoBd, nomeCientificoHerbarioVirtual) {
    // const nomeCientificoBd = informacaoBd.nome_cientifico;
    // const nomeCientificoReflora = informacaoReflora.scientificname;
    if (valorEhIndefinido(nomeCientificoBd) || valorEhIndefinido(nomeCientificoHerbarioVirtual)) {
        return '';
    }
    if (valorEhNulo(nomeCientificoBd) || valorEhNulo(nomeCientificoHerbarioVirtual)) {
        return '';
    }
    if ((nomeCientificoBd.length === 0) || (nomeCientificoHerbarioVirtual.length === 0)) {
        return '';
    }
    const processaNomeCientificoBd = processaString(nomeCientificoBd);
    const processaNomeCientificoReflora = processaString(nomeCientificoHerbarioVirtual);
    if (processaNomeCientificoBd === processaNomeCientificoReflora) {
        return '';
    }
    return nomeCientificoHerbarioVirtual;
}

/* (Aqui pra baixo ok) Esse processo de verificar o tamanho é necessário nas funções abaixo, pois estamos fazendo um outro select */
export function ehIgualFamilia(conexao, idNomeFamilia, nomeFamiliaReflora) {
    const promessa = Q.defer();
    // const idNomeFamilia = informacaoBd.familia_id;
    // const idNomeFamilia = informacaoBD.familia_id - 265;
    selectFamilia(conexao, idNomeFamilia).then(resultadoFamiliaBd => {
        if (resultadoFamiliaBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeFamiliaBd = resultadoFamiliaBd[0].dataValues.nome;
        // const nomeFamiliaReflora = informacaoReflora.family;
        if (valorEhIndefinido(nomeFamiliaBd) || valorEhIndefinido(nomeFamiliaReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeFamiliaBd) || valorEhNulo(nomeFamiliaReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeFamiliaBd.length === 0) || (nomeFamiliaReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeFamiliaBD = processaString(nomeFamiliaBd);
        const processaNomeFamiliaReflora = processaString(nomeFamiliaReflora);
        if (processaNomeFamiliaBD === processaNomeFamiliaReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeFamiliaReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualGenero(conexao, idNomeGenero, nomeGeneroReflora) {
    const promessa = Q.defer();
    // const idNomeGenero = informacaoBd.genero_id;
    // const idNomeGenero = informacaoBD.genero_id + 50;
    selectGenero(conexao, idNomeGenero).then(resultadoGeneroBd => {
        if (resultadoGeneroBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeGeneroBd = resultadoGeneroBd[0].dataValues.nome;
        // const nomeGeneroReflora = informacaoReflora.genus;
        if (valorEhIndefinido(nomeGeneroBd) || valorEhIndefinido(nomeGeneroReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeGeneroBd) || valorEhNulo(nomeGeneroReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeGeneroBd.length === 0) || (nomeGeneroReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeGeneroBd = processaString(nomeGeneroBd);
        const processaNomeGeneroReflora = processaString(nomeGeneroReflora);
        if (processaNomeGeneroBd === processaNomeGeneroReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeGeneroReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualEspecie(conexao, idNomeEspecie, nomeEspecieReflora) {
    const promessa = Q.defer();
    // const idNomeEspecie = informacaoBd.especie_id;
    // const idNomeEspecie = 1;
    selectEspecie(conexao, idNomeEspecie).then(resultadoEspecieBd => {
        if (resultadoEspecieBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeEspecieBd = resultadoEspecieBd[0].dataValues.nome;
        // const nomeEspecieReflora = informacaoReflora.infraespecificepithet;
        if (valorEhIndefinido(nomeEspecieBd) || valorEhIndefinido(nomeEspecieReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeEspecieBd) || valorEhNulo(nomeEspecieReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeEspecieBd.length === 0) || (nomeEspecieReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeEspecieBd = processaString(nomeEspecieBd);
        const processaNomeEspecieReflora = processaString(nomeEspecieReflora);
        if (processaNomeEspecieBd === processaNomeEspecieReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeEspecieReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualVariedade(conexao, informacaoBd, informacaoReflora) {
    const promessa = Q.defer();
    const idVariedade = informacaoBd.variedade_id;
    // const idVariedade = 1;
    selectVariedade(conexao, idVariedade).then(resultadoVariedadeBd => {
        if (resultadoVariedadeBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeVariedadeBd = resultadoVariedadeBd[0].dataValues.nome;
        const nomeVariedadeReflora = informacaoReflora.infraespecificepithet;
        if (valorEhIndefinido(nomeVariedadeBd) || valorEhIndefinido(nomeVariedadeReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeVariedadeBd) || valorEhNulo(nomeVariedadeReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeVariedadeBd.length === 0) || (nomeVariedadeReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeVariedadeBd = processaString(nomeVariedadeBd);
        const processaNomeVariedadeReflora = processaString(nomeVariedadeReflora);
        if (processaNomeVariedadeBd === processaNomeVariedadeReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeVariedadeReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

export function getIdAutor(conexao, informacaoBd) {
    const promessa = Q.defer();
    const idLocalColeta = informacaoBd.especie_id;
    selectEspecie(conexao, idLocalColeta).then(resultadoIdAutorBd => {
        if (resultadoIdAutorBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const idAutor = parseInt(resultadoIdAutorBd[0].dataValues.autor_id);
        if (valorEhNulo(idAutor) || !ehNumero(idAutor)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(idAutor);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualAutorNomeCientifico(conexao, idAutorNomeCientifico, informacaoReflora) {
    const promessa = Q.defer();
    selectAutor(conexao, idAutorNomeCientifico).then(resultadoAutorNomeCientificoBd => {
        if (resultadoAutorNomeCientificoBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const autorNomeCientificoBd = resultadoAutorNomeCientificoBd[0].dataValues.nome;
        const autorNomeCientificoReflora = informacaoReflora.scientificnameauthorship;
        if (valorEhIndefinido(autorNomeCientificoBd) || valorEhIndefinido(autorNomeCientificoReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(autorNomeCientificoBd) || valorEhNulo(autorNomeCientificoReflora)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((autorNomeCientificoBd.length === 0) || (autorNomeCientificoReflora.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaAutorNomeCientificoBd = processaString(autorNomeCientificoBd);
        const processaAutorNomeCientificoReflora = processaString(autorNomeCientificoReflora);
        if (processaAutorNomeCientificoBd === processaAutorNomeCientificoReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(autorNomeCientificoReflora);
        return promessa.promise;
    });
    return promessa.promise;
}

function ehIgualJson(jsonBd, jsonGerado) {
    if (jsonBd === jsonGerado) {
        return true;
    }
    return false;
}

export function existeAlteracaoSugerida(conexao, nroTombo, jsonGerado) {
    const promessa = Q.defer();
    selectInformacaoTomboJson(conexao, nroTombo).then(listaTomboJson => {
        if (listaTomboJson.length === 0) {
            promessa.resolve(false);
            return promessa.promise;
        }
        if (valorEhNulo(listaTomboJson) || valorEhIndefinido(listaTomboJson)) {
            promessa.resolve(true);
            return promessa.promise;
        }
        for (let i = 0; i < listaTomboJson.length; i += 1) {
            const tomboJson = listaTomboJson[i].dataValues.tombo_json;
            if (ehIgualJson(jsonGerado, tomboJson)) {
                promessa.resolve(true);
                return promessa.promise;
            }
        }
        promessa.resolve(false);
        return promessa.promise;
    });
    return promessa.promise;
}

// =======================================================
