import models from '../models';
import codigos from '../resources/codigosHTTP';
import BadRequestExeption from '../errors/bad-request-exception';
import subespecie from '../validators/subespecie';

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
    Especie,
    Variedade,
    Tipo,
    Familia,
    Subfamilia,
    Genero,
    Subespecie,
    ColecaoAnexa,
} = models;

export const listagem = (request, response, next) => {
    const { limite, pagina, offset } = request.paginacao;
    const retorno = {
        metadados: {
            total: 0,
            pagina,
            limite,
        },
        resultado: {},
    };
    const callback = transaction => Promise.resolve()
        .then(() => Alteracao.findAndCountAll({
            include: [
                {
                    model: Usuario,
                    where: {
                        tipo_usuario_id: {
                            [Op.ne]: 1,
                        },
                    },
                },
            ],
            limit: limite,
            offset,
            transaction,
        }))
        .then(alteracoes => {
            retorno.metadados.total = alteracoes.count;
            retorno.resultado = alteracoes.rows.map(item => ({
                id: item.id,
                nome_usuario: item.usuario.nome,
                numero_tombo: item.tombo_hcf,
                json: JSON.parse(item.tombo_json),
                data_criacao: item.created_at,
                status: item.status,
                observacao: item.observacao || '',
            }));
            return retorno;
        });
    sequelize.transaction(callback)
        .then(() => {
            response.status(codigos.LISTAGEM).json(retorno);
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

const comparaDoisTombos = (tombo, tomboAlterado) => {
    const parametros = [];
    if (tombo.data_coleta_dia !== tomboAlterado.data_coleta_dia) {
        parametros.push({
            campo: 'Dia da coleta',
            antigo_valor: tombo.data_coleta_dia,
            novo_valor: tomboAlterado.data_coleta_dia,
        });
    }
    if (tombo.data_coleta_mes !== tomboAlterado.data_coleta_mes) {
        parametros.push({
            campo: 'Mes da coleta',
            antigo_valor: tombo.data_coleta_mes,
            novo_valor: tomboAlterado.data_coleta_mes,
        });
    }
    if (tombo.data_coleta_ano !== tomboAlterado.data_coleta_ano) {
        parametros.push({
            campo: 'Ano da coleta',
            antigo_valor: tombo.data_coleta_ano,
            novo_valor: tomboAlterado.data_coleta_ano,
        });
    }
    if (tombo.observacao !== tomboAlterado.observacao) {
        parametros.push({
            campo: 'Observação',
            antigo_valor: tombo.observacao,
            novo_valor: tomboAlterado.observacao,
        });
    }
    if (tombo.nomes_populares !== tomboAlterado.nomes_populares) {
        parametros.push({
            campo: 'Nomes populares',
            antigo_valor: tombo.nomes_populares,
            novo_valor: tomboAlterado.nomes_populares,
        });
    }
    if (tombo.numero_coleta !== tomboAlterado.numero_coleta) {
        parametros.push({
            campo: 'Numero de coleta',
            antigo_valor: tombo.numero_coleta,
            novo_valor: tomboAlterado.numero_coleta,
        });
    }
    if (tombo.latitude !== tomboAlterado.latitude) {
        parametros.push({
            campo: 'Latitude',
            antigo_valor: tombo.latitude,
            novo_valor: tomboAlterado.latitude,
        });
    }
    if (tombo.longitude !== tomboAlterado.longitude) {
        parametros.push({
            campo: 'Longitude',
            antigo_valor: tombo.longitude,
            novo_valor: tomboAlterado.longitude,
        });
    }
    if (tombo.altitude !== tomboAlterado.altitude) {
        parametros.push({
            campo: 'Altitude',
            antigo_valor: tombo.altitude,
            novo_valor: tomboAlterado.altitude,
        });
    }
    if (tombo.herbario && tomboAlterado.herbario
        && (tombo.herbario.nome !== tomboAlterado.herbario.nome)) {
        parametros.push({
            campo: 'Herbário',
            antigo_valor: tombo.herbario.nome,
            novo_valor: tomboAlterado.herbario.nome,
        });
    }
    if (tombo.locais_coletum && tomboAlterado.locais_coletum
        && tombo.locais_coletum.descricao !== tomboAlterado.locais_coletum.descricao) {
        parametros.push({
            campo: 'Descrição do local de coleta',
            antigo_valor: tombo.locais_coletum.descricao,
            novo_valor: tomboAlterado.locais_coletum.descricao,
        });
    }
    if (tombo.locais_coletum && tombo.locais_coletum.solo
        && tomboAlterado.locais_coletum && tomboAlterado.locais_coletum.solo
        && tombo.locais_coletum.solo.nome !== tomboAlterado.locais_coletum.solo.nome) {
        parametros.push({
            campo: 'Solo',
            antigo_valor: tombo.locais_coletum.solo.nome,
            novo_valor: tomboAlterado.locais_coletum.solo.nome,
        });
    }
    if (tombo.locais_coletum && tombo.locais_coletum.relevo
        && tombo.locais_coletum && tombo.locais_coletum.relevo
        && tombo.locais_coletum.relevo.nome !== tomboAlterado.locais_coletum.relevo.nome) {
        parametros.push({
            campo: 'Relevo',
            antigo_valor: tombo.locais_coletum.relevo.nome,
            novo_valor: tomboAlterado.locais_coletum.relevo.nome,
        });
    }
    if (tombo.locais_coletum && tombo.locais_coletum.vegetaco
        && tomboAlterado.locais_coletum && tomboAlterado.locais_coletum.vegetaco
        && tombo.locais_coletum.vegetaco.nome !== tomboAlterado.locais_coletum.vegetaco.nome) {
        parametros.push({
            campo: 'Vegetação',
            antigo_valor: tombo.locais_coletum.vegetaco.nome,
            novo_valor: tomboAlterado.locais_coletum.vegetaco.nome,
        });
    }
    if (tombo.locais_coletum && tombo.locais_coletum.cidade
        && tomboAlterado.locais_coletum && tomboAlterado.locais_coletum.cidade
        && tombo.locais_coletum.cidade.nome !== tomboAlterado.locais_coletum.cidade.nome) {
        parametros.push({
            campo: 'Cidade',
            antigo_valor: tombo.locais_coletum.cidade.nome,
            novo_valor: tomboAlterado.locais_coletum.cidade.nome,
        });
    }
    if (tombo.locais_coletum && tomboAlterado.locais_coletum
        && tombo.locais_coletum.fase_sucessional !== tomboAlterado.locais_coletum.fase_sucessional) {
        parametros.push({
            campo: 'Fase Sucessional',
            antigo_valor: tombo.locais_coletum.fase_sucessional,
            novo_valor: tomboAlterado.locais_coletum.fase_sucessional,
        });
    }
    if (tombo.situacao !== tomboAlterado.situacao) {
        parametros.push({
            campo: 'Situação',
            antigo_valor: tombo.situacao,
            novo_valor: tomboAlterado.situacao,
        });
    }
    if (tombo.nome_cientifico !== tomboAlterado.nome_cientifico) {
        parametros.push({
            campo: 'Nome Científico',
            antigo_valor: tombo.nome_cientifico,
            novo_valor: tomboAlterado.nome_cientifico,
        });
    }
    if (tombo.cor !== tomboAlterado.cor) {
        parametros.push({
            campo: 'Cor - Localização',
            antigo_valor: tombo.cor,
            novo_valor: tomboAlterado.cor,
        });
    }
    if (tombo.variedade && tomboAlterado.variedade
        && tombo.variedade.nome !== tomboAlterado.variedade.nome) {
        parametros.push({
            campo: 'Variedade',
            antigo_valor: tombo.variedade.nome,
            novo_valor: tomboAlterado.variedade.nome,
        });
    }
    if (tombo.tipo && tomboAlterado.tipo
        && tombo.tipo.nome !== tomboAlterado.tipo.nome) {
        parametros.push({
            campo: 'Tipo',
            antigo_valor: tombo.tipo.nome,
            novo_valor: tomboAlterado.tipo.nome,
        });
    }
    if (tombo.especy && tomboAlterado.especy
        && tombo.especy.nome !== tomboAlterado.especy.nome) {
        parametros.push({
            campo: 'Espécie',
            antigo_valor: tombo.especy.nome,
            novo_valor: tomboAlterado.especy.nome,
        });
    }
    if (tombo.genero && tomboAlterado.genero
        && tombo.genero.nome !== tomboAlterado.genero.nome) {
        parametros.push({
            campo: 'Género',
            antigo_valor: tombo.genero.nome,
            novo_valor: tomboAlterado.genero.nome,
        });
    }
    if (tombo.familia && tomboAlterado.familia
        && tombo.familia.nome !== tomboAlterado.familia.nome) {
        parametros.push({
            campo: 'Família',
            antigo_valor: tombo.familia.nome,
            novo_valor: tomboAlterado.familia.nome,
        });
    }
    if (tombo.sub_familia && tomboAlterado.sub_familia
        && tombo.sub_familia.nome !== tomboAlterado.sub_familia.nome) {
        parametros.push({
            campo: 'Subfamília',
            antigo_valor: tombo.sub_familia.nome,
            novo_valor: tomboAlterado.sub_familia.nome,
        });
    }
    if (tombo.sub_especy && tomboAlterado.sub_especy
        && tombo.sub_especy.nome !== tomboAlterado.sub_especy.nome) {
        parametros.push({
            campo: 'Subespécie',
            antigo_valor: tombo.sub_especy.nome,
            novo_valor: tomboAlterado.sub_especy.nome,
        });
    }
    if (tombo.colecoes_anexa && tomboAlterado.colecoes_anexa
        && tombo.colecoes_anexa.observacoes !== tomboAlterado.colecoes_anexa.observacoes) {
        parametros.push({
            campo: 'Observações - Coleção Anexa',
            antigo_valor: tombo.colecoes_anexa.observacoes,
            novo_valor: tomboAlterado.colecoes_anexa.observacoes,
        });
    }
    if (tombo.colecoes_anexa && tomboAlterado.colecoes_anexa
        && tombo.colecoes_anexa.tipo !== tomboAlterado.colecoes_anexa.tipo) {
        parametros.push({
            campo: 'Tipo - Coleção Anexa',
            antigo_valor: tombo.colecoes_anexa.tipo,
            novo_valor: tomboAlterado.colecoes_anexa.tipo,
        });
    }

    return parametros;
};

export const visualizarComCadastro = (alteracao, transaction) => {
    let parametros = {};

    return new Promise((resolve, reject) => {

        parametros = {
            ...parametros,
            numero_tombo: alteracao.tombo_hcf,
            numero_tombo_alteracao: JSON.parse(alteracao.tombo_json).hcf,
        };
        return Tombo.findAll({
            where: {
                hcf: {
                    [Op.in]: [alteracao.tombo_hcf, parametros.numero_tombo_alteracao],
                },
                ativo: true,
            },
            include: [
                {
                    model: Herbario,
                },
                {
                    model: Variedade,
                },
                {
                    model: Tipo,
                },
                {
                    model: Especie,
                },
                {
                    model: Familia,
                },
                {
                    model: Subfamilia,
                },
                {
                    model: Genero,
                },
                {
                    model: Subespecie,
                },
                {
                    model: ColecaoAnexa,
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
        })
            .then(tombos => {
                parametros = {
                    ...parametros,
                    retorno: [],
                };
                if (tombos.length === 2) {
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
                    parametros.retorno = comparaDoisTombos(parametros.tombo, parametros.tombo_alterado);
                }
                resolve(parametros);
            })
            .catch(reject);
    });
};

export const visualizarComJsonId = (alteracao, hcf, transaction) => {
    const parametros = {};

    return new Promise((resolve, reject) => Familia.findOne({
        where: {
            id: alteracao.familia_id,
        },
        transaction,
    })
        .then(familia => {
            parametros.familia = familia;
        })
        .then(() => {
            if (alteracao.subfamilia_id) {
                return Subfamilia.findOne({
                    where: {
                        id: alteracao.subfamilia_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subfamilia => {
            if (subfamilia) {
                parametros.subfamilia = subfamilia;
            }
            if (alteracao.genero_id) {
                return Genero.findOne({
                    where: {
                        id: alteracao.genero_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(genero => {
            if (genero) {
                parametros.genero = genero;
            }
            if (alteracao.especie_id) {
                return Especie.findOne({
                    where: {
                        id: alteracao.especie_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(especie => {
            if (especie) {
                parametros.especie = especie;
            }
            if (alteracao.variedade_id) {
                return Variedade.findOne({
                    where: {
                        id: alteracao.variedade_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(variedade => {
            if (variedade) {
                parametros.variedade = variedade;
            }
            if (alteracao.subespecie_id) {
                return Subespecie.findOne({
                    where: {
                        id: alteracao.subespecie_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subesp => {
            if (subesp) {
                parametros.subespecie = subespecie;
            }
            return Tombo.findOne({
                where: {
                    hcf,
                    ativo: true,
                },
                include: [
                    {
                        model: Variedade,
                    },
                    {
                        model: Especie,
                    },
                    {
                        model: Familia,
                    },
                    {
                        model: Subfamilia,
                    },
                    {
                        model: Genero,
                    },
                    {
                        model: Subespecie,
                    },
                ],
                transaction,
            });
        })
        .then(tombos => {
            // eslint-disable-next-line
            var jsonRetorno = [];
            if (tombos.especy) {
                if (parametros.especie) {
                    if (tombos.especy.id !== parametros.especie.id) {
                        jsonRetorno.push({
                            key: '1',
                            campo: 'Especie',
                            antigo: tombos.especy.nome,
                            novo: parametros.especie.nome,
                        });
                    }
                }
            }
            if (tombos.familia) {
                if (parametros.familia) {
                    if (tombos.familia.id !== parametros.familia.id) {
                        jsonRetorno.push({
                            key: '2',
                            campo: 'Familia',
                            antigo: tombos.familia.nome,
                            novo: parametros.familia.nome,
                        });
                    }
                }
            }
            if (tombos.genero) {
                if (parametros.genero) {
                    if (tombos.genero.id !== parametros.genero.id) {
                        jsonRetorno.push({
                            key: '3',
                            campo: 'Gênero',
                            antigo: tombos.genero.nome,
                            novo: parametros.genero.nome,
                        });
                    }
                }
            }
            if (tombos.variedade) {
                if (parametros.variedade) {
                    if (tombos.variedade.id !== parametros.variedade.id) {
                        jsonRetorno.push({
                            key: '4',
                            campo: 'Variedade',
                            antigo: tombos.variedade.nome,
                            novo: parametros.variedade.nome,
                        });
                    }
                }
            }
            if (tombos.sub_especy) {
                if (parametros.subespecie) {
                    if (tombos.sub_especy.id !== parametros.subespecie.id) {
                        jsonRetorno.push({
                            key: '5',
                            campo: 'Subespecie',
                            antigo: tombos.sub_especy.nome,
                            novo: parametros.subespecie.nome,
                        });
                    }
                }
            }
            if (tombos.sub_familia) {
                if (parametros.subfamilia) {
                    if (tombos.sub_familia.id !== parametros.subfamilia.id) {
                        jsonRetorno.push({
                            key: '6',
                            campo: 'Subfamilia',
                            antigo: tombos.sub_familia.nome,
                            novo: parametros.subfamilia.nome,
                        });
                    }
                }
            }
            resolve(jsonRetorno);
        })
        .catch(reject));
};

export const aprovarComJsonId = (alteracao, hcf, transaction) => {
    const parametros = {};

    return new Promise((resolve, reject) => Familia.findOne({
        where: {
            id: alteracao.familia_id,
        },
        transaction,
    })
        .then(familia => {
            parametros.familia = familia;
        })
        .then(() => {
            if (alteracao.subfamilia_id) {
                return Subfamilia.findOne({
                    where: {
                        id: alteracao.subfamilia_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subfamilia => {
            if (subfamilia) {
                parametros.subfamilia = subfamilia;
            }
            if (alteracao.genero_id) {
                return Genero.findOne({
                    where: {
                        id: alteracao.genero_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(genero => {
            if (genero) {
                parametros.genero = genero;
            }
            if (alteracao.especie_id) {
                return Especie.findOne({
                    where: {
                        id: alteracao.especie_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(especie => {
            if (especie) {
                parametros.especie = especie;
            }
            if (alteracao.variedade_id) {
                return Variedade.findOne({
                    where: {
                        id: alteracao.variedade_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(variedade => {
            if (variedade) {
                parametros.variedade = variedade;
            }
            if (alteracao.subespecie_id) {
                return Subespecie.findOne({
                    where: {
                        id: alteracao.subespecie_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subesp => {
            if (subesp) {
                parametros.subespecie = subespecie;
            }
            const update = {};
            if (parametros.familia) {
                update.familia_id = parametros.familia.id;
                update.nome_cientifico = `${parametros.familia.nome} `;
            }
            if (parametros.subfamilia) {
                update.sub_familia_id = parametros.subfamilia.id;
                update.nome_cientifico += `${parametros.subfamilia.nome} `;
            }
            if (parametros.genero) {
                update.genero_id = parametros.genero.id;
                update.nome_cientifico += `${parametros.genero.nome} `;
            }
            if (parametros.especie) {
                update.especie_id = parametros.especie.id;
                update.nome_cientifico += `${parametros.especie.nome} `;
            }
            if (parametros.subespecie) {
                update.sub_especie_id = parametros.subespecie.id;
                update.nome_cientifico += `${parametros.subespecie.nome} `;
            }
            if (parametros.variedade) {
                update.variedade_id = parametros.variedade.id;
                update.nome_cientifico += `${parametros.variedade.nome}`;
            }
            return Tombo.update(update, {
                where: {
                    hcf,
                    ativo: true,
                },
                transaction,
            });
        })
        .then(() => {
            resolve(true);
        })
        .catch(reject));
};

export const aprovarComJsonNome = (alteracao, hcf, transaction) => {
    const parametros = {};

    return new Promise((resolve, reject) => Familia.findOne({
        where: {
            nome: { [Op.like]: `%${alteracao.familia_nome}%` },
        },
        transaction,
    })
        .then(familia => {
            if (familia) {
                return familia;
            }
            return Familia.create({ nome: alteracao.familia_nome }, transaction);
        })
        .then(familia => {
            if (familia) {
                parametros.familia = familia;
            }
            if (alteracao.subfamilia_nome) {
                return Subfamilia.findOne({
                    where: {
                        nome: { [Op.like]: `%${alteracao.subfamilia_nome}%` },
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subfamilia => {
            if (subfamilia) {
                parametros.subfamilia = subfamilia;
            } else if (alteracao.subfamilia_nome) {
                return Subfamilia.create({ nome: alteracao.subfamilia_nome }, transaction);
            }
            return undefined;
        })
        .then(subfamilia => {
            if (subfamilia) {
                parametros.subfamilia = subfamilia;
            }
            if (alteracao.genero_nome) {
                return Genero.findOne({
                    where: {
                        nome: { [Op.like]: `%${alteracao.genero_nome}%` },
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(genero => {
            if (genero) {
                parametros.genero = genero;
            } else if (alteracao.genero_nome) {
                return Genero.create({
                    where: {
                        nome: { [Op.like]: `%${alteracao.genero_nome}%` },
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(genero => {
            if (alteracao.genero_nome) {
                parametros.genero = genero;
            }
            if (alteracao.especie_nome) {
                return Especie.findOne({
                    where: {
                        nome: { [Op.like]: `%${alteracao.especie_nome}%` },
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(especie => {
            if (especie) {
                parametros.especie = especie;
            } else if (alteracao.especie_nome) {
                return Especie.create({
                    where: {
                        nome: { [Op.like]: `%${alteracao.especie_nome}%` },
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(especie => {
            if (alteracao.especie_nome) {
                parametros.especie = especie;
            }
            if (alteracao.subespecie_nome) {
                return Subespecie.findOne({
                    where: {
                        nome: { [Op.like]: `%${alteracao.subespecie_nome}%` },
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subspecie => {
            if (subspecie) {
                parametros.subespecie = subspecie;
            } else if (alteracao.subespecie_nome) {
                return Subespecie.create({
                    where: {
                        nome: { [Op.like]: `%${alteracao.subespecie_nome}%` },
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subspecie => {
            if (alteracao.subespecie_nome) {
                parametros.subespecie = subspecie;
            }
            if (alteracao.variedade_nome) {
                return Variedade.findOne({
                    where: {
                        nome: { [Op.like]: `%${alteracao.variedade_nome}%` },
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(variedade => {
            if (variedade) {
                parametros.variedade = variedade;
            } else if (alteracao.variedade_nome) {
                return Variedade.create({
                    where: {
                        nome: { [Op.like]: `%${alteracao.variedade_nome}%` },
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(variedade => {
            if (alteracao.variedade_nome) {
                parametros.variedade = variedade;
            }
            const update = {};
            if (parametros.familia) {
                update.familia_id = parametros.familia.id;
                update.nome_cientifico = `${parametros.familia.nome} `;
            }
            if (parametros.subfamilia) {
                update.sub_familia_id = parametros.subfamilia.id;
                update.nome_cientifico += `${parametros.subfamilia.nome} `;
            }
            if (parametros.genero) {
                update.genero_id = parametros.genero.id;
                update.nome_cientifico += `${parametros.genero.nome} `;
            }
            if (parametros.especie) {
                update.especie_id = parametros.especie.id;
                update.nome_cientifico += `${parametros.especie.nome} `;
            }
            if (parametros.subespecie) {
                update.sub_especie_id = parametros.subespecie.id;
                update.nome_cientifico += `${parametros.subespecie.nome} `;
            }
            if (parametros.variedade) {
                update.variedade_id = parametros.variedade.id;
                update.nome_cientifico += `${parametros.variedade.nome}`;
            }
            return Tombo.update(update, {
                where: {
                    hcf,
                    ativo: true,
                },
                transaction,
            });
        })
        .then(() => {
            resolve(true);
        })
        .catch(reject));
};

export const aprovarComCadastroJson = (alteracao, hcf, transaction) => true;

export const aprovarComCadastro = (hcf, transaction) => new Promise((resolve, reject) => Tombo.update({
    rascunho: 0,
}, {
    where: {
        hcf,
    },
    transaction,
})
    .then(() => {
        resolve(true);
    })
    .catch(reject));

export const visualizarComJsonNome = (alteracao, hcf, transaction) => new Promise((resolve, reject) => Tombo.findOne({
    where: {
        hcf,
        ativo: true,
    },
    include: [
        {
            model: Variedade,
        },
        {
            model: Especie,
        },
        {
            model: Familia,
        },
        {
            model: Subfamilia,
        },
        {
            model: Genero,
        },
        {
            model: Subespecie,
        },
    ],
    transaction,
})
    .then(tombos => {
        // eslint-disable-next-line
            var jsonRetorno = [];
        if (tombos.especy) {
            if (alteracao.especie_nome) {
                if (tombos.especy.nome !== alteracao.especie_nome) {
                    jsonRetorno.push({
                        key: '1',
                        campo: 'Especie',
                        antigo: tombos.especy.nome,
                        novo: alteracao.especie_nome,
                    });
                }
            }
        }
        if (tombos.familia) {
            if (alteracao.familia_nome) {
                if (tombos.familia.nome !== alteracao.familia_nome) {
                    jsonRetorno.push({
                        key: '2',
                        campo: 'Familia',
                        antigo: tombos.familia.nome,
                        novo: alteracao.familia_nome,
                    });
                }
            }
        }
        if (tombos.genero) {
            if (alteracao.genero_nome) {
                if (tombos.genero.nome !== alteracao.genero_nome) {
                    jsonRetorno.push({
                        key: '3',
                        campo: 'Gênero',
                        antigo: tombos.genero.nome,
                        novo: alteracao.genero_nome,
                    });
                }
            }
        }
        if (tombos.variedade) {
            if (alteracao.variedade_nome) {
                if (tombos.variedade.nome !== alteracao.variedade_nome) {
                    jsonRetorno.push({
                        key: '4',
                        campo: 'Variedade',
                        antigo: tombos.variedade.nome,
                        novo: alteracao.variedade_nome,
                    });
                }
            }
        }
        if (tombos.sub_especy) {
            if (alteracao.subespecie_nome) {
                if (tombos.sub_especy.nome !== alteracao.subespecie_nome) {
                    jsonRetorno.push({
                        key: '5',
                        campo: 'Subespecie',
                        antigo: tombos.sub_especy.nome,
                        novo: alteracao.subespecie_nome,
                    });
                }
            }
        }
        if (tombos.sub_familia) {
            if (alteracao.subfamilia_nome) {
                if (tombos.sub_familia.nome !== alteracao.subfamilia_nome) {
                    jsonRetorno.push({
                        key: '6',
                        campo: 'Subfamilia',
                        antigo: tombos.sub_familia.nome,
                        novo: alteracao.subfamilia_nome,
                    });
                }
            }
        }
        resolve(jsonRetorno);
    })
    .catch(reject));

export function visualizar(request, response, next) {
    const id = request.params.pendencia_id;
    let retorno = {};
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
            const objetoAlterado = JSON.parse(alteracao.tombo_json);
            if (objetoAlterado.hcf) {
                return visualizarComCadastro(alteracao, transaction);
            }
            if (objetoAlterado.familia_id) {
                retorno = visualizarComJsonId(objetoAlterado, alteracao.tombo_hcf, transaction);
            } else {
                retorno = visualizarComJsonNome(objetoAlterado, alteracao.tombo_hcf, transaction);
            }
            return retorno;
        });
    sequelize.transaction(callback)
        .then(() => {
            // eslint-disable-next-line no-underscore-dangle
            response.status(codigos.LISTAGEM).json({
                fotos: {
                    novas: [],
                    antigas: [],
                },
                // eslint-disable-next-line no-underscore-dangle
                tabela: retorno._rejectionHandler0,
            });
        })
        .catch(next);

}

export function aceitarPendencia(request, response, next) {
    const id = request.params.pendencia_id;
    const { observacao, status } = request.body;
    let retorno = {};
    const callback = transaction => Promise.resolve()
        .then(() => Alteracao.update({
            observacao,
            status,
        }, {
            where: {
                ativo: true,
                id,
            },
            transaction,
        }))
        .then(() => Alteracao.findOne({
            where: {
                ativo: true,
                id,
            },
            transaction,
        }))
        .then(alt => {
            if (status === 'APROVADO') {
                if (alt.tombo_json === '') {
                    return aprovarComCadastro(alt.tombo_hcf, transaction);
                }
                const objetoAlterado = JSON.parse(alt.tombo_json);
                if (objetoAlterado.hcf) {
                    return aprovarComCadastroJson(objetoAlterado, alt.tombo_hcf, transaction);
                }
                if (objetoAlterado.familia_id) {
                    retorno = aprovarComJsonId(objetoAlterado, alt.tombo_hcf, transaction);
                } else {
                    retorno = aprovarComJsonNome(objetoAlterado, alt.tombo_hcf, transaction);
                }
            }
            return retorno;
        });
    sequelize.transaction(callback)
        .then(() => {
            // eslint-disable-next-line no-underscore-dangle
            response.status(codigos.LISTAGEM).json({
                fotos: {
                    novas: [],
                    antigas: [],
                },
                // eslint-disable-next-line no-underscore-dangle
                tabela: retorno._rejectionHandler0,
            });
        })
        .catch(next);

}
