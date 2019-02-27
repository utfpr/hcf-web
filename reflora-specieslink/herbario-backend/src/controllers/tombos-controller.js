// @ts-nocheck
import moment from 'moment-timezone';
import BadRequestExeption from '../errors/bad-request-exception';
import NotFoundExeption from '../errors/not-found-exception';
import models from '../models';
import codigos from '../resources/codigosHTTP';
import pick from '../helpers/pick';
import { converteParaDecimal } from '../helpers/coordenadas';
import { converteInteiroParaRomano } from '../helpers/tombo';


const {
    Solo, Relevo, Cidade, Vegetacao, FaseSucessional, Pais, Tipo, LocalColeta, Familia, sequelize,
    Genero, Subfamilia, Autor, Coletor, Variedade, Subespecie, Usuario, TomboFoto,
    ColecaoAnexa, Especie, Herbario, Tombo, Alteracao, TomboColetor, Sequelize: { Op },
} = models;

export const cadastro = (request, response, next) => {
    const {
        principal, taxonomia, localidade,
        paisagem, identificacao, coletores,
        colecoes_anexas: colecoesAnexas, observacoes,
    } = request.body.json;

    const callback = transaction => Promise.resolve()
        .then(() => Tombo.findOne({
            where: {
                numero_coleta: principal.numero_coleta,
            },
            transaction,
        }))
        .then(tombo => {
            if (tombo) {
                throw new BadRequestExeption(417);
            }

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
                        numero: paisagem.fase_sucessional_id,
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
            if (taxonomia && taxonomia.sub_familia_id) {
                return Subfamilia.findOne({
                    where: {
                        id: taxonomia.sub_familia_id,
                        familia_id: taxonomia.familia_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subfamilia => {
            if (taxonomia && taxonomia.sub_familia_id) {
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
            if (taxonomia && taxonomia.sub_especie_id) {
                return Subespecie.findOne({
                    where: {
                        id: taxonomia.sub_especie_id,
                        especie_id: taxonomia.especie_id,
                    },
                    transaction,
                });
            }
            return undefined;
        })
        .then(subespecie => {
            if (taxonomia && taxonomia.sub_especie_id) {
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
            if (identificacao && identificacao.data_identificacao) {
                if (identificacao.data_identificacao.dia) {
                    jsonTombo.data_identificacao_dia = identificacao.data_identificacao.dia;
                }
                if (identificacao.data_identificacao.mes) {
                    jsonTombo.data_identificacao_mes = identificacao.data_identificacao.mes;
                }
                if (identificacao.data_identificacao.ano) {
                    jsonTombo.data_identificacao_ano = identificacao.data_identificacao.ano;
                }
            }
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
                        'sub_familia_id',
                        'sub_especie_id',
                    ]),
                };
            }
            if (colecoesAnexas && colecoesAnexas.id) { // is
                jsonTombo.colecao_anexa_id = colecoesAnexas.id;
            }
            if (request.usuario.tipo_usuario_id === 2 || request.usuario.tipo_usuario_id === 3) {
                jsonTombo.rascunho = true;
            }
            return Tombo.create(jsonTombo, { transaction });
        })
        // //////////// CADASTRA A ALTERACAO ///////////
        .then(tombo => {
            if (!tombo) {
                throw new BadRequestExeption(408);
            }
            let status = 'ESPERANDO';
            let isIdentificacao = 0;
            principal.hcf = tombo.hcf;
            if (request.usuario.tipo_usuario_id === 1) {
                status = 'APROVADO';
            }
            if (identificacao && identificacao.identificador_id) {
                isIdentificacao = 1;
            }

            return Alteracao.create({
                tombo_hcf: tombo.hcf,
                usuario_id: identificacao.identificador_id,
                status,
                tombo_json: JSON.stringify(tombo),
                ativo: true,
                identificacao: isIdentificacao,
            }, { transaction });
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
        .then(() => Tombo.count({ where }))
        .then(total => {
            retorno.metadados.total = total;
        })
        .then(() => Tombo.findAndCountAll({
            attributes: [
                'hcf',
                'nomes_populares',
                'nome_cientifico',
                'data_coleta_dia',
                'data_coleta_mes',
                'data_coleta_ano',
                'created_at',
            ],
            include: {
                required: true,
                model: Coletor,
                attributes: ['id', 'nome'],
            },
            where,
            order: [['created_at', 'DESC']],
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
    let resposta = {};
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
                'data_identificacao_dia',
                'data_identificacao_mes',
                'data_identificacao_ano',
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
            console.log(tombo.data_tombo); // eslint-disable-line
            // response.status(codigos.BUSCAR_UM_ITEM).json(tombo);

            if (!tombo) {
                throw new BadRequestExeption(416);
            }

            resposta = {
                hcf: tombo.hcf,
                situacao: tombo.situacao,
                data_tombo: tombo.data_tombo || '',
                observacao: tombo.observacao !== null ? tombo.observacao : '',
                tipo: tombo.tipo !== null ? tombo.tipo.nome : '',
                numero_coleta: tombo.numero_coleta,
                herbario: tombo.herbario !== null ? `${tombo.herbario.sigla} - ${tombo.herbario.nome}` : '',
                localizacao: {
                    latitude: tombo.latitude !== null ? tombo.latitude : '',
                    longitude: tombo.longitude !== null ? tombo.longitude : '',
                    altitude: tombo.altitude !== null ? tombo.altitude : '',
                    cidade: tombo.locais_coletum !== null && tombo.locais_coletum.cidade !== null ? tombo.locais_coletum.cidade.nome : '',
                    estado: tombo.locais_coletum !== null && tombo.locais_coletum.cidade !== null ? tombo.locais_coletum.cidade.estados_nome : '',
                    pais: tombo.locais_coletum !== null && tombo.locais_coletum.cidade !== null ? tombo.locais_coletum.cidade.estados_paises_nome : '',
                    cor: tombo.cor !== null ? tombo.cor : '',
                },
                local_coleta: {
                    descricao: tombo.locais_coletum !== null && tombo.locais_coletum.descricao !== null ? tombo.locais_coletum.descricao : '',
                    solo: tombo.locais_coletum !== null && tombo.locais_coletum.solo !== null ? tombo.locais_coletum.solo.nome : '',
                    relevo: tombo.locais_coletum !== null && tombo.locais_coletum.relevo !== null ? tombo.locais_coletum.relevo.nome : '',
                    vegetacao: tombo.locais_coletum !== null && tombo.locais_coletum.vegetacao !== null ? tombo.locais_coletum.vegetaco.nome : '',
                    fase_sucessional: tombo.locais_coletum !== null && tombo.locais_coletum.fase_sucessional !== null ? tombo.locais_coletum.fase_sucessional : '',
                },
                taxonomia: {
                    nome_cientifico: tombo.nome_cientifico !== null ? tombo.nome_cientifico : '',
                    nome_popular: tombo.nomes_populares !== null ? tombo.nomes_populares : '',
                    familia: tombo.familia !== null ? tombo.familia.nome : '',
                    sub_familia: tombo.sub_familia !== null ? tombo.sub_familia.nome : '',
                    genero: tombo.genero !== null ? tombo.genero.nome : '',
                    especie: {
                        nome: tombo.especy !== null ? tombo.especy.nome : '',
                        autor: tombo.especy.autore !== null ? tombo.especy.autore.nome : '',
                    },
                    sub_especie: {
                        nome: tombo.sub_especy !== null ? tombo.sub_especy.nome : '',
                        autor: tombo.sub_especy.autore !== null ? tombo.sub_especy.autore.nome : '',
                    },
                    variedade: {
                        nome: tombo.variedade !== null ? tombo.variedade.nome : '',
                        autor: tombo.variedade.autore !== null ? tombo.variedade.autore.nome : '',
                    },
                },
                colecao_anexa: {
                    tipo: tombo.colecoes_anexa !== null ? tombo.colecoes_anexa.tipo : '',
                    observacao: tombo.colecoes_anexa !== null ? tombo.colecoes_anexa.observacoes : '',
                },
            };

            let dataIdent = '';
            if (tombo.data_identificacao_dia !== null) {
                dataIdent = tombo.data_identificacao_dia;
            }
            if (tombo.data_identificacao_mes !== null) {
                dataIdent += `\\${tombo.data_identificacao_mes}`;
            }
            if (tombo.data_identificacao_ano !== null) {
                dataIdent += `\\${tombo.data_identificacao_ano}`;
            }

            let dataCol = '';
            if (tombo.data_coleta_dia !== null) {
                dataCol = tombo.data_coleta_dia;
            }
            if (tombo.data_coleta_mes !== null) {
                dataCol += `\\${tombo.data_coleta_mes}`;
            }
            if (tombo.data_coleta_ano !== null) {
                dataCol += `\\${tombo.data_coleta_ano}`;
            }

            resposta.data_coleta = dataCol;
            resposta.data_identificacao = dataIdent;

            let coletores = '';

            if (tombo.coletores != null) {
                coletores = tombo.coletores.map(coletor => `${coletores}${coletor.nome},`).toString();
            }
            resposta.coletores = coletores;

            return resposta;
        })
        .then(tombo => TomboFoto.findAll({
            where: {
                tombo_hcf: id,
            },
            attributes: ['id', 'caminho_foto'],
        }))
        .then(fotos => {
            const formatoFotos = [];
            fotos.map(foto => formatoFotos.push({
                original: `C:\\Users\\Elaine\\Documents\\GitHub\\hcf-web\\Painel\\herbario-backend\\storage\\${foto.caminho_foto}`,
                thumbnail: `C:\\Users\\Elaine\\Documents\\GitHub\\hcf-web\\Painel\\herbario-backend\\storage\\${foto.caminho_foto}`,
            }));
            resposta.fotos = formatoFotos;
            response.status(codigos.BUSCAR_UM_ITEM)
                .json(resposta);
        })
        .catch(next);
};

export const getExportarDados = (request, response, next) => {
    const {
        de, ate, tombos, campos,
    } = request.query;
    let parametros = {};
    let retorno = {};

    /*  campos:
        data_coleta, familia, subfamilia, genero, especie, subespecie, variedade,
        autor, seq_tombo, cod_barra, latitude, longitude, altitude,
        num_coleta, coletores, hcf
    */

    Promise.resolve()
        .then(() => {
            if (campos === undefined && (campos.length > 5 || campos.length === 0)) {
                throw new BadRequestExeption(418);
            }
            let where = {
                rascunho: 0,
                ativo: 1,
            };
            let whereFotos = {};
            if (de && ate) {
                where = {
                    ...where,
                    hcf: {
                        [Op.gte]: de,
                        [Op.lte]: ate,
                    },
                };
                whereFotos = {
                    tombo_hcf: {
                        [Op.gte]: de,
                        [Op.lte]: ate,
                    },
                };
            } else if (de) {
                where = {
                    ...where,
                    hcf: {
                        [Op.gte]: de,
                    },
                };
                whereFotos = {
                    tombo_hcf: {
                        [Op.gte]: de,
                    },
                };
            } else if (ate) {
                where = {
                    ...where,
                    hcf: {
                        [Op.lte]: ate,
                    },
                };
                whereFotos = {
                    tombo_hcf: {
                        [Op.lte]: ate,
                    },
                };
            } else {
                where = {
                    ...where,
                    hcf: {
                        [Op.in]: tombos,
                    },
                };
                whereFotos = {
                    tombo_hcf: {
                        [Op.in]: tombos,
                    },
                };
            }
            retorno = {
                where,
                whereFotos,
            };
        })
        .then(() => Tombo.findAll({
            attributes: [
                'hcf',
                'data_coleta_dia',
                'data_coleta_mes',
                'data_coleta_ano',
                'latitude',
                'longitude',
                'altitude',
                'numero_coleta',

            ],
            include: [
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
                    model: Especie,
                },
                {
                    model: Subespecie,
                },
                {
                    model: Variedade,
                },
                {
                    model: Coletor,
                },
            ],
            where: retorno.where,
        }))
        .then(tombo => {
            parametros = {
                tombo,
            };
        })
        .then(() => TomboFoto.findAll({
            where: retorno.whereFotos,
        }))
        .then(fotos => {
            parametros = {
                ...parametros,
                fotos,
            };
        })
        .then(() => {

            retorno = parametros.tombo.map(tombo => {
                let objeto = {};
                if (campos.includes('data_coleta')) {
                    let dataColeta = '';
                    if (tombo.data_coleta_dia) {
                        dataColeta = `${tombo.data_coleta_dia}`;
                    }
                    if (tombo.data_coleta_mes) {
                        dataColeta += `/${converteInteiroParaRomano(tombo.data_coleta_mes)}`;
                    }
                    if (tombo.data_coleta_ano) {
                        dataColeta += `/${tombo.data_coleta_ano}`;
                    }
                    objeto = {
                        data_coleta: dataColeta,
                    };
                }
                if (campos.includes('familia')) {
                    objeto = {
                        ...objeto,
                        familia: tombo.familia ? tombo.familia.nome : '',
                    };
                }
                if (campos.includes('subfamilia')) {
                    objeto = {
                        ...objeto,
                        subfamilia: tombo.subfamilia ? tombo.subfamilia.nome : '',
                    };
                }
                if (campos.includes('genero')) {
                    objeto = {
                        ...objeto,
                        genero: tombo.genero ? tombo.genero.nome : '',
                    };
                }
                if (campos.includes('especie')) {
                    objeto = {
                        ...objeto,
                        especie: tombo.especy ? tombo.especy.nome : '',
                    };
                    if (campos.includes('autor')) {
                        objeto = {
                            ...objeto,
                            especie: tombo.especy.autor ? tombo.especy.autor.nome : '',
                        };
                    }
                }
                if (campos.includes('subespecie')) {
                    objeto = {
                        ...objeto,
                        subespecie: tombo.sub_especy ? tombo.sub_especy.nome : '',
                    };
                    if (campos.includes('autor')) {
                        objeto = {
                            ...objeto,
                            autor_subespecie: tombo.sub_especy.autor ? tombo.sub_especy.autor.nome : '',
                        };
                    }
                }
                if (campos.includes('variedade')) {
                    objeto = {
                        ...objeto,
                        variedade: tombo.variedade ? tombo.variedade.nome : '',
                    };
                    if (campos.includes('autor')) {
                        objeto = {
                            ...objeto,
                            autor_variedade: tombo.variedade.autor ? tombo.variedade.autor.nome : '',
                        };
                    }
                }
                if (campos.includes('latitude')) {
                    objeto = {
                        ...objeto,
                        latitude: tombo.latitude ? tombo.longitude : '',
                    };
                }
                if (campos.includes('longitude')) {
                    objeto = {
                        ...objeto,
                        especie: tombo.longitude ? tombo.longitude : '',
                    };
                }
                if (campos.includes('altitude')) {
                    objeto = {
                        ...objeto,
                        altitude: tombo.altitude ? tombo.altitude : '',
                    };
                }
                if (campos.includes('numero_coleta')) {
                    objeto = {
                        ...objeto,
                        altitude: tombo.numero_coleta ? tombo.numero_coleta : '',
                    };
                }
                if (campos.includes('coletores')) {
                    if (campos.includes('tombo.coletores')) {
                        objeto = {
                            ...objeto,
                            coletores: tombo.coletores.map(coletor => `${coletor.nome},`).toString(),
                        };
                    }
                }
                if (campos.includes('hcf')) {
                    objeto = {
                        ...objeto,
                        hcf: tombo.hcf ? tombo.hcf : '',
                    };
                }
                return objeto;
            });


            response.status(codigos.EXPORTAR)
                .json(retorno);
        })
        .catch(next);
};

export const getNumeroTombo = (request, response, next) => {
    const { id } = request.params;
    console.log(id); // eslint-disable-line
    Promise.resolve()
        .then(() => Tombo.findAll({
            where: {
                hcf: { [Op.like]: `%${id}%` },
            },
            attributes: [
                'hcf',
            ],
        }))
        .then(tombos => {
            response.status(codigos.BUSCAR_UM_ITEM)
                .json(tombos);
        })
        .catch(next);
};

export default {};
