import fs from 'fs';

export function getArquivoSpeciesLink(nomeArquivo) {
    const conteudo = fs.readFileSync(nomeArquivo, 'utf8');
    return conteudo.toString().split('\n');
}

export function getColunasArquivoSpeciesLink(linhaArquivo) {
    return linhaArquivo.split('\t');
}

export function processaArquivo(nomeArquivo) {
    // a
}

export default { };
