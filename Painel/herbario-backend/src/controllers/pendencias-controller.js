import models from '../models';
import codigos from '../resources/codigosHTTP';
import BadRequestExeption from '../errors/bad-request-exception';

const {
    Alteracao,
    Usuario,
    Herbario,
    Solo,
    Relevo,
    Vegetacao,
    Cidade,
    FaseSucessional,
    LocalColeta,
    sequelize,
    Sequelize: { Op },
    Tombo,
} = models;

export const listagem = (request, response, next) => {
    const { limite, pagina, offset } = request.paginacao;
    let retorno = {};
    const callback = transaction => Promise.resolve()
        .then(() => Alteracao.findAndCountAll({
            where: {
                ativo: true,
            },
            transaction,
        }))
        .then(alteracoes => {
            retorno.count = alteracoes.count;
            return Usuario.findAndCountAll({
                where: {
                    ativo: true,
                },
                include: [
                    {
                        model: Tombo,
                        attributes: ['hcf'],
                    },
                ],
                limit: limite,
                offset,
                transaction,
            });
        })
        .then(alteracoes => alteracoes.rows.filter(alteracao => alteracao.tombos.length > 0))
        .then(alteracoes => {
            const alteracoesFormatadas = [];
            const { status, nome_usuario: nomeUsuario } = request.query;
            let usuarios = alteracoes;
            if (nomeUsuario) {
                usuarios = usuarios.filter(user => user.nome.indexOf(nomeUsuario) > -1);
            }
            usuarios.forEach(item => {
                let tombos = [];
                tombos = item.tombos.filter(tombo => (status !== undefined ? (tombo.alteracoes.ativo === true && tombo.alteracoes.status === status) : tombo.alteracoes.ativo === true));
                tombos.forEach(alt => {
                    alteracoesFormatadas.push({
                        id: alt.alteracoes.id,
                        nome_usuario: item.nome,
                        numero_tombo: alt.hcf,
                        numero_alteracao_tombo: alt.alteracoes.novo_hcf || -1,
                        data_criacao: alt.alteracoes.created_at,
                        status: alt.alteracoes.status,
                        observacao: alt.alteracoes.observacao,
                    });
                });
            });
            return alteracoesFormatadas;
        });
    sequelize.transaction(callback)
        .then(alteracoes => {
            retorno = {
                ...retorno,
                alteracoes,
            };
            response.status(codigos.LISTAGEM).json({
                metadados: {
                    total: retorno.count,
                    pagina,
                    limite,
                },
                resultado: retorno.alteracoes,
            });

        })
        .catch(next);
};

export const desativar = (request, response, next) => {
    const id = request.params.pendencia_id;

    const callback = transaction => Promise.resolve()
        .then(() => Alteracao.findOne({
            where: {
                ativo: true,
                id,
            },
            transaction,
        }))
        .then(alteracao => {
            if (!alteracao) {
                throw new BadRequestExeption(800);
            }
            return Alteracao.update({
                ativo: false,
            }, {
                where: {
                    id,
                },
                transaction,
            });
        });
    sequelize.transaction(callback)
        .then(() => {
            response.status(codigos.DESATIVAR).send();
        })
        .catch(next);
};

