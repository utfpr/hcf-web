import Q from 'q';
//  import { escreveLOG } from '../log';
import { selectTombo } from '../database';

export function realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo) {
    // escreveLOG(nomeArquivo, 'Inicializando a aplicação do SpeciesLink.');
    const promessa = Q.defer();
    // for (let i =)
    if (listaConteudoArquivo.length === 0) {
        // b
        // sys
        promessa.resolve();
    } else {
        const conteudo = listaConteudoArquivo.pop();
        // eslint-disable-next-line no-console
        console.log(`codBarra${conteudo[3]}`);
        selectTombo(conexao, conteudo[3]).then(tombo => {
            console.log(tombo);
            promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
        });
    }
    return promessa.promise;
    /*
    listaConteudoArquivo.forEach(async (conteudo, i) => {
        const codHCF = conteudo[3];
        /*
        const nomeCientifico = conteudo[4];
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
        selectTombo(conexao, codHCF).then(tombo => {
            // eslint-disable-next-line no-console
            console.log(`tombo${tombo}`);
        });
        if (i === listaConteudoArquivo.length - 1) {
            // console.log('entrou');
            escreveLOG(nomeArquivo, 'O processo de comparação do Reflora acabou.');
        }
    });
    */
}

export default { };
