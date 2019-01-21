import Sequelize from 'sequelize';
import Q from 'q';
import { database, username, password } from '../config/database';
import modelosTombosFotos from '../models/TomboFoto';
import modelosTombosAlteracoes from '../models/Alteracao';

function myOptions() {
    return {
        dialect: 'mysql',
        host: 'localhost',
        port: parseInt('3306') || 41890,

        define: {
            freezeTableName: true,
            underscored: true,
            timestamps: true,
            paranoid: false,
        },
        logging: false,
        operatorsAliases: false,
        dialectOptions: {
            charset: 'utf8mb4',
            multipleStatements: true,
        },
    };
}

function createConnection() {
    /**
     * Retorna a conexão estabelecida com o banco
     */
    const options = myOptions();
    return new Sequelize(database, username, password, options);
}

function testConnection(connection) {
    connection.authenticate()
        .then(() => /* LOG console.log(dateTime.formatLog('Conexão com o banco de dados bem-sucedida.')); */ true)
        .catch(() => /* LOG console.log(dateTime.formatLog('Conexão com o banco de dados mal-sucedida.')); */ false);
}

function selectTombosFotos(connection) {
    /* LOG console.log(dateTime.formatLog('Pegando o modelo da tabela tombos_fotos.')); */
    const tableTombosFotos = modelosTombosFotos(connection, Sequelize);
    const promessa = Q.defer();

    /**
     * findAll() encontra todos os registros
     */
    connection.sync().then(() => {
        tableTombosFotos.findAll().then(tombosFotos => {
            promessa.resolve(tombosFotos);
        });
    });
    return promessa.promise;
}

function selectCountTombosAlteracao(connection, tomboHCF) {
    /* LOG console.log(dateTime.formatLog('Pegando o modelo da tabela alterações.')); */
    /**
     * Ele cria a tabela caso ela não exista, no modelo está definido os atributos dessa entidade
     */
    const tableTombosAlteracoes = modelosTombosAlteracoes(connection, Sequelize);
    const promessa = Q.defer();

    /* LOG console.log(dateTime.formatLog('Realizando o select contando a quantidade de alterações daquele tombo.')); */
    /**
     * O sync meio que realiza faz (não sei direito), e a função count() é para poder utilizar no SQL COUNT
     */
    connection.sync().then(() => {
        tableTombosAlteracoes.count({
            attributes: ['status'],
            where: { tombo_hcf: tomboHCF },
            group: ['status'],
        }).then(tombosAlterados => {
            promessa.resolve(tombosAlterados);
        });
    });
    return promessa.promise;
}

/**
 * Para poder utilizar as funções em outros arquivosé necessário exportar
 */
export default {
    createConnection, testConnection, selectTombosFotos, selectCountTombosAlteracao, myOptions,
};

/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2;
 * Além disso, o Sequelize funciona com modelos, cada tabela é um modelo.
 */
