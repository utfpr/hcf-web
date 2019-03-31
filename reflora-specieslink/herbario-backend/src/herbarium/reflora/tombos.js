/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Q from 'q';
import throttledQueue from 'throttled-queue';
import {
    ehIgualFamilia,
    ehIgualGenero,
    ehIgualEspecie,
    ehIgualVariedade,
    existeAlteracaoSugerida,
} from '../comparainformacao';
import {
    processaRespostaReflora,
    temResultadoRespostaReflora,
} from './reflora';
import {
    selectUmaInformacaoReflora,
    selectNroTomboNumBarra,
    selectTombo,
    atualizaJaComparouTabelaReflora,
    insereAlteracaoSugerida,
} from '../database';

/**
 * A função fazComparacaoInformacao, é comparado informações do banco de dados com as que
 * estão no Reflora. As informações a serem comparadas são: família, subfamília, gênero,
 * espécie, subespécie e variedade. Depois de comparar cada uma dessas informações
 * quando encontrado divergência é adicionado em um JSON. Após realizar todas as comparações
 * ele procurar na tabela de alterações e verifica se encontra um JSON parecido com o
 * que está no banco de dados, se for encontrado um JSON igual não é adicionado,
 * caso não seja encontrado é adicionado um novo registro na tabela de alterações.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @param {*} nroTombo, é o número do tombo para serem pesquisadas informações no banco de dados.
 * @param {*} codBarra, é o código de barra relacionado ao tombo do HCF a qual será gerado o JSON
 * de alteração.
 * @param {*} informacaoReflora, informação do tombo que irá ser comparado com as presentes no banco
 * de dados.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando acabar de realizar a comparação de informações.
 */
export async function geraJsonAlteracao(conexao, nroTombo, codBarra, informacaoReflora) {
    const promessa = Q.defer();
    selectTombo(conexao, nroTombo).then(async tomboBd => {
        if (tomboBd.length === 0) {
            promessa.resolve();
        }
        let alteracaoInformacao = '{';
        const processaInformacaoBd = tomboBd[0].dataValues;
        // família
        await ehIgualFamilia(conexao, processaInformacaoBd.familia_id, informacaoReflora.family).then(familia => {
            if (familia !== -1) {
                alteracaoInformacao += `familia: ${familia}, `;
            }
        });
        // gênero
        await ehIgualGenero(conexao, processaInformacaoBd.genero_id, informacaoReflora.genus).then(genero => {
            if (genero !== -1) {
                alteracaoInformacao += `genero: ${genero}, `;
            }
        });
        // espécie
        await ehIgualEspecie(conexao, processaInformacaoBd.especie_id, informacaoReflora.specificepithet).then(especie => {
            if (especie !== -1) {
                alteracaoInformacao += `especie: ${especie}, `;
            }
        });
        // variedade
        await ehIgualVariedade(conexao, processaInformacaoBd, informacaoReflora.infraespecificepithet).then(variedade => {
            if (variedade !== -1) {
                alteracaoInformacao += `especie: ${variedade}, `;
            }
        });
        alteracaoInformacao = alteracaoInformacao.substring(0, alteracaoInformacao.lastIndexOf(','));
        alteracaoInformacao += '}';
        // eslint-disable-next-line no-console
        console.log('==============================================================================');
        // eslint-disable-next-line no-console
        console.log(`->${alteracaoInformacao}`);
        atualizaJaComparouTabelaReflora(conexao, codBarra);
        promessa.resolve(alteracaoInformacao);
    });
    return promessa.promise;
}

/**
 * A função fazComparacaoInformacao, primeiramente verifica se tem informações
 * do reflora esperado. Se tem as informações esperada eu pego o número de tombo
 * equivalente aquele tombo de código de barra, e com esse valor de número de tombo
 * eu consigo pegar informações relacionadas a esse tombo. Comparando as informações
 * vindas do Reflora com as presentes no banco de dados, eu verifico se me gerou
 * um JSON. Quando me retorna JSON, eu verifico se existe essa alteração no banco
 * de dados se não existe eu insiro ela no banco de dados.
 * @param {*} conexao, conexão com o banco de dados para que se possa ser feito o select.
 * @param {*} codBarra, é o código de barra relacionado ao tombo do HCF.
 * @param {*} informacaoReflora, informação do tombo que está exposta do Reflora.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando acabar de realizar a comparação de informações.
 */
export function fazComparacaoInformacao(conexao, codBarra, informacaoReflora) {
    const promessa = Q.defer();
    if (temResultadoRespostaReflora(informacaoReflora)) {
        selectNroTomboNumBarra(conexao, codBarra).then(nroTombo => {
            if (nroTombo.length > 0) {
                const getNroTombo = nroTombo[0].dataValues.tombo_hcf;
                const getInformacaoReflora = informacaoReflora.result[0];
                geraJsonAlteracao(conexao, getNroTombo, codBarra, getInformacaoReflora).then(alteracao => {
                    if (alteracao.length > 2) {
                        existeAlteracaoSugerida(conexao, getNroTombo, alteracao).then(existe => {
                            if (!existe) {
                                insereAlteracaoSugerida(conexao, 10, 'ESPERANDO', getNroTombo, alteracao);
                                // eslint-disable-next-line no-console
                                console.log(alteracao);
                                promessa.resolve();
                            }
                            promessa.resolve();
                        });
                    }
                });
            }
        });
    } else {
        promessa.resolve();
    }
    return promessa.promise;
}

/**
 * A função fazComparacaoTombo, faz um select na tabela do reflora verificando
 * se tem algum tombo que já foi comparado ou não. Se o resultado dessa requisição
 * é maior que zero, então eu pego o json e começo a realizar as comparações, e depois
 * marco que esse json já foi comparado. Após isso, eu chamo novamente essa função
 * e faço isso até com que seja comparado todos os json.
 * @param {*} conexao, conexão com o banco de dados para que se possa ser feito o select.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando acabar de realizar a recursão.
 */
export function fazComparacaoTombo(conexao) {
    const promessa = Q.defer();
    const throttle = throttledQueue(1, 1000);
    selectUmaInformacaoReflora(conexao).then(informacaoReflora => {
        if (informacaoReflora.length === 0) {
            promessa.resolve(true);
        } else {
            const getCodBarra = informacaoReflora[0].dataValues.cod_barra;
            const getInformacaoReflora = processaRespostaReflora(informacaoReflora[0].dataValues.tombo_json);
            throttle(() => {
                fazComparacaoInformacao(conexao, getCodBarra, getInformacaoReflora).then(() => {
                    atualizaJaComparouTabelaReflora(conexao, getCodBarra);
                    promessa.resolve(fazComparacaoTombo(conexao));
                });
            });
        }
    });
    return promessa.promise;
}
