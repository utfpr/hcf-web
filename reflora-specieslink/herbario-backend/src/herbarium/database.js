/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Sequelize from 'sequelize';
import Q from 'q';
import throttledQueue from 'throttled-queue';
import {
    database,
    username,
    password,
    options,
} from '../config/database';
import modeloTombosFotos from '../models/TomboFoto';
import modeloTombos from '../models/Tombo';
import modeloFamilias from '../models/Familia';
import modeloGeneros from '../models/Genero';
import modeloEspecies from '../models/Especie';
import modeloSubespecies from '../models/Subespecie';
import modeloVariedades from '../models/Variedade';
import modeloAlteracao from '../models/Alteracao';
import modeloUsuario from '../models/Usuario';
import modeloReflora from '../models/Reflora';
import modeloConfiguracao from '../models/Configuracao';

/**
 * A função criaConexao, estabelece uma conexão com o banco de dados
 * de acordo com os parâmetros que foram passado.
 * @return conexão, retorna uma conexão com o banco de dados.
 */
export function criaConexao() {
    return new Sequelize(database, username, password, options);
}

/**
 * A função selectCodBarra, realiza um consulta no banco de dados,
 * mas especificamente na tabela de tombos_fotos, na qual é retornado
 * somente a coluna de código de barra com todos os valores presentes.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a consulta.
 */
export function selectCodBarra(conexao) {
    const promessa = Q.defer();
    const tabelaTomboFoto = modeloTombosFotos(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaTomboFoto.findAll({
            attributes: ['num_barra'],
        }).then(listaCodBarra => {
            promessa.resolve(listaCodBarra);
        });
    });
    return promessa.promise;
}

/**
 * A função criaTabelaReflora, cria uma tabela chamada reflora,
 * com base no modelo que foi chamado e dentro desse modelo,
 * existe nome das colunas que estarão presentes nessa tabela.
 * Nessa tabela é guardado os códigos de barras, e as respostas das requisições.
 * @param {*} conexao, conexão com o banco de dados para criar a tabela.
 * @return tabelaReflora, que é a tabela que foi criada.
 */
export function criaTabelaReflora(conexao) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    // force: true => dá um drop table
    tabelaReflora.sync({ force: true });
    tabelaReflora.removeAttribute('id');
    return tabelaReflora;
}

/**
 * A função criaTabelaConfiguracao, cria uma tabela chamada configuracao,
 * com base no modelo que foi chamado e dentro desse modelo,
 * existe nome das colunas que estarão presentes nessa tabela.
 * Nessa tabela é armazenando quando foi ou irá ser executado o
 * serviço do Reflora ou do species Link.
 * @param {*} conexao, conexão com o banco de dados para criar a tabela.
 * @return tabelaConfiguracao, que é a tabela que foi criada.
 */
export function criaTabelaConfiguracao(conexao) {
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    tabelaConfiguracao.sync({ force: false });
    return tabelaConfiguracao;
}

/**
 * A função selectExecutandoReflora, realiza um consulta no banco de dados,
 * mas especificamente na tabela de configuracao, na qual é retornado registros
 * que tem o valor da coluna igual ao atributo nulo, e serviço igual a um. O nulo nessa coluna
 * representa que é um serviço que não foi executado, e um representa que é o serviço
 * do Reflora que deve ser executado.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a consulta.
 */
export function selectExecutandoReflora(conexao) {
    const promessa = Q.defer();
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaConfiguracao.findAll({
            where: { hora_fim: null, servico: 1 },
        }).then(listaExecucaoReflora => {
            promessa.resolve(listaExecucaoReflora);
        });
    });
    return promessa.promise;
}

/**
 * A função selectExisteServicoReflora, realiza um consulta no banco de dados,
 * mas especificamente na tabela de configuracao, na qual é retornado registros
 * que tem o valor do serviço igual a um, em que um representa o serviço
 * do Reflora que deve ser executado.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a consulta.
 */
