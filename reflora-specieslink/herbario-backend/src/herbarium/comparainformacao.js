/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Q from 'q';
import {
    selectInformacaoTomboJson,
    selectFamilia,
    selectGenero,
    selectEspecie,
    selectVariedade,
    selectSubespecie,
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

function processaString(valor) {
    return valor.replace(/\s/g, '').toLowerCase();
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

export function ehIgualSubespecie(conexao, idNomeSubespecie, nomeSubespecieHerbarioVirtual) {
    const promessa = Q.defer();
    // const idNomeEspecie = informacaoBd.especie_id;
    // const idNomeEspecie = 1;
    selectSubespecie(conexao, idNomeSubespecie).then(resultadoEspecieBd => {
        if (resultadoEspecieBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeSubespecieBd = resultadoEspecieBd[0].dataValues.nome;
        // const nomeEspecieReflora = informacaoReflora.infraespecificepithet;
        if (valorEhIndefinido(nomeSubespecieBd) || valorEhIndefinido(nomeSubespecieHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeSubespecieBd) || valorEhNulo(nomeSubespecieHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeSubespecieBd.length === 0) || (nomeSubespecieHerbarioVirtual.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeSubespecieBd = processaString(nomeSubespecieBd);
        const processaNomeSubespecieHerbarioVirtual = processaString(nomeSubespecieHerbarioVirtual);
        if (processaNomeSubespecieBd === processaNomeSubespecieHerbarioVirtual) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeSubespecieHerbarioVirtual);
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