export const visualizar = (request, response, next) => {
    const id = request.params.pendencia_id;
    let parametros = {};

    const callback = transaction => Promise.resolve()
        .then(() => Alteracao.findOne({
            where: {
                ativo: true,
                id,
            },
            transaction,
        }))
        .then(alteracao => {
            if (!alteracao) {
                throw new BadRequestExeption(800);
            }
            parametros = {
                ...parametros,
                numero_tombo: alteracao.tombo_hcf,
                numero_tombo_alteracao: alteracao.novo_hcf,
            };
            return Tombo.findAll({
                where: {
                    hcf: {
                        [Op.in]: [alteracao.tombo_hcf, alteracao.novo_hcf],
                    },
                    ativo: true,
                },
                include: [
                    {
                        model: Herbario,
                    },
                    {
                        model: LocalColeta,
                        include: [
                            {
                                model: Solo,
                            },
                            {
                                model: Relevo,
                            },
                            {
                                model: Vegetacao,
                            },
                            {
                                model: Cidade,
                            },
                            {
                                model: FaseSucessional,
                            },
                        ],
                    },
                ],
                transaction,
            });
        })
        .then(tombos => {
            parametros = {
                ...parametros,
                retorno: [],
            };
            if (tombos[0].hcf === parametros.numero_tombo) {
                parametros = {
                    ...parametros,
                    tombo: tombos[0],
                    tombo_alterado: tombos[1],
                };
            } else {
                parametros = {
                    ...parametros,
                    tombo: tombos[1],
                    tombo_alterado: tombos[0],
                };
            }
            const { tombo, tombo_alterado: tomboAlterado } = parametros;
            if (tombo.data_coleta_dia !== tomboAlterado.data_coleta_dia) {
                parametros = {
                    ...parametros,
                    retorno: [
                        {
                            campo: 'dia da coleta',
                            antigo_valor: tombo.data_coleta_dia,
                            novo_valor: tomboAlterado.data_coleta_dia,
                        },
                    ],
                };
            }
            if (tombo.observacao !== tomboAlterado.observacao) {
                parametros.retorno.push({
                    campo: 'observação',
                    antigo_valor: tombo.observacao,
                    novo_valor: tomboAlterado.observacao,
                });
            }
            if (tombo.nomes_populares !== tomboAlterado.nomes_populares) {
                parametros.retorno.push({
                    campo: 'Nomes populares',
                    antigo_valor: tombo.nomes_populares,
                    novo_valor: tomboAlterado.nomes_populares,
                });
            }
            if (tombo.numero_coleta !== tomboAlterado.numero_coleta) {
                parametros.retorno.push({
                    campo: 'Numero de coleta',
                    antigo_valor: tombo.numero_coleta,
                    novo_valor: tomboAlterado.numero_coleta,
                });
            }
            if (tombo.latitude !== tomboAlterado.latitude) {
                parametros.retorno.push({
                    campo: 'Latitude',
                    antigo_valor: tombo.latitude,
                    novo_valor: tomboAlterado.latitude,
                });
            }
            if (tombo.longitude !== tomboAlterado.longitude) {
                parametros.retorno.push({
                    campo: 'Longitude',
                    antigo_valor: tombo.longitude,
                    novo_valor: tomboAlterado.longitude,
                });
            }
            if (tombo.altitude !== tomboAlterado.altitude) {
                parametros.retorno.push({
                    campo: 'Altitude',
                    antigo_valor: tombo.altitude,
                    novo_valor: tomboAlterado.altitude,
                });
            }
            // ////
            console.log(parametros);// eslint-disable-line
            if (tombo.entidade_id !== tomboAlterado.entidade_id) {
                parametros.retorno.push({
                    campo: 'Entidade',
                    antigo_valor: tombo.entidade.nome,
                    novo_valor: tomboAlterado.entidade.nome,
                });
            }
            if (tombo.local_coleta !== tomboAlterado.entidade_id) {
                parametros.retorno.push({
                    campo: 'Entidade',
                    antigo_valor: tombo.entidade.nome,
                    novo_valor: tomboAlterado.entidade.nome,
                });
            }
            /* descricao
            solo_id
            relevo_id
            vegetacao_id
            cidade_id
            fase_sucessional_id
            complemento

            local_coleta_id;
            variedade_id;
            tipo_id;
            situacao;
            especie_id;
            genero_id;
            familia_id;
            sub_familia_id;
            sub_especie_id;
            nome_cientifico;
            rascunho;
            colecao_anexa_id;
            cor;
            data_coleta_mes;
            data_coleta_ano; */
        });
    sequelize.transaction(callback)
        .then(() => {
            response.status(codigos.DESATIVAR).send();
        })
        .catch(next);
};

export const alteracao = (request, response, next) => {

};
