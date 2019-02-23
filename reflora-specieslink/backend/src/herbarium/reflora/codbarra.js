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

export function criaListaCodBarra(maiorCodBarra) {
    const listaCodBarra = [];
    for (let i = 1; i <= maiorCodBarra; i += 1) {
        const codBarra = geraCodBarra(i);
        if (codBarra === -1) {
            process.exit(0);
        } else {
            listaCodBarra.push(codBarra);
        }
    }
    return listaCodBarra;
}

export function existeCodBarra(listCodBarra, codBarra) {
    for (let i = 0; i < listCodBarra.length; i += 1) {
        if (listCodBarra[i] === codBarra) {
            return true;
        }
    }
    return false;
}

export function codBarraFaltante(listCodBarra) {
    listCodBarra.sort();
    const codBarraNaoFeito = [];
    for (let i = 1; i <= listCodBarra.length - 1; i += 1) {
        if (listCodBarra.find(codBarra => codBarra === geraCodBarra(i)) === undefined) {
            codBarraNaoFeito.push(geraCodBarra(i));
        }
    }
    return codBarraNaoFeito;
}
