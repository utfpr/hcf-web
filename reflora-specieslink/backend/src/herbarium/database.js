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
import modeloTipos from '../models/Tipo';
import modeloEspecies from '../models/Especie';
import modeloVariedades from '../models/Variedade';
import modeloLocalColeta from '../models/LocalColeta';
import modeloCidade from '../models/Cidade';
import modeloAutor from '../models/Autor';
import modeloVegetacao from '../models/Vegetacao';
import modeloAlteracao from '../models/Alteracao';
import modeloUsuario from '../models/Usuario';
import modeloReflora from '../models/Reflora';

export function criaConexao() {
    return new Sequelize(database, username, password, options);
}

export function testaConexao(conexao) {
    conexao.authenticate()
        .then(() => /* a */ true)
        .catch(() => /* b */ false);
}

export function selectMaiorNumBarra(conexao) {
    const promessa = Q.defer();
    const tabelaTomboFoto = modeloTombosFotos(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaTomboFoto.max('num_barra').then(max => {
            promessa.resolve(max);
        });
    });
    return promessa.promise;
}

export function criaTabelaReflora(conexao) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    // force: true => dá um drop table
    tabelaReflora.sync({ force: true });
    tabelaReflora.removeAttribute('id');
    return tabelaReflora;
}

export function insertTabelaReflora(tabelaReflora, arrayCodBarra) {
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
                cod_barra: codBarra,
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
    const promessa = Q.defer();
    const tabelaReflora = modeloReflora(conexao, Sequelize);
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

export function atualizaTabelaReflora(conexao, codBarra, json) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    // conexao.sync().then(() => {
    tabelaReflora.update(
        { tombo_json: json, contador: 1 },
        { where: { cod_barra: codBarra } },
    );
    // });
}


export function contaNuloErroTabelaReflora(conexao) {
    const promessa = Q.defer();
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaReflora.findAll({
            where: {
                [Sequelize.Op.or]:
                [{ tombo_json: '{"erro":"500","message":"Oops, something\'s gone wrong in server!"}' },
                    { tombo_json: null },
                    { contador: 0 }],
            },
        }).then(codBarra => {
            // callback(codBarra);
            promessa.resolve(codBarra);
        });
    });
    return promessa.promise;
}

// ==================================================================
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

export function selectLocalColeta(conexao, idLocalColeta, callback) {
    const tabelaLocalColeta = modeloLocalColeta(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaLocalColeta.findAll({
            attributes: ['cidade_id', 'vegetacao_id'],
            where: { id: idLocalColeta },
        }).then(localColeta => {
            callback(localColeta);
        });
    });
}

export function selectVegetacao(conexao, idVegetacao, callback) {
    const tabelaVegetacao = modeloVegetacao(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaVegetacao.findAll({
            attributes: ['nome'],
            where: { id: idVegetacao },
        }).then(vegetacao => {
            callback(vegetacao);
        });
    });
}

export function selectTomboJson(conexao, idTombo, callback) {
    const tabelaAlteracao = modeloAlteracao(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaAlteracao.findAll({
            attributes: ['tombo_json'],
            where: { tombo_hcf: idTombo },
        }).then(tomboJson => {
            callback(tomboJson);
        });
    });
}

export function selectIdentificador(conexao, idIdentificador, callback) {
    const tabelaUsuario = modeloUsuario(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaUsuario.findAll({
            attributes: ['nome'],
            where: { id: idIdentificador },
        }).then(nomeUsuario => {
            callback(nomeUsuario);
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

/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2;
 * Além disso, o Sequelize funciona com modelos, cada tabela é um modelo.
 */
