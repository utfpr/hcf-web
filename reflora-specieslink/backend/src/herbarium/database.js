import Sequelize from 'sequelize';
import {
    database,
    username,
    password,
    options,
} from '../config/database';
import modelosTombosFotos from '../models/TomboFoto';
import modelosTombos from '../models/Tombo';
import { writeFileLOG } from './log';

function createConnection(fileName) {
    writeFileLOG(fileName, 'Criando a conexão com o database');
    return new Sequelize(database, username, password, options);
}

function testConnection(connection) {
    connection.authenticate()
        .then(() => /* a */ true)
        .catch(() => /* b */ false);
}

function selectMaxNumBarra(connection, callback) {
    const tableTombosFotos = modelosTombosFotos(connection, Sequelize);
    connection.sync().then(() => {
        tableTombosFotos.max('num_barra').then(max => {
            callback(max);
        });
    });
}

function selectNroTomboNumBarra(connection, codBarra, callback) {
    const tableTombosFotos = modelosTombosFotos(connection, Sequelize);
    connection.sync().then(() => {
        tableTombosFotos.findAll({
            attributes: ['tombo_hcf'],
            where: { num_barra: codBarra },
        }).then(nroTombo => {
            callback(nroTombo);
        });
    });
}

function selectTombo(connection, nroTombo, callback) {
    const tableTombos = modelosTombos(connection, Sequelize);
    connection.sync().then(() => {
        tableTombos.findAll({
            attributes: ['numero_coleta', 'data_coleta_dia', 'data_coleta_mes', 'data_coleta_ano', 'altitude', 'latitude', 'longitude', 'data_identificacao_dia', 'data_identificacao_mes', 'data_identificacao_ano', 'nome_cientifico'],
            where: { hcf: nroTombo },
        }).then(tombo => {
            callback(tombo);
        });
    });
}

/* Para poder utilizar as funções em outros arquivosé necessário exportar */
export default {
    createConnection, testConnection, selectMaxNumBarra, selectNroTomboNumBarra, selectTombo,
};

/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2;
 * Além disso, o Sequelize funciona com modelos, cada tabela é um modelo.
 */
