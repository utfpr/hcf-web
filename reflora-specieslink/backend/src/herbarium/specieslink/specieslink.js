import { escreveLOG } from '../log';

export function realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo) {
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do SpeciesLink.');
    listaConteudoArquivo.forEach((conteudo, i) => {
        /*
        const codHCF = conteudo[3];
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
        */
        if (i === listaConteudoArquivo.length - 1) {
            // console.log('entrou');
            escreveLOG(nomeArquivo, 'O processo de comparação do Reflora acabou.');
        }
    });
}

export default { };
