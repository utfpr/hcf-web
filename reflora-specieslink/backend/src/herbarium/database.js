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
    return new Sequelize(database, username, password, options);
}

function testConnection(connection) {
    connection.authenticate()
        .then(() => true)
        .catch(err => false);
}

function endConnection(connection) {
    connection.end(err => {
        /* LOG console.log(dateTime.formatLog('Conexão com o banco de dados com erros.')); */
        if (err) {
            return false;
        }

        /* LOG console.log(dateTime.formatLog('Conexão com o banco de dados sem erros.')); */
        return true;
    });
}

function selectTombosFotos(connection, callback) {
    const tableTombosFotos = modelosTombosFotos(connection, Sequelize);

    connection.sync().then(() => {
        tableTombosFotos.findAll().then(tombosFotos => {
            callback(tombosFotos);
        });
    });
}

// , group: ['status']
// [[Sequelize.fn("COUNT", Sequelize.col("status")), "countStatus"]]
function selectCountTombosAlteracao(connection, tomboHCF, callback) {
    const tableTombosAlteracoes = modelosTombosAlteracoes(connection, Sequelize);

    connection.sync().then(() => {
        tableTombosAlteracoes.count({
            attributes: ['status'],
            where: { tombo_hcf: tomboHCF },
            group: ['status'],
        }).then(tombosAlterados => {
            callback(tombosAlterados);
        });
    });
    // return `select status_alteracoes, COUNT(*) as count from alteracoes where tombo_hcf=${nroTombo} group by status_alteracoes;`;
}

export default {
    createConnection, testConnection, endConnection, selectTombosFotos, selectCountTombosAlteracao,
};

/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2
 */
