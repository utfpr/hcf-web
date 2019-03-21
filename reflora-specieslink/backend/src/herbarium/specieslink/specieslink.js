import { escreveLOG } from '../log';

export function realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo) {
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do SpeciesLink.');
    listaConteudoArquivo.forEach((conteudo, i) => {
        /*
        const codHCF = conteudo[3];
        const nomeCientifico = conteudo[4];
        const nomeFamilia = conteudo[10];
        const nomeEspecie = conteudo[11] + conteudo[12];
        const autorEspecie = conteudo[14]; // autor do nome cientifico
        const identificador = conteudo[15];
        const anoIdentificacao = conteudo[16];
        const mesIdentificacao = conteudo[17];
        const diaIdentificacao = conteudo[18];
        const nroColeta = conteudo[20];
        const anoColeta = conteudo[23];
        const mesColeta = conteudo[24];
        const diaColeta = conteudo[25];
        const pais = conteudo[29];
        const estado = conteudo[30];
        const cidade = conteudo[31];
        const longitude = conteudo[35];
        const latitude = conteudo[36];
        const altitude = conteudo[37];
        const observacaoColeta = conteudo[49];
        if ((i === 1) || (i === 21)) {
            // eslint-disable-next-line no-console
            console.log(`codHCF${codHCF}`);
            // eslint-disable-next-line no-console
            console.log(`nomeCientficio${nomeCientifico}`);
            // eslint-disable-next-line no-console
            console.log(`nomeFamilia${nomeFamilia}`);
            // eslint-disable-next-line no-console
            console.log(`nomeEspecie${nomeEspecie}`);
            // eslint-disable-next-line no-console
            console.log(`autorEspecie${autorEspecie}`);
            // eslint-disable-next-line no-console
            console.log(`identificador${identificador}`);
            // eslint-disable-next-line no-console
            console.log(`anoIdentificacao${anoIdentificacao}`);
            // eslint-disable-next-line no-console
            console.log(`mesIdentificacao${mesIdentificacao}`);
            // eslint-disable-next-line no-console
            console.log(`diaIdentificacao${diaIdentificacao}`);
            // eslint-disable-next-line no-console
            console.log(`nroColeta${nroColeta}`);
            // eslint-disable-next-line no-console
            console.log(`anoColeta${anoColeta}`);
            // eslint-disable-next-line no-console
            console.log(`mesColeta${mesColeta}`);
            // eslint-disable-next-line no-console
            console.log(`diaColeta${diaColeta}`);
            // eslint-disable-next-line no-console
            console.log(`pais${pais}`);
            // eslint-disable-next-line no-console
            console.log(`estado${estado}`);
            // eslint-disable-next-line no-console
            console.log(`cidade${cidade}`);
            // eslint-disable-next-line no-console
            console.log(`longitude${longitude}`);
            // eslint-disable-next-line no-console
            console.log(`latitude${latitude}`);
            // eslint-disable-next-line no-console
            console.log(`altitude${altitude}`);
            // eslint-disable-next-line no-console
            console.log(`observacaoColeta${observacaoColeta}`);
            // eslint-disable-next-line no-console
            console.log('=================================');
        }
        */
        if (conteudo[48].length > 0) {
            console.log('entrou');
            console.log(`id${conteudo[3]}`);
            console.log(`conteudo[48]${conteudo[48]}`);
        }
        if (i === listaConteudoArquivo.length - 1) {
            // console.log('entrou');
            escreveLOG(nomeArquivo, 'O processo de comparação do Reflora acabou.');
        }
    });
}

export default { };
