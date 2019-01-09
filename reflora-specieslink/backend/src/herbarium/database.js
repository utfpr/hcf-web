import Sequelize from 'sequelize';
import {
    database,
    username,
    password,
    options,
} from '../config/database';

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

/* Depois de integrar irá ter que mexer aqui */
function selectTombosFotos(connection) {
    const tableTombosFotos = connection.define('tombos_fotos', {
        tombo_hcf: { type: Sequelize.INTEGER, allowNull: true },
        num_barra: { type: Sequelize.STRING(45), allowNull: true },
    }, {
        freezeTableName: true,
        timestamps: false,
    });

    connection.sync().then(() => {
        tableTombosFotos.findAll().then(tombosFotos => {
            // console.log(tombosFotos[0].dataValues);
        });
    });
    // connection.get('tombos_fotos');
}

function selectEditTombos(nroTombo) {
    return `select status_alteracoes, COUNT(*) as count from alteracoes where tombo_hcf=${nroTombo} group by status_alteracoes;`;
}

export default {
    createConnection, testConnection, endConnection, selectTombosFotos, selectEditTombos,
};
