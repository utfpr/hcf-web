import Q from 'q';
//  import { escreveLOG } from '../log';
import { selectTombo } from '../database';
import { ehIgualNomeCientifico, ehIgualFamilia, ehIgualGenero } from '../datatombos';

export function realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo) {
    // escreveLOG(nomeArquivo, 'Inicializando a aplicação do SpeciesLink.');
    const promessa = Q.defer();
    // for (let i =)
    if (listaConteudoArquivo.length === 0) {
        promessa.resolve();
    } else {
        const conteudo = listaConteudoArquivo.pop();
        const codBarra = conteudo[3];
        selectTombo(conexao, codBarra).then(async tombo => {
            let alteracaoInformacao = '{';
            const informacoesTomboBd = tombo[0].dataValues;
            // INFORMAÇÕES DO SPECIESLINK
            const nomeCientifico = conteudo[4];
            const nomeFamilia = conteudo[10];
            const nomeGenero = conteudo[11];
            const resultadoNomeCientifico = ehIgualNomeCientifico(informacoesTomboBd.nome_cientifico, nomeCientifico);
            if (resultadoNomeCientifico.length > 0) {
                alteracaoInformacao += `nome_cientifico: ${resultadoNomeCientifico}, `;
            }
            await ehIgualFamilia(conexao, informacoesTomboBd.familia_id, nomeFamilia).then(familia => {
                if (familia !== -1) {
                    alteracaoInformacao += `familia: ${familia}, `;
                }
            });
            await ehIgualGenero(conexao, informacoesTomboBd.genero_id, nomeGenero).then(genero => {
                if (genero !== -1) {
                    alteracaoInformacao += `genero: ${genero}, `;
                }
            });
            alteracaoInformacao = `${alteracaoInformacao}}`;
            // eslint-disable-next-line no-console
            console.log(`R: ${alteracaoInformacao}`);
            promessa.resolve(realizaComparacao(conexao, nomeArquivo, listaConteudoArquivo));
        });
    }
    return promessa.promise;
    /*
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
