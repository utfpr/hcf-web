import { escreveLOG } from '../log';

function geraCodBarra(codBarra) {
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

export function criaArrayCodBarra(nomeArquivo, maxCodBarra) {
    const arrayCodBarra = [];
    for (let i = 1; i <= maxCodBarra; i += 1) {
        const codBarra = geraCodBarra(i);
        if (codBarra === -1) {
            escreveLOG(nomeArquivo, `Erro na geração de código de barra {${codBarra}}`);
            process.exit(0);
        } else {
            arrayCodBarra.push(codBarra);
        }
    }
    escreveLOG(nomeArquivo, `Todos os códigos de barras {${maxCodBarra}} foram gerados com sucesso`);
    return arrayCodBarra;
}

export function existeCodBarra(listCodBarra, codBarra) {
    for (let i = 0; i < listCodBarra.length; i += 1) {
        if (listCodBarra[i] === codBarra) {
            return true;
        }
    }
    return false;
}
