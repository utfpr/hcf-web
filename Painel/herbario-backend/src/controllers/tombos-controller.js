// @ts-nocheck
import moment from 'moment-timezone';
import BadRequestExeption from '../errors/bad-request-exception';
import NotFoundExeption from '../errors/not-found-exception';
import models from '../models';
import codigos from '../resources/codigosHTTP';
import pick from '../helpers/pick';
import { converteParaDecimal } from '../helpers/coordenadas';

const {
    Solo, Relevo, Cidade, Vegetacao, FaseSucessional, Pais, Tipo, LocalColeta, Familia, sequelize,
    Genero, Subfamilia, Autor, Coletor, Variedade, Subespecie, Usuario,
    ColecaoAnexa, Especie, Herbario, Tombo, Alteracao, TomboColetor, Sequelize: { Op },
} = models;

export const cadastro = (request, response, next) => {
    const {
        principal, taxonomia, localidade,
        paisagem, identificacao, coletores,
        colecoes_anexas: colecoesAnexas, observacoes,
    } = request.body;

    const callback = transaction => Promise.resolve()
        .then(() => {
            if (!paisagem || !paisagem.solo_id) {
                return undefined;
            }

            const where = {
                id: paisagem.solo_id,
            };

            return Solo.findOne({ where, transaction });
        })
        .then(solo => {
            if (paisagem && paisagem.solo_id) {
                if (!solo) {
                    throw new BadRequestExeption(528);
                }
            }
            if (paisagem && paisagem.relevo_id) {
                return Relevo.findOne({
                    where: {
                        id: paisagem.relevo_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(relevo => {
            if (paisagem && paisagem.relevo_id) {
                if (!relevo) {
                    throw new BadRequestExeption(529);
                }
            }
            if (paisagem && paisagem.vegetacao_id) {
                return Vegetacao.findOne({
                    where: {
                        id: paisagem.vegetacao_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(vegetacao => {
            if (paisagem && paisagem.vegetacao_id) {
                if (!vegetacao) {
                    throw new BadRequestExeption(530);
                }
            }
            if (paisagem && paisagem.fase_sucessional_id) {
                return FaseSucessional.findOne({
                    where: {
                        id: paisagem.fase_sucessional_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(fase => {
            if (paisagem && paisagem.fase_sucessional_id) {
                if (!fase) {
                    throw new BadRequestExeption(531);
                }
            }
            return undefined;
        })
        .then(() => {
            let json = {};
            // /////////CRIA LOCAL DE COLETA////////////
            if (paisagem) {
                json = pick(paisagem, ['descricao', 'solo_id', 'relevo_id', 'vegetacao_id', 'fase_sucessional_id']);
            }
            json.cidade_id = localidade.cidade_id;
            return LocalColeta.create(json, { transaction });
        })
        .then(localColeta => {
            if (!localColeta) {
                throw new BadRequestExeption(400);
            }
            principal.local_coleta_id = localColeta.id;
        })
        // //////////////CRIA COLECOES ANEXAS///////////
        .then(() => {
            if (colecoesAnexas) {
                const object = pick(colecoesAnexas, ['tipo', 'observacoes']);
                return ColecaoAnexa.create(object, { transaction });
            }
            return undefined;
        })
        .then(colecao => {
            if (colecoesAnexas) {
                if (!colecao) {
                    throw new BadRequestExeption(401);
                }
                colecoesAnexas.id = colecao.id;
            }
            return undefined;
        })
        // ///////// VALIDA A TAXONOMIA E A INSERE NO NOME CIENTIFICO //////////
        .then(() => {
            if (taxonomia && taxonomia.familia_id) {
                return Familia.findOne({
                    where: {
                        id: taxonomia.familia_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(familia => {
            if (taxonomia && taxonomia.familia_id) {
                if (!familia) {
                    throw new BadRequestExeption(402);
                }
                taxonomia.nome_cientifico = familia.nome;
            }
            return undefined;
        })
        .then(() => {
            if (taxonomia && taxonomia.subfamilia_id) {
                return Subfamilia.findOne({
                    where: {
                        id: taxonomia.subfamilia_id,
                        familia_id: taxonomia.familia_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subfamilia => {
            if (taxonomia && taxonomia.subfamilia_id) {
                if (!subfamilia) {
                    throw new BadRequestExeption(403);
                }
                taxonomia.nome_cientifico += ` ${subfamilia.nome}`;
            }
            return undefined;
        })
        .then(() => {
            if (taxonomia && taxonomia.genero_id) {
                return Genero.findOne({
                    where: {
                        id: taxonomia.genero_id,
                        familia_id: taxonomia.familia_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(genero => {
            if (taxonomia && taxonomia.genero_id) {
                if (!genero) {
                    throw new BadRequestExeption(404);
                }
                taxonomia.nome_cientifico += ` ${genero.nome}`;
            }
            return undefined;
        })
        .then(() => {
            if (taxonomia && taxonomia.especie_id) {
                return Especie.findOne({
                    where: {
                        id: taxonomia.especie_id,
                        genero_id: taxonomia.genero_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(especie => {
            if (taxonomia && taxonomia.especie_id) {
                if (!especie) {
                    throw new BadRequestExeption(405);
                }
                taxonomia.nome_cientifico += ` ${especie.nome}`;
            }
            return undefined;
        })
        .then(() => {
            if (taxonomia && taxonomia.subespecie_id) {
                return Subespecie.findOne({
                    where: {
                        id: taxonomia.subespecie_id,
                        especie_id: taxonomia.especie_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subespecie => {
            if (taxonomia && taxonomia.subespecie_id) {
                if (!subespecie) {
                    throw new BadRequestExeption(406);
                }
                taxonomia.nome_cientifico += ` ${subespecie.nome}`;
            }
            return undefined;
        })
        .then(() => {
            if (taxonomia && taxonomia.variedade_id) {
                return Variedade.findOne({
                    where: {
                        id: taxonomia.variedade_id,
                        especie_id: taxonomia.especie_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(variedade => {
            if (taxonomia && taxonomia.variedade_id) {
                if (!variedade) {
                    throw new BadRequestExeption(407);
                }
                taxonomia.nome_cientifico += ` ${variedade.nome}`;
            }
            return undefined;
        })
        // /////////// CADASTRA TOMBO /////////////
        .then(() => {
            let jsonTombo = { // eslint-disable-line
                data_coleta_dia: principal.data_coleta.dia, // dia mes ano
                data_coleta_mes: principal.data_coleta.mes,
                data_coleta_ano: principal.data_coleta.ano,
                numero_coleta: principal.numero_coleta, // sim
                local_coleta_id: principal.local_coleta_id, // sim
                cor: principal.cor, // sim
            };
            if (observacoes) {
                jsonTombo.observacao = observacoes;
            }
            if (principal.nome_popular) {
                jsonTombo.nomes_populares = principal.nome_popular;
            }
            if (localidade.latitude) {
                jsonTombo.latitude = converteParaDecimal(localidade.latitude);
            }
            if (localidade.longitude) {
                jsonTombo.longitude = converteParaDecimal(localidade.longitude);
            }
            if (localidade.altitude) {
                jsonTombo.altitude = localidade.altitude;
            }
            jsonTombo = {
                ...jsonTombo,
                ...pick(principal, ['entidade_id', 'tipo_id', 'taxon_id']),
            };
            if (taxonomia) {
                jsonTombo = {
                    ...jsonTombo,
                    ...pick(taxonomia, [
                        'nome_cientifico',
                        'variedade_id',
                        'especie_id',
                        'genero_id',
                        'familia_id',
                        'subfamilia_id',
                        'subespecie_id',
                    ]),
                };
            }
            if (colecoesAnexas && colecoesAnexas.id) { // is
                jsonTombo.colecao_anexa_id = colecoesAnexas.id;
            }
            if (request.usuario.tipo_usuario_id === 2) {
                jsonTombo.rascunho = true;
            }
            return Tombo.create(jsonTombo, { transaction });
        })
        // //////////// CADASTRA A IDENTIFICACAO ///////////
        .then(tombo => {
            if (!tombo) {
                throw new BadRequestExeption(408);
            }
            principal.hcf = tombo.hcf;
            if (identificacao && identificacao.identificador_id) {
                return Alteracao.create({
                    tombo_hcf: tombo.hcf,
                    usuario_id: identificacao.identificador_id,
                    status: 'APROVADO',
                    data_identificacao_dia: identificacao.data_identificacao.dia || moment().day(),
                    data_identificacao_mes: identificacao.data_identificacao.mes || moment().month(),
                    data_identificacao_ano: identificacao.data_identificacao.ano || moment().year(),
                }, { transaction });
            }
            return undefined;
        })
        // /////////////// CADASTRA O COLETOR ///////////////
        .then(ident => {
            if (identificacao && identificacao.identificador_id) {
                if (!ident) {
                    throw new BadRequestExeption(409);
                }
            }

            let jsonColetores = []; // eslint-disable-line
            for (let i = 0; i < coletores.length; i++) { // eslint-disable-line
                jsonColetores.push({
                    tombo_hcf: principal.hcf,
                    coletor_id: coletores[i],
                });
            }
            return TomboColetor.bulkCreate(jsonColetores, { transaction });
        })
        .then(coletoresCad => {
            if (!coletoresCad) {
                throw new BadRequestExeption(410);
            }
        })
        // ////////////// CADASTRA O TOMBO COMO ALTERAÇÃO PRA CASO DE SER OPERADOR
        .then(() => {
            if (request.usuario.tipo_usuario_id === 2) {
                return Alteracao.create({
                    tombo_hcf: principal.hcf,
                    usuario_id: request.usuario.id,
                    status: 'ESPERANDO',
                }, { transaction });
            }
            return undefined;
        })
        .then(alteracao => {
            if (request.usuario.tipo_usuario_id === 2) {
                if (!alteracao) {
                    throw new BadRequestExeption(411);
                }
            }
            return undefined;
        });
    sequelize.transaction(callback)
        .then(() => {
            response.status(codigos.CADASTRO_RETORNO).json({
                hcf: principal.hcf,
            });
        })
        .catch(next);
};

export const desativar = (request, response, next) => {
    const { params } = request;

    Promise.resolve()
        .then(() => {
            const where = {
                ativo: true,
                hcf: params.tombo_id,
            };

            return Tombo.findOne({ where });
        })
        .then(tombo => {
            if (!tombo) {
                throw new NotFoundExeption(416);
            }

            const where = {
                ativo: true,
                hcf: params.tombo_id,
            };

            return Tombo.update({ ativo: false }, { where });
        })
        .then(() => {
            response.status(204)
                .send();
        })
        .catch(next);
};

export const listagem = (request, response, next) => {
    const { pagina, limite, offset } = request.paginacao;
    const {
        nome_cientifico: nomeCientifico, hcf, tipo, nome_popular: nomePopular, situacao,
    } = request.query;
    let where = {
        ativo: true,
        rascunho: 0,
    };

    if (nomeCientifico) {
        where = {
            ...where,
            nome_cientifico: { [Op.like]: `%${nomeCientifico}%` },
        };
    }

    if (hcf) {
        where = {
            ...where,
            hcf,
        };
    }

    if (tipo) {
        where = {
            ...where,
            tipo_id: tipo,
        };
    }

    if (nomePopular) {
        where = {
            ...where,
            nomes_populares: { [Op.like]: `%${nomePopular}%` },
        };
    }

    if (situacao) {
        where = {
            ...where,
            situacao,
        };
    }

    let retorno = {  // eslint-disable-line
        metadados: {
            total: 0,
            pagina,
            limite,
        },
        tombos: [],
    };
    Promise.resolve()
        .then(() => Tombo.findAndCountAll({
            attributes: [
                'hcf',
                'nomes_populares',
                'nome_cientifico',
                'data_coleta_dia',
                'data_coleta_mes',
                'data_coleta_ano',
            ],
            include: [
                {
                    model: Coletor,
                    attributes: ['id', 'nome'],
                },
            ],
            where,
        }))
        .then(listaTombos => {
            retorno.metadados.total = listaTombos.rows.length;
        })
        .then(() => Tombo.findAndCountAll({
            attributes: [
                'hcf',
                'nomes_populares',
                'nome_cientifico',
                'data_coleta_dia',
                'data_coleta_mes',
                'data_coleta_ano',
            ],
            include: [
                {
                    model: Coletor,
                    attributes: ['id', 'nome'],
                },
            ],
            where,
            limit: limite,
            offset,
        }))
        .then(listaTombos => {
            retorno.tombos = listaTombos.rows;
            response.status(codigos.LISTAGEM)
                .json(retorno);
        })
        .catch(next);
};

export const getDadosCadTombo = (request, response, next) => {
    const retorno = {};
    const callback = transaction => Promise.resolve()
        .then(() => Tombo.findAndCountAll({
            attributes: ['hcf', 'numero_coleta'],
            order: [['numero_coleta', 'DESC']],
            transaction,
        }))
        .then(tombos => {
            if (!tombos) {
                throw new BadRequestExeption(202);
            }
            retorno.numero_coleta = (tombos.rows[0].numero_coleta) + 1;
        })
        .then(() => Herbario.findAndCountAll({
            attributes: ['id', 'nome', 'sigla'],
            where: {
                ativo: true,
            },
            order: [['nome', 'ASC']],
            transaction,
        }))
        .then(herbario => {
            if (!herbario) {
                throw new BadRequestExeption(203);
            }
            retorno.herbarios = herbario.rows;
        })
        .then(() => Tipo.findAndCountAll({
            attributes: ['id', 'nome'],
            order: [['nome', 'ASC']],
            transaction,
        }))
        .then(tipos => {
            if (!tipos) {
                throw new BadRequestExeption(204);
            }
            retorno.tipos = tipos.rows;
        })
        .then(() => Pais.findAndCountAll({
            attributes: ['sigla', 'nome'],
            order: [['nome', 'ASC']],
            transaction,
        }))
        .then(paises => {
            if (!paises) {
                throw new BadRequestExeption(205);
            }
            retorno.paises = paises.rows;
        })
        .then(() => Familia.findAndCountAll({
            attributes: ['id', 'nome'],
            order: [['nome', 'ASC']],
            where: {
                ativo: true,
            },
            transaction,
        }))
        .then(familias => {
            if (!familias) {
                throw new BadRequestExeption(206);
            }
            retorno.familias = familias.rows;
        })
        .then(() => Solo.findAndCountAll({
            attributes: ['id', 'nome'],
            order: [['nome', 'ASC']],
            transaction,
        }))
        .then(solos => {
            if (!solos) {
                throw new BadRequestExeption(207);
            }
            retorno.solos = solos.rows;
        })
        .then(() => Relevo.findAndCountAll({
            attributes: ['id', 'nome'],
            order: [['nome', 'ASC']],
            transaction,
        }))
        .then(relevos => {
            if (!relevos) {
                throw new BadRequestExeption(208);
            }
            retorno.relevos = relevos.rows;
        })
        .then(() => Vegetacao.findAndCountAll({
            attributes: ['id', 'nome'],
            order: [['nome', 'ASC']],
            transaction,
        }))
        .then(vegetacoes => {
            if (!vegetacoes) {
                throw new BadRequestExeption(209);
            }
            retorno.vegetacoes = vegetacoes.rows;
        })
        .then(() => FaseSucessional.findAndCountAll({
            attributes: ['numero', 'nome'],
            order: [['nome', 'ASC']],
            transaction,
        }))
        .then(fases => {
            if (!fases) {
                throw new BadRequestExeption(210);
            }
            retorno.fases = fases.rows;
        })
        .then(() => Usuario.findAndCountAll({
            attributes: ['id', 'nome'],
            order: [['nome', 'ASC']],
            where: {
                ativo: true,
            },
            transaction,
        }))
        .then(usuarios => {
            if (!usuarios) {
                throw new BadRequestExeption(211);
            }
            retorno.identificadores = usuarios.rows;
        })
        .then(() => Coletor.findAndCountAll({
            attributes: ['id', 'nome'],
            order: [['nome', 'ASC']],
            where: {
                ativo: true,
            },
            transaction,
        }))
        .then(coletores => {
            if (!coletores) {
                throw new BadRequestExeption(212);
            }
            retorno.coletores = coletores.rows;
        })
        .then(() => Autor.findAndCountAll({
            attributes: ['id', 'nome'],
            order: [['nome', 'ASC']],
            where: {
                ativo: true,
            },
            transaction,
        }))
        .then(autores => {
            if (!autores) {
                throw new BadRequestExeption(213);
            }
            retorno.autores = autores.rows;
            return retorno;
        });
    sequelize.transaction(callback)
        .then(() => {
            response.status(codigos.BUSCAR_VARIOS_ITENS)
                .json(retorno);

        }).catch(next);
};

export const cadastrarTipo = (request, response, next) => {
    const callback = transaction => Promise.resolve()
        .then(() => Tipo.findOne({
            where: {
                nome: request.body.nome,
            },
            transaction,
        }))
        .then(tipoEncontrado => {
            if (tipoEncontrado) {
                throw new BadRequestExeption(412);
            }
        })
        .then(() => Tipo.create(
            {
                nome: request.body.nome,
            },
            transaction,
        ));
    sequelize.transaction(callback)
        .then(tipo => {
            response.status(codigos.CADASTRO_SEM_RETORNO).send();
        })
        .catch(next);
};

export const buscarTipos = (request, response, next) => {
    Promise.resolve()
        .then(() => Tipo.findAndCountAll({
            attributes: ['id', 'nome'],
        }))
        .then(tipos => {
            response.status(codigos.LISTAGEM).json(tipos.rows);
        })
        .catch(next);
};

export const cadastrarColetores = (request, response, next) => {
    const callback = transaction => Promise.resolve()
        .then(() => Coletor.findOne({
            where: {
                nome: request.body.nome,
                email: request.body.email,
                numero: request.body.numero,
            },
            transaction,
        }))
        .then(coletorEncontrado => {
            if (coletorEncontrado) {
                throw new BadRequestExeption(413);
            }
        })
        .then(() => Coletor.create({
            nome: request.body.nome,
            email: request.body.email,
            numero: request.body.numero,
        }, transaction));
    sequelize.transaction(callback)
        .then(coletor => {
            if (!coletor) {
                throw new BadRequestExeption(414);
            }
            response.status(codigos.CADASTRO_SEM_RETORNO).send();
        })
        .catch(next);
};

export const buscarColetores = (request, response, next) => {
    Promise.resolve()
        .then(() => Coletor.findAndCountAll({
            attributes: ['id', 'nome', 'email', 'numero'],
            where: {
                ativo: 1,
            },
        }))
        .then(coletores => {
            if (!coletores) {
                throw new BadRequestExeption(415);
            }
            response.status(codigos.LISTAGEM).json(coletores.rows);
        })
        .catch(next);
};

export const buscarProximoNumeroColetor = (request, response, next) => {
    Promise.resolve()
        .then(() => Coletor.findAndCountAll({
            attributes: ['id', 'nome', 'email', 'numero'],
            order: [['numero', 'DESC']],
        }))
        .then(coletores => {
            if (!coletores) {
                throw new BadRequestExeption(214);
            }
            response.status(codigos.LISTAGEM).json({
                numero: coletores.rows[0].numero + 1,
            });
        })
        .catch(next);
};

export const obterTombo = (request, response, next) => {
    const id = request.params.tombo_id;

    Promise.resolve()
        .then(() => Tombo.findOne({
            where: {
                hcf: id,
                ativo: true,
                rascunho: 0,
            },
            attributes: [
                'cor',
                'data_coleta_mes',
                'data_coleta_ano',
                'situacao',
                'nome_cientifico',
                'hcf',
                'data_tombo',
                'data_coleta_dia',
                'observacao',
                'nomes_populares',
                'numero_coleta',
                'latitude',
                'longitude',
                'altitude',
            ],
            include: [
                {
                    model: Herbario,
                },
                {
                    model: Usuario,
                    attributes: ['id', 'nome'],
                },
                {
                    model: LocalColeta,
                    include: [
                        {
                            model: Cidade,
                            attributes: {
                                exclude: ['updated_at', 'created_at'],
                            },
                        },
                        {
                            model: FaseSucessional,
                            attributes: {
                                exclude: ['updated_at', 'created_at'],
                            },
                        },
                        {
                            model: Solo,
                            attributes: {
                                exclude: ['updated_at', 'created_at'],
                            },
                        },
                        {
                            model: Relevo,
                            attributes: {
                                exclude: ['updated_at', 'created_at'],
                            },
                        },
                        {
                            model: Vegetacao,
                            attributes: {
                                exclude: ['updated_at', 'created_at'],
                            },
                        },
                    ],
                },
                {
                    model: Variedade,
                    include: {
                        model: Autor,
                        attributes: {
                            exclude: ['updated_at', 'created_at', 'ativo'],
                        },
                    },
                },
                {
                    model: Tipo,
                    attributes: ['id', 'nome'],
                },
                {
                    model: Especie,
                    include: {
                        model: Autor,
                        attributes: {
                            exclude: ['updated_at', 'created_at', 'ativo'],
                        },
                    },
                },
                {
                    model: ColecaoAnexa,
                },
                {
                    model: Coletor,
                    attributes: ['id', 'nome'],
                },
                {
                    model: Genero,
                },
                {
                    model: Familia,
                },
                {
                    model: Subfamilia,
                },
                {
                    model: Subespecie,
                    include: {
                        model: Autor,
                        attributes: {
                            exclude: ['updated_at', 'created_at', 'ativo'],
                        },
                    },
                },
            ],

        }))
        .then(tombo => {
            if (!tombo) {
                throw new BadRequestExeption(416);
            }

            response.status(codigos.BUSCAR_UM_ITEM)
                .json(tombo);
        })
        .catch(next);
};

export default {};
