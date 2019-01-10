import Sequelize from 'sequelize';
import {
    database,
    username,
    password,
    options,
} from '../config/database';
import modelosTombosFotos from '../models/TomboFoto';
import modelosTombosAlteracoes from '../models/Alteracao';

function createConnection() {
    /* Retorna a conexão estabelecida com o banco */
    return new Sequelize(database, username, password, options);
}

function testConnection(connection) {
    connection.authenticate()
        .then(() => /* LOG console.log(dateTime.formatLog('Conexão com o banco de dados bem-sucedida.')); */ true)
        .catch(() => /* LOG console.log(dateTime.formatLog('Conexão com o banco de dados mal-sucedida.')); */ false);
}

function selectTombosFotos(connection, callback) {
    /* LOG console.log(dateTime.formatLog('Pegando o modelo da tabela tombos_fotos.')); */
    const tableTombosFotos = modelosTombosFotos(connection, Sequelize);

    /* findAll() encontra todos os registros */
    connection.sync().then(() => {
        tableTombosFotos.findAll().then(tombosFotos => {
            callback(tombosFotos);
        });
    });
}

function selectCountTombosAlteracao(connection, tomboHCF, callback) {
    /* LOG console.log(dateTime.formatLog('Pegando o modelo da tabela alterações.')); */
    /* Ele cria a tabela caso ela não exista, no modelo está definido os atributos dessa entidade */
    const tableTombosAlteracoes = modelosTombosAlteracoes(connection, Sequelize);

    /* LOG console.log(dateTime.formatLog('Realizando o select contando a quantidade de alterações daquele tombo.')); */
    /* O sync meio que realiza faz (não sei direito), e a função count() é para poder utilizar no SQL COUNT */
    connection.sync().then(() => {
        tableTombosAlteracoes.count({
            attributes: ['status'],
            where: { tombo_hcf: tomboHCF },
            group: ['status'],
        }).then(tombosAlterados => {
            callback(tombosAlterados);
        });
    });
}

/* Para poder utilizar as funções em outros arquivosé necessário exportar */
export default {
    createConnection, testConnection, selectTombosFotos, selectCountTombosAlteracao,
};

/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2;
 * Além disso, o Sequelize funciona com modelos, cada tabela é um modelo.
 */
