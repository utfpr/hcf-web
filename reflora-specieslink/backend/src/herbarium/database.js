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
import modeloLocalColeta from '../models/LocalColeta';
import modeloCidade from '../models/Cidade';
import modeloAutor from '../models/Autor';
import { escreveLOG } from './log';

export function criaConexao(nomeArquivo) {
    escreveLOG(nomeArquivo, 'Criando a conexão com o database');
    return new Sequelize(database, username, password, options);
}

export function testaConexao(conexao) {
    conexao.authenticate()
        .then(() => /* a */ true)
        .catch(() => /* b */ false);
}

export function selectMaxNumBarra(conexao, callback) {
    const tabelaTomboFoto = modeloTombosFotos(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaTomboFoto.max('num_barra').then(max => {
            callback(max);
        });
    });
}

export function selectNroTomboNumBarra(conexao, codBarra, callback) {
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

export function selectTombo(conexao, nroTombo, callback) {
    const tabelaTombo = modeloTombos(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaTombo.findAll({
            attributes: ['numero_coleta', 'data_coleta_dia', 'data_coleta_mes', 'data_coleta_ano', 'altitude', 'latitude', 'longitude', 'data_identificacao_dia', 'data_identificacao_mes', 'data_identificacao_ano', 'nome_cientifico', 'familia_id', 'variedade_id', 'tipo_id', 'especie_id', 'genero_id', 'local_coleta_id', 'observacao'],
            where: { hcf: nroTombo },
        }).then(tombo => {
            callback(tombo);
        });
    });
}

export function selectFamilia(conexao, idFamilia, callback) {
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

export function selectGenero(conexao, idGenero, callback) {
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

export function selectEspecie(conexao, idEspecie, callback) {
    const tabelaEspecie = modeloEspecies(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaEspecie.findAll({
            attributes: ['nome', 'autor_id'],
            where: { id: idEspecie },
        }).then(especie => {
            callback(especie);
        });
    });
}

export function selectVariedade(conexao, idFamilia, callback) {
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

export function selectTipo(conexao, idTipo, callback) {
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

export function selectLocalColeta(conexao, idLocalColeta, callback) {
    const tabelaLocalColeta = modeloLocalColeta(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaLocalColeta.findAll({
            attributes: ['cidade_id'],
            where: { id: idLocalColeta },
        }).then(localColeta => {
            callback(localColeta);
        });
    });
}

export function selectCidade(conexao, idCidade, callback) {
    const tabelaCidade = modeloCidade(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaCidade.findAll({
            attributes: ['nome'],
            where: { id: idCidade },
        }).then(cidade => {
            callback(cidade);
        });
    });
}

export function selectEstado(conexao, idCidade, callback) {
    const tabelaCidade = modeloCidade(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaCidade.findAll({
            attributes: ['estados_nome'],
            where: { id: idCidade },
        }).then(estado => {
            callback(estado);
        });
    });
}

export function selectPais(conexao, idCidade, callback) {
    const tabelaCidade = modeloCidade(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaCidade.findAll({
            attributes: ['estados_paises_nome'],
            where: { id: idCidade },
        }).then(paises => {
            callback(paises);
        });
    });
}

export function selectPaisSigla(conexao, idCidade, callback) {
    const tabelaCidade = modeloCidade(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaCidade.findAll({
            attributes: ['estados_paises_sigla'],
            where: { id: idCidade },
        }).then(paises => {
            callback(paises);
        });
    });
}

export function selectAutor(conexao, idAutor, callback) {
    const tabelaAutor = modeloAutor(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaAutor.findAll({
            attributes: ['nome'],
            where: { id: idAutor },
        }).then(autor => {
            callback(autor);
        });
    });
}

/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2;
 * Além disso, o Sequelize funciona com modelos, cada tabela é um modelo.
 */
