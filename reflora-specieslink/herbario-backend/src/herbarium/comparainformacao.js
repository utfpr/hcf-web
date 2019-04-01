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

/**
 * A função valorEhIndefinido, verifica se o valor que foi passado
 * por parâmetro é um valor indefinido ou não. Caso seja indefinido é retornado
 * true, se não seja indefindo é false.
 * @param {*} valor, é o valor que será verificado se ele é indefinido ou não.
 * @return true ou false, true caso o valor é indefinido, false caso o valor não é indefinido.
 */
function valorEhIndefinido(valor) {
    if (valor === undefined) {
        return true;
    }
    return false;
}

/**
 * A função valorEhNulo, verifica se o valor que foi passado por parâmetro
 * é um valor nulo ou não. Caso seja nulo é retornado true, se não é nulo é false.
 * @param {*} valor, é o valor que será verificado se ele é nulo ou não.
 * @return true ou false, true caso o valor é nulo, false caso o valor não é nulo.
 */
function valorEhNulo(valor) {
    /* Afim de evitar problemas na conversão do parseInt */
    if (valor === null) {
        return true;
    }
    return false;
}

/**
 * A função processaString, pega o valor que foi recebido por parâmetro
 * e processa ela, o processamento é basicamente remover apenas os espaços
 * vazios, e transforma todos os caracteres em caracteres minuscúlos.
 * @param {*} valor, é o valor em que será feito o processo de remover
 * espaços e todos os caracteres serão minuscúlos.
 * @return string, que é a string processada, ou seja, a string sem espaços e com caracteres minuscúlos.
 */
function processaString(valor) {
    return valor.replace(/\s/g, '').toLowerCase();
}

/**
 * A função ehIgualFamilia, faz um select no banco de dados para obter informações
 * da família, e com essa informação da família é comparada com a informação da
 * que veio na resposta da requisição do Herbário Virtual. Porém, antes chegar
 * no processo de comparação é verificado se existe a família no banco de dados,
 * se não existir não é comparado nada. Se existir resultado, é verificado
 * se o valor tanto retornado pelo Herbário Virtual, quanto o presente
 * no banco de dados são indefinido ou não, se for indefinido não é comparado.
 * Também não irá ser comparado se o valor do banco de dados, ou retornado
 * pelo Herbário Virtual, se os valores forem nulos. Por fim,
 * se passarem por todas essas condições, iremos processar os dois valores
 * (ou seja, remover espaços vazios e caracteres minuscúlos), e depois
 * de processar iremos comparar. Se for diferente esses valores iremos
 * retornar para que o mesmo possa ser adicionado no JSON, e caso contrário
 * não será adicionado.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @param {*} idFamilia, é o identificador da família presente na tabela de tombos, na qual é
 * necessário para se obter o nome da família.
 * @param {*} nomeFamiliaHerbarioVirtual, é o nome da família que está presente no Herbário Virtual.
 * @return string, que pode ser -1 ou o nome da família que está presente no Herbário Virtual.
 */
