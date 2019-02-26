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

export function selectCodBarra(conexao) {
    const promessa = Q.defer();
    const tabelaTomboFoto = modeloTombosFotos(conexao, Sequelize);
    conexao.sync().then(() => {
        tabelaTomboFoto.findAll({
            attributes: ['num_barra'],
        }).then(listaCodBarra => {
            // callback(codBarra);
            promessa.resolve(listaCodBarra);
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

export function contaNuloErroTabelaReflora(conexao) {
    const tabelaReflora = modeloReflora(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaReflora.findAll({
            where: {
                [Sequelize.Op.or]:
                [{ tombo_json: '{"erro":"500","message":"Oops, something\'s gone wrong in server!"}' },
                    { tombo_json: null },
                    { contador: 0 }],
            },
        }).then(codBarra => {
            promessa.resolve(codBarra);
        });
    });
    return promessa.promise;
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
                'numero_coleta',
                'data_coleta_dia',
                'data_coleta_mes',
                'data_coleta_ano',
                'altitude',
                'latitude',
                'longitude',
                'data_identificacao_dia',
                'data_identificacao_mes',
                'data_identificacao_ano',
                'nome_cientifico',
                'familia_id',
                'variedade_id',
                'tipo_id',
                'especie_id',
                'genero_id',
                'local_coleta_id',
                'observacao'],
            where: { hcf: nroTombo },
        }).then(tombo => {
            promessa.resolve(tombo);
        });
    });
    return promessa.promise;
}

export function selectLocalColeta(conexao, idLocalColeta) {
    const tabelaLocalColeta = modeloLocalColeta(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaLocalColeta.findAll({
            attributes: ['cidade_id', 'vegetacao_id'],
            where: { id: idLocalColeta },
        }).then(infoLocalColeta => {
            promessa.resolve(infoLocalColeta);
        });
    });
    return promessa.promise;
}

export function selectPais(conexao, idCidade) {
    const tabelaCidade = modeloCidade(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaCidade.findAll({
            attributes: ['estados_paises_nome'],
            where: { id: idCidade },
        }).then(pais => {
            promessa.resolve(pais);
        });
    });
    return promessa.promise;
}

export function selectPaisSigla(conexao, idCidade) {
    const tabelaCidade = modeloCidade(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaCidade.findAll({
            attributes: ['estados_paises_sigla'],
            where: { id: idCidade },
        }).then(siglaPais => {
            promessa.resolve(siglaPais);
        });
    });
    return promessa.promise;
}

export function selectEstado(conexao, idCidade) {
    const tabelaCidade = modeloCidade(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaCidade.findAll({
            attributes: ['estados_nome'],
            where: { id: idCidade },
        }).then(estado => {
            promessa.resolve(estado);
        });
    });
    return promessa.promise;
}

export function selectCidade(conexao, idCidade) {
    const tabelaCidade = modeloCidade(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaCidade.findAll({
            attributes: ['nome'],
            where: { id: idCidade },
        }).then(cidade => {
            promessa.resolve(cidade);
        });
    });
    return promessa.promise;
}

export function selectVegetacao(conexao, idVegetacao) {
    const tabelaVegetacao = modeloVegetacao(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaVegetacao.findAll({
            attributes: ['nome'],
            where: { id: idVegetacao },
        }).then(vegetacao => {
            promessa.resolve(vegetacao);
        });
    });
    return promessa.promise;
}

export function selectTipo(conexao, idTipo) {
    const tabelaTipo = modeloTipos(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaTipo.findAll({
            attributes: ['nome'],
            where: { id: idTipo },
        }).then(tipo => {
            promessa.resolve(tipo);
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

export function selectAutor(conexao, idAutor) {
    const tabelaAutor = modeloAutor(conexao, Sequelize);
    const promessa = Q.defer();
    conexao.sync().then(() => {
        tabelaAutor.findAll({
            attributes: ['nome'],
            where: { id: idAutor },
        }).then(autor => {
            promessa.resolve(autor);
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

export function insereAlteracaoSugerida(conexao, idTombo, identificador, tomboJson) {
    const tabelaAlteracao = modeloAlteracao(conexao, Sequelize);
    tabelaAlteracao.create({
        tombo_hcf: idTombo,
        tombo_json: tomboJson,
    });
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
/**
 * Detalhe para o Sequelize funcionar é necessário funcionar o mysql2;
 * Além disso, o Sequelize funciona com modelos, cada tabela é um modelo.
 */