export function selectExisteServicoReflora(conexao) {
    const promessa = Q.defer();
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaConfiguracao.findAll({
            where: { servico: 1 },
        }).then(listaExecucaoReflora => {
            promessa.resolve(listaExecucaoReflora);
        });
    });
    return promessa.promise;
}

/**
 * A função insereExecucao, insere um registro na tabela de configuração. Os valores
 * que serão inseridos nos registros são baseados nos valores que foram
 * passados por parâmetro.
 * @param {*} conexao, conexão com o banco de dados para que se possa inserir os dados no banco de dados.
 * @param {*} horaAtual, hora atual na qual foi solicitado a execução do serviço.
 * @param {*} horaFim, hora final na qual foi finalizado a execução do serviço.
 * @param {*} periodicidadeUsuario, periodicidade definida pelo usuário que é utilizada
 * no serviço somente do Reflora, no speciesLink é usado nulo.
 * @param {*} proximaAtualizacao, é a data da próxima atualização em que será feito
 * a próxima comparação de dados, utilizada somente no Reflora, no speciesLink é nulo.
 * @param {*} servicoUsuario, é o serviço que está relacionado com os demais campos
 * daqueles registro, então se é um está relacionado ao Reflora e dois caso esteja
 * relacionado ao species Link.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a inserção.
 */
export function insereExecucao(conexao, horaAtual, horaFim, periodicidadeUsuario, proximaAtualizacao, servicoUsuario) {
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    const promessa = Q.defer();
    tabelaConfiguracao.create({
        hora_inicio: horaAtual,
        hora_fim: horaFim,
        periodicidade: periodicidadeUsuario,
        data_proxima_atualizacao: proximaAtualizacao,
        nome_arquivo: null,
        servico: servicoUsuario,
    }).then(() => {
        promessa.resolve();
    });
    return promessa.promise;
}

/**
 * A função atualizaProximaDataConfiguracao, ele pega o registro na tabela
 * com base no identificador que foi passado como parâmetro e atualiza
 * com a nova data de próxima atualização passada por parâmetro.
 * @param {*} conexao, conexão com o banco de dados para que se possa inserir os dados no banco de dados.
 * @param {*} idExecucao, é o identificador do serviço da execução na qual terá
 * o seu novo valor de data de próxima atualização.
 * @param {*} proximaAtualizacao, é a data da nova da data da próxima atualização
 * em que será feito a próxima comparação de dados, utilizada somente no Reflora,
 * no speciesLink é nulo.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a atualização.
 */
export function atualizaProximaDataConfiguracao(conexao, idExecucao, proximaAtualizacao) {
    const tabelaConfiguracaoReflora = modeloConfiguracao(conexao, Sequelize);
    const promessa = Q.defer();
    tabelaConfiguracaoReflora.update(
        {
            data_proxima_atualizacao: proximaAtualizacao,
        },
        { where: { id: idExecucao } },
    ).then(() => {
        promessa.resolve();
    });
    return promessa.promise;
}

/**
 * A função atualizaInicioTabelaConfiguracao, ele pega o registro na tabela
 * com base no identificador que foi passado como parâmetro e atualiza
 * com a nova hora de início, hora de fim, data de próxima atualização,
 * periodicidade passada por parâmetro.
 * @param {*} conexao, conexão com o banco de dados para que se possa inserir os dados no banco de dados.
 * @param {*} idExecucao, é o identificador do serviço da execução na qual terá
 * os novos valores de hora de início, fim, periodicidade e proxima atualização.
 * @param {*} horaInicio, é a hora de início com a nova hora de início da execução do serviço.
 * @param {*} horaFim, é a hora final com a nova hora de finalização da execução do serviço.
 * @param {*} periodicidadeUsuario, é a periodicidade com a nova periodicidade da execução do serviço.
 * @param {*} proximaAtualizacao, é a data da nova da data da próxima atualização
 * em que será feito a próxima comparação de dados.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a atualização.
 */