export function ehIgualFamilia(conexao, idFamilia, nomeFamiliaHerbarioVirtual) {
    const promessa = Q.defer();
    selectFamilia(conexao, idFamilia).then(resultadoFamiliaBd => {
        if (resultadoFamiliaBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeFamiliaBd = resultadoFamiliaBd[0].dataValues.nome;
        // const nomeFamiliaReflora = informacaoReflora.family;
        if (valorEhIndefinido(nomeFamiliaBd) || valorEhIndefinido(nomeFamiliaHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeFamiliaBd) || valorEhNulo(nomeFamiliaHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeFamiliaBd.length === 0) || (nomeFamiliaHerbarioVirtual.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeFamiliaBD = processaString(nomeFamiliaBd);
        const processaNomeFamiliaReflora = processaString(nomeFamiliaHerbarioVirtual);
        if (processaNomeFamiliaBD === processaNomeFamiliaReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeFamiliaHerbarioVirtual);
        return promessa.promise;
    });
    return promessa.promise;
}

/**
 * A função ehIgualGenero, faz um select no banco de dados para obter informações
 * da gênero, e com essa informação da gênero é comparada com a informação da
 * que veio na resposta da requisição do Herbário Virtual. Porém, antes chegar
 * no processo de comparação é verificado se existe a gênero no banco de dados,
 * se não existir não é comparado nada. Se existir resultado, é verificado
 * se o valor tanto retornado pelo Herbário Virtual, quanto o presente
 * no banco de dados são indefinido ou não, se for indefinido não é comparado.
 * Também não irá ser comparado se o valor do banco de dados, ou retornado
 * pelo Herbário Virtual, se os valores forem nulos. Por fim,
 * se passarem por todas essas condições, iremos processar os dois valores
 * (ou seja, remover espaços vazios e caracteres minuscúlos), e depois
 * de processar iremos comparar. Se for diferente esses valores iremos
 * retornar para que o mesmo possa ser adicionado no JSON, e caso contrário
 * não será adicionado.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @param {*} idGenero, é o identificador de gênero presente na tabela de tombos, na qual é
 * necessário para se obter o nome do gênero.
 * @param {*} nomeGeneroHerbarioVirtual, é o nome do gênero que está presente no Herbário Virtual.
 * @return string, que pode ser -1 ou o nome do gênero que está presente no Herbário Virtual.
 */
export function ehIgualGenero(conexao, idGenero, nomeGeneroHerbarioVirtual) {
    const promessa = Q.defer();
    selectGenero(conexao, idGenero).then(resultadoGeneroBd => {
        if (resultadoGeneroBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeGeneroBd = resultadoGeneroBd[0].dataValues.nome;
        if (valorEhIndefinido(nomeGeneroBd) || valorEhIndefinido(nomeGeneroHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeGeneroBd) || valorEhNulo(nomeGeneroHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeGeneroBd.length === 0) || (nomeGeneroHerbarioVirtual.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeGeneroBd = processaString(nomeGeneroBd);
        const processaNomeGeneroReflora = processaString(nomeGeneroHerbarioVirtual);
        if (processaNomeGeneroBd === processaNomeGeneroReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeGeneroHerbarioVirtual);
        return promessa.promise;
    });
    return promessa.promise;
}

/**
 * A função ehIgualEspecie, faz um select no banco de dados para obter informações
 * da espécie, e com essa informação da espécie é comparada com a informação da
 * que veio na resposta da requisição do Herbário Virtual. Porém, antes chegar
 * no processo de comparação é verificado se existe a espécie no banco de dados,
 * se não existir não é comparado nada. Se existir resultado, é verificado
 * se o valor tanto retornado pelo Herbário Virtual, quanto o presente
 * no banco de dados são indefinido ou não, se for indefinido não é comparado.
 * Também não irá ser comparado se o valor do banco de dados, ou retornado
 * pelo Herbário Virtual, se os valores forem nulos. Por fim,
 * se passarem por todas essas condições, iremos processar os dois valores
 * (ou seja, remover espaços vazios e caracteres minuscúlos), e depois
 * de processar iremos comparar. Se for diferente esses valores iremos
 * retornar para que o mesmo possa ser adicionado no JSON, e caso contrário
 * não será adicionado.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @param {*} idEspecie, é o identificador de espécie presente na tabela de tombos, na qual é
 * necessário para se obter o nome do espécie.
 * @param {*} nomeEspecieHerbarioVirtual, é o nome do espécie que está presente no Herbário Virtual.
 * @return string, que pode ser -1 ou o nome do espécie que está presente no Herbário Virtual.
 */
export function ehIgualEspecie(conexao, idEspecie, nomeEspecieHerbarioVirtual) {
    const promessa = Q.defer();
    selectEspecie(conexao, idEspecie).then(resultadoEspecieBd => {
        if (resultadoEspecieBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeEspecieBd = resultadoEspecieBd[0].dataValues.nome;
        if (valorEhIndefinido(nomeEspecieBd) || valorEhIndefinido(nomeEspecieHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeEspecieBd) || valorEhNulo(nomeEspecieHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeEspecieBd.length === 0) || (nomeEspecieHerbarioVirtual.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeEspecieBd = processaString(nomeEspecieBd);
        const processaNomeEspecieReflora = processaString(nomeEspecieHerbarioVirtual);
        if (processaNomeEspecieBd === processaNomeEspecieReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeEspecieHerbarioVirtual);
        return promessa.promise;
    });
    return promessa.promise;
}

/**
 * A função ehIgualSubespecie, faz um select no banco de dados para obter informações
 * da subespécie, e com essa informação da subespécie é comparada com a informação da
 * que veio na resposta da requisição do Herbário Virtual. Porém, antes chegar
 * no processo de comparação é verificado se existe a subespécie no banco de dados,
 * se não existir não é comparado nada. Se existir resultado, é verificado
 * se o valor tanto retornado pelo Herbário Virtual, quanto o presente
 * no banco de dados são indefinido ou não, se for indefinido não é comparado.
 * Também não irá ser comparado se o valor do banco de dados, ou retornado
 * pelo Herbário Virtual, se os valores forem nulos. Por fim,
 * se passarem por todas essas condições, iremos processar os dois valores
 * (ou seja, remover espaços vazios e caracteres minuscúlos), e depois
 * de processar iremos comparar. Se for diferente esses valores iremos
 * retornar para que o mesmo possa ser adicionado no JSON, e caso contrário
 * não será adicionado.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @param {*} idSubespecie, é o identificador de subespécie presente na tabela de tombos, na qual é
 * necessário para se obter o nome do subespécie.
 * @param {*} nomeSubespecieHerbarioVirtual, é o nome do subespécie que está presente no Herbário Virtual.
 * @return string, que pode ser -1 ou o nome do subespécie que está presente no Herbário Virtual.
 */
export function ehIgualSubespecie(conexao, idSubespecie, nomeSubespecieHerbarioVirtual) {
    const promessa = Q.defer();
    selectSubespecie(conexao, idSubespecie).then(resultadoEspecieBd => {
        if (resultadoEspecieBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeSubespecieBd = resultadoEspecieBd[0].dataValues.nome;
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

/**
 * A função ehIgualVariedade, faz um select no banco de dados para obter informações
 * da variedade, e com essa informação da variedade é comparada com a informação da
 * que veio na resposta da requisição do Herbário Virtual. Porém, antes chegar
 * no processo de comparação é verificado se existe a variedade no banco de dados,
 * se não existir não é comparado nada. Se existir resultado, é verificado
 * se o valor tanto retornado pelo Herbário Virtual, quanto o presente
 * no banco de dados são indefinido ou não, se for indefinido não é comparado.
 * Também não irá ser comparado se o valor do banco de dados, ou retornado
 * pelo Herbário Virtual, se os valores forem nulos. Por fim,
 * se passarem por todas essas condições, iremos processar os dois valores
 * (ou seja, remover espaços vazios e caracteres minuscúlos), e depois
 * de processar iremos comparar. Se for diferente esses valores iremos
 * retornar para que o mesmo possa ser adicionado no JSON, e caso contrário
 * não será adicionado.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @param {*} idVariedade, é o identificador de variedade presente na tabela de tombos, na qual é
 * necessário para se obter o nome do variedade.
 * @param {*} nomeVariedadeHerbarioVirtual, é o nome do variedade que está presente no Herbário Virtual.
 * @return string, que pode ser -1 ou o nome do variedade que está presente no Herbário Virtual.
 */
export function ehIgualVariedade(conexao, idVariedade, nomeVariedadeHerbarioVirtual) {
    const promessa = Q.defer();
    selectVariedade(conexao, idVariedade).then(resultadoVariedadeBd => {
        if (resultadoVariedadeBd.length === 0) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const nomeVariedadeBd = resultadoVariedadeBd[0].dataValues.nome;
        if (valorEhIndefinido(nomeVariedadeBd) || valorEhIndefinido(nomeVariedadeHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if (valorEhNulo(nomeVariedadeBd) || valorEhNulo(nomeVariedadeHerbarioVirtual)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        if ((nomeVariedadeBd.length === 0) || (nomeVariedadeHerbarioVirtual.length === 0)) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        const processaNomeVariedadeBd = processaString(nomeVariedadeBd);
        const processaNomeVariedadeReflora = processaString(nomeVariedadeHerbarioVirtual);
        if (processaNomeVariedadeBd === processaNomeVariedadeReflora) {
            promessa.resolve(-1);
            return promessa.promise;
        }
        promessa.resolve(nomeVariedadeHerbarioVirtual);
        return promessa.promise;
    });
    return promessa.promise;
}

/**
 * A função ehIgualJson, compara dois JSON o que está presente
 * no banco de dados, com o que foi gerado quando encontrado
 * informações divergentes. Se o JSON presente no banco de dados
 * é igual ao JSON gerado então é igual e é retornado true,
 * caso não seja igual é retornado false.
 * @param {*} jsonBd, JSON presente na tabela de alterações, guardando informações das alterações.
 * @param {*} jsonGerado, JSON gerado quando foi feito a comparação das informações presentes
 * no banco de dados, com os do Herbário Virtual.
 * @return true ou false, true quando os dois JSON são iguais, e false quando os dois JSON são diferentes.
 */
function ehIgualJson(jsonBd, jsonGerado) {
    if (jsonBd === jsonGerado) {
        return true;
    }
    return false;
}

/**
 * A função existeAlteracaoSugerida, faz um select na tabela de alterações daquele
 * na qual se buscou informações no Herbário Virtual. Com o resultado dessa consulta
 * eu verifico se o JSON presente no resultado dessa consulta é igual ou diferente ao JSON
 * que foi gerado a partir das comparações feitas. Se for igual a um dos JSON presentes no resultado
 * da consulta eu retorno true, representando que essa alteração já foi sugerida, caso contrário
 * retorno false.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @param {*} nroTombo, é o número do tombo utilizado para buscar informações de alterações
 * que possam existir.
 * @param {*} jsonGerado, JSON gerado quando foi feito a comparação das informações presentes
 * no banco de dados, com os do Herbário Virtual.
 * @return true ou false, true quando os dois JSON são iguais, e false quando os dois JSON são diferentes.
 */
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
