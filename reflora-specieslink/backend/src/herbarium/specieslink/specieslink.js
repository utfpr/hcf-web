import Q from 'q';
//  import { escreveLOG } from '../log';
import { selectTombo } from '../database';
import { ehIgualNomeCientifico } from '../datatombos';

export function realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo) {
    // escreveLOG(nomeArquivo, 'Inicializando a aplicação do SpeciesLink.');
    const promessa = Q.defer();
    // for (let i =)
    if (listaConteudoArquivo.length === 0) {
        promessa.resolve();
    } else {
        const conteudo = listaConteudoArquivo.pop();
        const codBarra = conteudo[3];
        selectTombo(conexao, codBarra).then(tombo => {
            const informacoesTombo = tombo[0].dataValues;
            const nomeCientifico = conteudo[4];
            const resultadoNomeCientifico = ehIgualNomeCientifico(informacoesTombo.nome_cientifico, nomeCientifico);
            // eslint-disable-next-line no-console
            console.log(`R: ${resultadoNomeCientifico}`);
            promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
        });
    }
    return promessa.promise;
    /*
        const nomeFamilia = conteudo[10];
        const nomeGenero = conteudo[11];
        const nomeEspecie = conteudo[12];
        const nomeSubespecie = conteudo[13];
        const autorEspecie = conteudo[14]; // autor do nome cientifico
        const identificador = conteudo[15];
        const anoIdentificacao = conteudo[16];
        const mesIdentificacao = conteudo[17];
        const diaIdentificacao = conteudo[18];
        const nomeTipo = conteudo[19];
        const anoColeta = conteudo[23];
        const mesColeta = conteudo[24];
        const pais = conteudo[29];
        const estado = conteudo[30];
        const cidade = conteudo[31];
        const longitude = conteudo[39];
        const latitude = conteudo[40];
    */
}

export default { };
