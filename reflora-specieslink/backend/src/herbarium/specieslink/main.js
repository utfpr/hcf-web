import { getArquivoSpeciesLink, getColunasArquivoSpeciesLink } from './arquivo';

function main() {
    const arquivoSpeciesLink = 'speciesLink_all_31546_20190313103805.txt';
    const conteudoArquivo = getArquivoSpeciesLink(arquivoSpeciesLink);
    /**
     * Remove o primeiro elemento da fila porque é aquele cabeçalho
     * com o que significa aquela coluna
     */
    conteudoArquivo.shift();
    conteudoArquivo.forEach(linha => {
        // eslint-disable-next-line no-console
        console.log(getColunasArquivoSpeciesLink(linha));
    });
    // eslint-disable-next-line no-console
    console.log(conteudoArquivo[0]);
}

main();
