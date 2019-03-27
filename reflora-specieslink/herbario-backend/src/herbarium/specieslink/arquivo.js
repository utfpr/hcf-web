import fs from 'fs';

export function getArquivoSpeciesLink(nomeArquivo) {
    const conteudo = fs.readFileSync(nomeArquivo, 'utf8');
    return conteudo.toString().split('\n');
}

export function getColunasArquivoSpeciesLink(linhaArquivo) {
    return linhaArquivo.split('\t');
}

export function processaArquivo(nomeArquivo) {
    const conteudoArquivo = getArquivoSpeciesLink(`./public/uploads/${nomeArquivo}`);
    console.log(conteudoArquivo);
    const listaConteudoArquivo = [];
    /**
     * Remove o primeiro elemento da fila porque é aquele cabeçalho
     * com o que significa aquela coluna. E o último elemento,
     * porque ele é vazio.
     */
    conteudoArquivo.shift();
    conteudoArquivo.pop();
    conteudoArquivo.forEach(linha => {
        listaConteudoArquivo.push(getColunasArquivoSpeciesLink(linha));
        // eslint-disable-next-line no-console
        // console.log(getColunasArquivoSpeciesLink(linha));
    });
    // eslint-disable-next-line no-console
    // console.log(listaConteudoArquivo[0]);
    return listaConteudoArquivo;
}

export default { };