export function atualizaInicioTabelaConfiguracao(conexao, idExecucao, horaInicio, horaFim, periodicidadeUsuario, proximaAtualizacao) {
    const tabelaConfiguracaoReflora = modeloConfiguracao(conexao, Sequelize);
    const promessa = Q.defer();
    tabelaConfiguracaoReflora.update(
        {
            hora_inicio: horaInicio,
            hora_fim: horaFim,
            periodicidade: periodicidadeUsuario,
            data_proxima_atualizacao: proximaAtualizacao,
        },
        { where: { id: idExecucao } },
    ).then(() => {
        promessa.resolve();
    });
    return promessa.promise;
}

/**
 * A função atualizaFimTabelaConfiguracao, ele pega o registro na tabela
 * com base no identificador que foi passado como parâmetro e atualiza
 * hora de fim que foi passado por parâmetro.
 * @param {*} conexao, conexão com o banco de dados para que se possa inserir os dados no banco de dados.
 * @param {*} idExecucao, é o identificador do serviço da execução na qual terá
 * o seu o valor que é a hora que terminou um processo.
 * @param {*} horaTerminou, é a hora que terminou o processo de comparação do serviço.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a atualização.
 */
export function atualizaFimTabelaConfiguracao(conexao, idExecucao, horaTerminou) {
    const tabelaConfiguracaoReflora = modeloConfiguracao(conexao, Sequelize);
    const promessa = Q.defer();
    tabelaConfiguracaoReflora.update(
        { hora_fim: horaTerminou },
        { where: { id: idExecucao } },
    ).then(() => {
        promessa.resolve();
    });
    return promessa.promise;
}

/**
 * A função selectTemExecucaoSpeciesLink, realiza um consulta no banco de dados,
 * mas especificamente na tabela de configuracao, na qual é retornado registros
 * que tem o valor do serviço igual a dois, em que o dois representa o serviço
 * do species Link que deve ser executado.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a consulta.
 */
export function selectTemExecucaoSpeciesLink(conexao) {
    const promessa = Q.defer();
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaConfiguracao.findAll({
            where: { servico: 2 },
        }).then(listaExecucaoReflora => {
            promessa.resolve(listaExecucaoReflora);
        });
    });
    return promessa.promise;
}

/**
 * A função selectEstaExecutandoSpeciesLink, realiza um consulta no banco de dados,
 * mas especificamente na tabela de configuracao, na qual é retornado registros
 * que tem o valor da coluna igual ao atributo nulo, e serviço igual a dois. O nulo nessa coluna
 * representa que é um serviço que não foi executado, e dois representa que é o serviço
 * do species Link que deve ser executado.
 * @param {*} conexao, conexão com o banco de dados para que se possa obter dados do banco de dados.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a consulta.
 */
export function selectEstaExecutandoSpeciesLink(conexao) {
    const promessa = Q.defer();
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaConfiguracao.findAll({
            where: { hora_fim: null, servico: 2 },
        }).then(listaExecucaoReflora => {
            promessa.resolve(listaExecucaoReflora);
        });
    });
    return promessa.promise;
}

/**
 * A função atualizaNomeArquivoSpeciesLink, ele pega o registro na tabela
 * com base no identificador que foi passado como parâmetro e atualiza
 * com a nova hora de início, hora de fim e o nome arquivo.
 * @param {*} conexao, conexão com o banco de dados para que se possa inserir os dados no banco de dados.
 * @param {*} idExecucao, é o identificador do serviço da execução na qual terá
 * os novos valores de hora de início, fim e o nome de arquivo.
 * @param {*} horaInicio, é a hora de início com a nova hora de início da execução do serviço.
 * @param {*} nomeArquivo, é a o nome do arquivo com o novo nome de arquivo que será comparado.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a atualização.
 */
export function atualizaNomeArquivoSpeciesLink(conexao, idExecucao, horaInicio, nomeArquivo) {
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    const promessa = Q.defer();
    tabelaConfiguracao.update(
        {
            hora_inicio: horaInicio,
            hora_fim: null,
            nome_arquivo: nomeArquivo,
        },
        { where: { id: idExecucao } },
    ).then(() => {
        promessa.resolve();
    });
    return promessa.promise;
}

