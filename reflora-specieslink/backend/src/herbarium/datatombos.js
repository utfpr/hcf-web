/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Q from 'q';
import {
    selectPais,
    selectEstado,
    selectCidade,
    selectLocalColeta,
    selectVegetacao,
    selectIdIdentificador,
    selectIdentificador,
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

export function ehIgualNroColeta(nomeArquivo, informacaoBD, informacaoReflora) {
    const nroColetaBD = informacaoBD.numero_coleta;
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
    if (valorEhIndefinido(anoColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${anoColetaBD}} o ano de coleta é indefinido`);
        return -1;
    }
    if (valorEhIndefinido(anoColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${anoColetaReflora}} o ano de coleta é indefinido`);
        return -1;
    }
    if (valorEhNulo(anoColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${anoColetaBD}} o ano de coleta é nula`);
        return -1;
    }
    if (valorEhNulo(anoColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${anoColetaReflora}} o ano de coleta é nula`);
        return -1;
    }
    const intAnoColetaBD = parseInt(anoColetaBD);
    const intAnoColetaReflora = parseInt(anoColetaReflora);
    if (!ehNumero(intAnoColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${intAnoColetaBD}} o ano de coleta não é número`);
        return -1;
    }
    if (!ehNumero(intAnoColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${intAnoColetaReflora}} o ano de coleta não é número`);
        return -1;
    }
    if (intAnoColetaBD === intAnoColetaReflora) {
        escreveLOG(nomeArquivo, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} anos de coleta são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${intAnoColetaBD}, Reflora: ${intAnoColetaReflora}} anos de coleta são diferentes`);
    return intAnoColetaReflora;
}

export function ehIgualMesColeta(nomeArquivo, informacaoBD, informacaoReflora) {
    const mesColetaBD = informacaoBD.data_coleta_mes;
    const mesColetaReflora = informacaoReflora.month;
    if (valorEhIndefinido(mesColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${mesColetaBD}} o mês de coleta é indefinido`);
        return -1;
    }
    if (valorEhIndefinido(mesColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${mesColetaReflora}} o mês de coleta é indefinido`);
        return -1;
    }
    if (valorEhNulo(mesColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${mesColetaBD}} o mês de coleta é nula`);
        return -1;
    }
    if (valorEhNulo(mesColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${mesColetaReflora}} o mês de coleta é nula`);
        return -1;
    }
    const intMesColetaBD = parseInt(mesColetaBD);
    const intMesColetaReflora = parseInt(mesColetaReflora);
    if (!ehNumero(intMesColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${intMesColetaBD}} o mês de coleta não é número`);
        return -1;
    }
    if (!ehNumero(intMesColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${intMesColetaReflora}} o mês de coleta não é número`);
        return -1;
    }
    if (intMesColetaBD === intMesColetaReflora) {
        escreveLOG(nomeArquivo, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} meses de coleta são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${intMesColetaBD}, Reflora: ${intMesColetaReflora}} meses de coleta são diferentes`);
    return intMesColetaReflora;
}

export function ehIgualDiaColeta(nomeArquivo, informacaoBD, informacaoReflora) {
    const diaColetaBD = informacaoBD.data_coleta_dia;
    const diaColetaReflora = informacaoReflora.day;
    if (valorEhIndefinido(diaColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${diaColetaBD}} o dia de coleta é indefinido`);
        return -1;
    }
    if (valorEhIndefinido(diaColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${diaColetaReflora}} o dia de coleta é indefinido`);
        return -1;
    }
    if (valorEhNulo(diaColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${diaColetaBD}} o dia de coleta é nula`);
        return -1;
    }
    if (valorEhNulo(diaColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${diaColetaReflora}} o mês de coleta é nula`);
        return -1;
    }
    const intDiaColetaBD = parseInt(diaColetaBD);
    const intDiaColetaReflora = parseInt(diaColetaReflora);
    if (!ehNumero(intDiaColetaBD)) {
        escreveLOG(nomeArquivo, `{BD: ${intDiaColetaBD}} o dia de coleta não é número`);
        return -1;
    }
    if (!ehNumero(intDiaColetaReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${intDiaColetaReflora}} o dia de coleta não é número`);
        return -1;
    }
    if (intDiaColetaBD === intDiaColetaReflora) {
        escreveLOG(nomeArquivo, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} dias de coleta são iguais`);
        return -1;
    }
    escreveLOG(nomeArquivo, `{BD: ${intDiaColetaBD}, Reflora: ${intDiaColetaReflora}} dias de coleta são diferentes`);
    return intDiaColetaReflora;
}

