/* eslint-disable max-len */
/**
 * A função geraCodBarra, a partir do valor passado por parâmetro
 * é formatado o código de barra para que ele se adeque ao padrão
 * esperado.
 * @param {*} codBarra, na qual que será transformado no formato esperado, com a quantidade de zeros correta.
 * @return string, com o código de barra no formato adequado, com a quantidade de zeros correta.
 */
export function geraCodBarra(codBarra) {
    const newCodBarra = 'HCF';
    if (codBarra < 10) {
        return `${newCodBarra}00000000${codBarra}`;
    }
    if (codBarra < 100) {
        return `${newCodBarra}0000000${codBarra}`;
    }
    if (codBarra < 1000) {
        return `${newCodBarra}000000${codBarra}`;
    }
    if (codBarra < 10000) {
        return `${newCodBarra}00000${codBarra}`;
    }
    if (codBarra < 100000) {
        return `${newCodBarra}0000${codBarra}`;
    }
    if (codBarra < 1000000) {
        return `${newCodBarra}000${codBarra}`;
    }
    if (codBarra < 10000000) {
        return `${newCodBarra}00${codBarra}`;
    }
    if (codBarra < 100000000) {
        return `${newCodBarra}0${codBarra}`;
    }
    if (codBarra < 1000000000) {
        return `${newCodBarra}${codBarra}`;
    }
    return -1;
}

/**
 * A função existeCodBarra, a partir de uma lista de código de barras e de um código
 * de barras passado por parâmetro é verificado se esse código de barra existe.
 * Se for encontrado é retornado true, caso contrário é retornado false.
 * @param {*} listaCodBarra, lista de códigos de barras na qual será procurado a existência do código de barras passado por parâmetro.
 * @param {*} codBarra, código de barra que será procurado na lista de código de barras.
 * @return true ou false, true quando encontrado na lista e false quando não encontrado na lista.
 */
export function existeCodBarra(listaCodBarra, codBarra) {
    for (let i = 0; i < listaCodBarra.length; i += 1) {
        if (listaCodBarra[i] === codBarra) {
            return true;
        }
    }
    return false;
}

/**
 * A função codBarraFaltante, ela ordena a lista de códigos de barras, e procura os códigos
 * de barras que não existem, e quando não existe é adicionado em uma lista e por fim, é
 * retornado essa lista.
 * @param {*} listaCodBarra, lista de códigos de barras na qual será procurado a existência do código de barras não existentes.
 * @return codBarraNaoFeito, é uma lista de códigos de barras que não existem.
 */
export function codBarraFaltante(listaCodBarra) {
    listaCodBarra.sort();
    const codBarraNaoFeito = [];
    for (let i = 1; i <= listaCodBarra.length - 1; i += 1) {
        if (listaCodBarra.find(codBarra => codBarra === geraCodBarra(i)) === undefined) {
            codBarraNaoFeito.push(geraCodBarra(i));
        }
    }
    return codBarraNaoFeito;
}
