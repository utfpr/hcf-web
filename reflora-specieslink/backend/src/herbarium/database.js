/* Evita o warning de excendo o tamanho da linha */
/* eslint-disable max-len */
import Sequelize from 'sequelize';
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
import modeloTipos from '../models/Tipo';
import modeloEspecies from '../models/Especie';
import modeloVariedades from '../models/Variedade';
import { escreveLOG } from './log';

function criaConexao(nomeArquivo) {
    escreveLOG(nomeArquivo, 'Criando a conexão com o database');
    return new Sequelize(database, username, password, options);
}

function testaConexao(conexao) {
    conexao.authenticate()
        .then(() => /* a */ true)
        .catch(() => /* b */ false);
}

function selectMaxNumBarra(conexao, callback) {
    const tabelaTomboFoto = modeloTombosFotos(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaTomboFoto.max('num_barra').then(max => {
            callback(max);
        });
    });
}

function selectNroTomboNumBarra(conexao, codBarra, callback) {
    const tabelaTomboFoto = modeloTombosFotos(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaTomboFoto.findAll({
            attributes: ['tombo_hcf'],
            where: { num_barra: codBarra },
        }).then(nroTombo => {
            callback(nroTombo);
        });
    });
}

function selectTombo(conexao, nroTombo, callback) {
    const tabelaTombo = modeloTombos(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaTombo.findAll({
            attributes: ['numero_coleta', 'data_coleta_dia', 'data_coleta_mes', 'data_coleta_ano', 'altitude', 'latitude', 'longitude', 'data_identificacao_dia', 'data_identificacao_mes', 'data_identificacao_ano', 'nome_cientifico', 'familia_id', 'variedade_id', 'tipo_id', 'especie_id', 'genero_id'],
            where: { hcf: nroTombo },
        }).then(tombo => {
            callback(tombo);
        });
    });
}

function selectFamilia(conexao, idFamilia, callback) {
    const tabelaFamilia = modeloFamilias(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaFamilia.findAll({
            attributes: ['nome'],
            where: { id: idFamilia },
        }).then(familia => {
            callback(familia);
        });
    });
}

function selectGenero(conexao, idGenero, callback) {
    const tabelaGenero = modeloGeneros(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaGenero.findAll({
            attributes: ['nome'],
            where: { id: idGenero },
        }).then(genero => {
            callback(genero);
        });
    });
}

function selectEspecie(conexao, idEspecie, callback) {
    const tabelaEspecie = modeloEspecies(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaEspecie.findAll({
            attributes: ['nome'],
            where: { id: idEspecie },
        }).then(especie => {
            callback(especie);
        });
    });
}

function selectVariedade(conexao, idFamilia, callback) {
    const tabelaVariedade = modeloVariedades(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaVariedade.findAll({
            attributes: ['nome'],
            where: { id: idFamilia },
        }).then(tombo => {
            callback(tombo);
        });
    });
}

function selectTipo(conexao, idTipo, callback) {
    const tabelaTipo = modeloTipos(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaTipo.findAll({
            attributes: ['nome'],
            where: { id: idTipo },
        }).then(tipo => {
            callback(tipo);
        });
    });
}

/* Para poder utilizar as funções em outros arquivosé necessário exportar */
export default {
    criaConexao, testaConexao, selectMaxNumBarra, selectNroTomboNumBarra, selectTombo, selectFamilia, selectEspecie, selectGenero, selectTipo, selectVariedade,
};

/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2;
 * Além disso, o Sequelize funciona com modelos, cada tabela é um modelo.
 */