/**
 * A função atualizaHoraFimSpeciesLink, ele pega o registro na tabela
 * com base no identificador que foi passado como parâmetro e atualiza
 * hora de fim que foi passado por parâmetro.
 * @param {*} conexao, conexão com o banco de dados para que se possa inserir os dados no banco de dados.
 * @param {*} idExecucao, é o identificador do serviço da execução na qual terá
 * o seu o valor que é a hora que terminou um processo.
 * @param {*} horaFim, é a hora que terminou o processo de comparação do serviço.
 * @return promessa.promise, como é assíncrono ele só retorna quando resolver, ou seja,
 * quando terminar de realizar a atualização.
 */
export function atualizaHoraFimSpeciesLink(conexao, idExecucao, horaFim) {
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    const promessa = Q.defer();
    tabelaConfiguracao.update(
        {
            hora_fim: horaFim,
        },
        { where: { id: idExecucao } },
    ).then(() => {
        promessa.resolve();
    });
    return promessa.promise;
}

export function insereExecucaoSpeciesLink(conexao, horaAtual, horaFim, nomeArquivo, servicoUsuario) {
    const tabelaConfiguracao = modeloConfiguracao(conexao, Sequelize);
    const promessa = Q.defer();
    tabelaConfiguracao.create({
        hora_inicio: horaAtual,
        hora_fim: horaFim,
        periodicidade: null,
        data_proxima_atualizacao: null,
        nome_arquivo: nomeArquivo,
        servico: servicoUsuario,
    }).then(() => {
        promessa.resolve();
    });
    return promessa.promise;
}


export function insereTabelaReflora(tabelaReflora, arrayCodBarra) {
    /**
     * Sem o throttle ele faz muitas conexões simultaneamente,
     * acabando gerando erros. O throttle faz um por um, evitando
     * erros. Algumas soluções no StackOverflow falavam para
     * adicionar certas configurações na criação da conexão, porém nada deu certo.
     */
    const throttle = throttledQueue(1, 200);
    const promessa = Q.defer();
    arrayCodBarra.forEach((codBarra, index) => {
        throttle(() => {
            tabelaReflora.create({
                cod_barra: codBarra.dataValues.num_barra,
                tombo_json: null,
                contador: 0,
            }).then(() => {
                if (index === arrayCodBarra.length - 1) {
                    promessa.resolve();
                }
            });
        });
    });
    return promessa.promise;
}

export function selectUmCodBarra(conexao) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaReflora.findAll({
            attributes: ['cod_barra'],
            where: { contador: 0 },
            limit: 1,
        }).then(codBarra => {
            // callback(codBarra);
            promessa.resolve(codBarra);
        });
    });
    return promessa.promise;
}

export function atualizaTabelaReflora(conexao, codBarra, json, valorContador) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    tabelaReflora.update(
        { tombo_json: json, contador: valorContador },
        { where: { cod_barra: codBarra } },
    );
}


export function atualizaJaComparouTabelaReflora(conexao, codBarra) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    tabelaReflora.update(
        { ja_comparou: true },
        { where: { cod_barra: codBarra } },
    );
}

export function selectUmaInformacaoReflora(conexao) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaReflora.findAll({
            attributes: ['cod_barra', 'tombo_json'],
            where: {
                [Sequelize.Op.and]:
                [{ ja_comparou: false }, { contador: 1 }],
            },
            limit: 1,
        }).then(informacaoReflora => {
            promessa.resolve(informacaoReflora);
        });
    });
    return promessa.promise;
}

export function selectNroTomboNumBarra(conexao, codBarra) {
    const tabelaTomboFoto = modeloTombosFotos(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaTomboFoto.findAll({
            attributes: ['tombo_hcf'],
            where: { num_barra: codBarra },
        }).then(nroTombo => {
            promessa.resolve(nroTombo);
        });
    });
    return promessa.promise;
}


