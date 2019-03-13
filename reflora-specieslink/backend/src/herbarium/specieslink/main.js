import fs from 'fs';

function main() {
    // console.log('papapa');
    const arquivoSpeciesLink = 'speciesLink_all_31546_20190313103805.txt';
    const conteudo = fs.readFileSync(arquivoSpeciesLink, 'utf8');
    // eslint-disable-next-line no-console
    console.log(conteudo);
    // eslint-disable-next-line no-console
    console.log(conteudo.toString().split('\n').length - 1);
    const linha = conteudo.toString().split('\n');
    console.log(linha.length)
    console.log(linha[0])

}

main();
