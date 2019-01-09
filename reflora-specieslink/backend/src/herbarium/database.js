import Sequelize from 'sequelize';
import {
    database,
    username,
    password,
    options,
} from '../config/database';
import modelosTombosFotos from '../models/TomboFoto';

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

function selectEditTombos(nroTombo) {
    return `select status_alteracoes, COUNT(*) as count from alteracoes where tombo_hcf=${nroTombo} group by status_alteracoes;`;
}

export default {
    createConnection, testConnection, endConnection, selectTombosFotos, selectEditTombos,
};

/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2
 */