export function selectTombo(conexao, nroTombo) {
    const tabelaTombo = modeloTombos(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaTombo.findAll({
            attributes: [
                'familia_id',
                'sub_familia_id',
                'genero_id',
                'especie_id',
                'sub_especie_id',
                'variedade_id'],
            where: { hcf: nroTombo },
        }).then(tombo => {
            promessa.resolve(tombo);
        });
    });
    return promessa.promise;
}

export function selectFamilia(conexao, idFamilia) {
    const tabelaFamilia = modeloFamilias(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaFamilia.findAll({
            attributes: ['nome'],
            where: { id: idFamilia },
        }).then(familia => {
            promessa.resolve(familia);
        });
    });
    return promessa.promise;
}

export function selectGenero(conexao, idGenero) {
    const tabelaGenero = modeloGeneros(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaGenero.findAll({
            attributes: ['nome'],
            where: { id: idGenero },
        }).then(genero => {
            promessa.resolve(genero);
        });
    });
    return promessa.promise;
}

export function selectEspecie(conexao, idEspecie) {
    const tabelaEspecie = modeloEspecies(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaEspecie.findAll({
            attributes: ['nome', 'autor_id'],
            where: { id: idEspecie },
        }).then(especie => {
            promessa.resolve(especie);
        });
    });
    return promessa.promise;
}

export function selectSubespecie(conexao, idSubespecie) {
    const tabelaSubespecies = modeloSubespecies(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaSubespecies.findAll({
            attributes: ['nome'],
            where: { id: idSubespecie },
        }).then(subespecie => {
            promessa.resolve(subespecie);
        });
    });
    return promessa.promise;
}

export function selectVariedade(conexao, idFamilia) {
    const tabelaVariedade = modeloVariedades(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaVariedade.findAll({
            attributes: ['nome'],
            where: { id: idFamilia },
        }).then(variedade => {
            promessa.resolve(variedade);
        });
    });
    return promessa.promise;
}

export function selectIdentificador(conexao, idIdentificador) {
    const tabelaUsuario = modeloUsuario(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaUsuario.findAll({
            attributes: ['nome'],
            where: { id: idIdentificador },
        }).then(nomeIdentificador => {
            promessa.resolve(nomeIdentificador);
        });
    });
    return promessa.promise;
}

export function selectInformacaoTomboJson(conexao, idTombo) {
    const tabelaAlteracao = modeloAlteracao(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaAlteracao.findAll({
            attributes: ['tombo_json'],
            where: { tombo_hcf: idTombo },
        }).then(listaTombo => {
            promessa.resolve(listaTombo);
        });
    });
    return promessa.promise;
}

export function insereAlteracaoSugerida(conexao, idUsuario, statusAlteracao, idTombo, tomboJson) {
    const tabelaAlteracao = modeloAlteracao(conexao, Sequelize);
    const throttle = throttledQueue(1, 200);
    const promessa = Q.defer();
    throttle(() => {
        tabelaAlteracao.create({
            usuario_id: idUsuario,
            status: statusAlteracao,
            tombo_hcf: idTombo,
            tombo_json: tomboJson,
        }).then(() => {
            promessa.resolve();
        });
    });
    return promessa.promise;
}

export function selectComparacoesFaltante(conexao) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaReflora.findAll({
            where: { ja_comparou: false },
        }).then(listaComparacoes => {
            promessa.resolve(listaComparacoes);
        });
    });
    return promessa.promise;
}

export function existeTabelaReflora(conexao) {
    const promessa = Q.defer();
    conexao.query('SHOW TABLES', { type: Sequelize.QueryTypes.SHOWTABLES }).then(listaTabelas => {
        listaTabelas.forEach(tabelas => {
            if (tabelas === 'reflora') {
                promessa.resolve(true);
            }
        });
        promessa.resolve(false);
    });
    return promessa.promise;
}

export function apagaTabelaReflora(conexao) {
    const promessa = Q.defer();
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    promessa.resolve(tabelaReflora.drop());
    return promessa.promise;
}
/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2;
 * Além disso, o Sequelize funciona com modelos, cada tabela é um modelo.
 */
