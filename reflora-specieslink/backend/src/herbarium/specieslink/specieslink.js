import { escreveLOG } from '../log';

export function realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo) {
    escreveLOG(nomeArquivo, 'Inicializando a aplicação do SpeciesLink.');
    listaConteudoArquivo.forEach((conteudo, i) => {
        // conteudo
        if (i === 1) {
            const codHCF = conteudo[3];
            const nomeCientifico = conteudo[4];
            const autorEspcie = conteudo[9];
            const anoIdentificacao = conteudo[11];
            const mesIdentificacao = conteudo[12];
            const diaIdentificacao = conteudo[13];
            const nroColeta = conteudo[14];
            const anoColeta = conteudo[16];
            const mesColeta = conteudo[17];
            const diaColeta = conteudo[18];
            const observacaoColeta = conteudo[49];
            // eslint-disable-next-line no-console
            console.log(`codHCF${codHCF}`);
            // eslint-disable-next-line no-console
            console.log(`nomeCientficio${nomeCientifico}`);
            // eslint-disable-next-line no-console
            console.log(`autorEspecie${autorEspcie}`);
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
            console.log(`observacaoColeta${observacaoColeta}`);
        }
        if (i === listaConteudoArquivo.length - 1) {
            // console.log('entrou');
            escreveLOG(nomeArquivo, 'O processo de comparação do Reflora acabou.');
        }
    });
}

export default { };