export function ehIgualObservacao(nomeArquivo, informacaoBD, informacaoReflora) {
    const observacaoTomboBD = informacaoBD.observacao;
    const observacaoTomboReflora = informacaoReflora.fieldnotes;
    if (valorEhIndefinido(observacaoTomboBD)) {
        escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}} as observações são indefinidas`);
        return '';
    }
    if (valorEhIndefinido(observacaoTomboReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${observacaoTomboReflora}} as observações são indefinidas`);
        return '';
    }
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
    const processaObservacaoBD = observacaoTomboBD.replace(/\s/g, '').toLowerCase();
    const processaObservacaoReflora = observacaoTomboReflora.replace(/\s/g, '').toLowerCase();
    if (processaObservacaoBD.includes(processaObservacaoReflora)) {
        escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}, Reflora: ${observacaoTomboReflora}} as observações são iguais`);
        return '';
    }
    escreveLOG(nomeArquivo, `{BD: ${observacaoTomboBD}, Reflora: ${observacaoTomboReflora}} as observações são diferentes`);
    return observacaoTomboReflora;
}

export function getIdCidade(nomeArquivo, conexao, informacaoBD) {
    const promessa = Q.defer();
    const idLocalColeta = informacaoBD.local_coleta_id;
    selectLocalColeta(conexao, idLocalColeta, resultadoLocalColetaTombo => {
        if (resultadoLocalColetaTombo.length === 0) {
            escreveLOG(nomeArquivo, 'Não foram retornados informações de local de coleta');
            promessa.resolve(-1);
            return promessa.promise;
        }
        const idCidade = parseInt(resultadoLocalColetaTombo[0].dataValues.cidade_id);
        if (valorEhNulo(idCidade)) {
            escreveLOG(nomeArquivo, `{BD: ${idCidade}} o ID da cidade é nulo`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (!ehNumero(idCidade)) {
            escreveLOG(nomeArquivo, `{BD: ${idCidade}} o ID da cidade não é número`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        escreveLOG(nomeArquivo, `{BD: ${idCidade}} o ID da cidade é número`);
        promessa.resolve(idCidade);
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
            if (valorEhIndefinido(nomePaisBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisBD}} o país é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(nomePaisReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisReflora}} o país é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomePaisBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisBD}} o país é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomePaisReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisReflora}} o país é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomePaisBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisBD}} as informações de país é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomePaisReflora.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisReflora}} as informações de país é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaNomePaisBD = nomePaisBD.replace(/\s/g, '').toLowerCase();
            const processaNomePaisReflora = nomePaisReflora.replace(/\s/g, '').toLowerCase();
            if (processaNomePaisBD === processaNomePaisReflora) {
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
            if (valorEhIndefinido(nomePaisSiglaBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisSiglaBD}} a sigla do país é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(nomePaisSiglaReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisSiglaReflora}} a sigla do país é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomePaisSiglaBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisSiglaBD}} a sigla do país é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomePaisSiglaReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisSiglaReflora}} a sigla do país é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomePaisSiglaBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisSiglaBD}} as informações de sigla do país é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomePaisSiglaReflora.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomePaisSiglaReflora}} as informações de sigla do país é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaNomePaisSiglaBD = processaString(nomePaisSiglaBD);
            const processaNomePaisSiglaReflora = processaString(nomePaisSiglaReflora);
            if (processaNomePaisSiglaBD === processaNomePaisSiglaReflora) {
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
            if (valorEhIndefinido(nomeEstadoBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEstadoBD}} o estado é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhIndefinido(nomeEstadoReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEstadoReflora}} o estado é indefinido`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeEstadoBD)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEstadoBD}} o estado é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (valorEhNulo(nomeEstadoReflora)) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEstadoReflora}} o estado é nulo`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeEstadoBD.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEstadoBD}} as informações de estado é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            if (nomeEstadoReflora.length === 0) {
                escreveLOG(nomeArquivo, `{BD: ${nomeEstadoReflora}} as informações de estado é vazia`);
                promessa.resolve(-1);
                return promessa.promise;
            }
            const processaNomeEstadoBD = processaString(nomeEstadoBD);
            const processaNomeEstadoReflora = processaString(nomeEstadoReflora);
            if (processaNomeEstadoBD === processaNomeEstadoReflora) {
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
    selectLocalColeta(conexao, idLocalColeta, resultadoLocalColetaTombo => {
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

export function getIdIdentificador(nomeArquivo, conexao, nroTombo) {
    const promessa = Q.defer();
    selectIdIdentificador(conexao, nroTombo, idUsuarioBD => {
        if (idUsuarioBD.length === 0) {
            escreveLOG(nomeArquivo, `{BD: ${idUsuarioBD}} o resultado da consulta é zero`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhIndefinido(idUsuarioBD)) {
            escreveLOG(nomeArquivo, `{BD: ${idUsuarioBD}} o resultado da consulta é indefinido`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(idUsuarioBD)) {
            escreveLOG(nomeArquivo, `{BD: ${idUsuarioBD}} o resultado da consulta ao BD é nulo`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(idUsuarioBD);
        return promessa.promise;
    });
    return promessa.promise;
}

export function checkIdIdentificador(nomeArquivo, idUsuario) {
    if (valorEhIndefinido(idUsuario)) {
        escreveLOG(nomeArquivo, `{BD: ${idUsuario}} o id do usuário é indefinido`);
        return -1;
    }
    if (valorEhNulo(idUsuario)) {
        escreveLOG(nomeArquivo, `{BD: ${idUsuario}} o id do usuário é nulo`);
        return -1;
    }
    const intIdUsuario = parseInt(idUsuario);
    if (!ehNumero(intIdUsuario)) {
        escreveLOG(nomeArquivo, `{BD: ${intIdUsuario}} o id do usuário não é número`);
        return -1;
    }
    return intIdUsuario;
}

export function getNomeIdentificador(nomeArquivo, conexao, idUsuario) {
    const promessa = Q.defer();
    selectIdentificador(conexao, idUsuario, nomeUsuario => {
        if (nomeUsuario.length === 0) {
            escreveLOG(nomeArquivo, `{BD: ${nomeUsuario}} o resultado da consulta é zero`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeUsuarioBD = nomeUsuario[0].dataValues.nome;
        if (valorEhIndefinido(nomeUsuarioBD)) {
            escreveLOG(nomeArquivo, `{BD: ${nomeUsuarioBD}} o nome do usuário é indefinido`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeUsuarioBD)) {
            escreveLOG(nomeArquivo, `{BD: ${nomeUsuarioBD}} o nome do usuário é nulo`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (nomeUsuarioBD.length === 0) {
            escreveLOG(nomeArquivo, `{BD: ${nomeUsuarioBD}} o nome do usuário é vazio`);
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeUsuarioBD);
        return promessa.promise;
    });
    return promessa.promise;
}

export function ehIgualIdentificador(nomeArquivo, conexao, nomeIdentificadorBD, informacaoReflora) {
    const nomeIdentificadorReflora = informacaoReflora.identifiedby;
    if (valorEhIndefinido(nomeIdentificadorReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${nomeIdentificadorReflora}} o nome do usuário é indefinido`);
        return '';
    }
    if (valorEhNulo(nomeIdentificadorReflora)) {
        escreveLOG(nomeArquivo, `{Reflora: ${nomeIdentificadorReflora}} o nome do usuário é nulo`);
        return '';
    }
    if (nomeIdentificadorReflora.length === 0) {
        escreveLOG(nomeArquivo, `{Reflora: ${nomeIdentificadorReflora}} o nome do usuário é vazio`);
        return '';
    }
    const processaNomeIdentificadorBD = processaString(nomeIdentificadorBD);
    const processaNomeIdentificadorReflora = processaString(nomeIdentificadorReflora);
    if (processaNomeIdentificadorBD === processaNomeIdentificadorReflora) {
        escreveLOG(nomeArquivo, `{BD: ${processaNomeIdentificadorBD}, Reflora: ${nomeIdentificadorReflora}} o nome do usuário são iguais`);
        // Aqui comparar as alterações da tabela alteracoes
        return '';
    }
    escreveLOG(nomeArquivo, `{BD: ${processaNomeIdentificadorBD}, Reflora: ${nomeIdentificadorReflora}} o nome do usuário são diferentes`);
    return processaNomeIdentificadorReflora;
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
