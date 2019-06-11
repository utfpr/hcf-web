import { renderFile } from 'ejs';
import path from 'path';
import moment from 'moment-timezone';

import formataDataColeta from '../helpers/formata-data-coleta';
import models from '../models';

const {
    Tombo,
    Coletor,
    Familia,
    Especie,
    Usuario,
    Alteracao,
    LocalColeta,
    Cidade,
    Estado,
    Pais,
} = models;


function formataDataSaida(data) {
    return moment(data)
        .format('D/M/YYYY');
}

function renderizaArquivoHtml(caminho, parametros) {
    return new Promise((resolve, reject) => {

        function onRenderCompleted(err, html) {
            if (err) {
                reject(err);
                return;
            }

            resolve(html);
        }

        renderFile(caminho, parametros, {}, onRenderCompleted);
    });
}

export default function fichaTomboController(request, response, next) {
    const { tombo_id: tomboId } = request.params;

    Promise.resolve()
        .then(_ => {
            const include = [
                {
                    required: true,
                    model: Coletor,
                },
                {
                    model: Familia,
                },
                {
                    as: 'especie',
                    model: Especie,
                },
                {
                    as: 'local_coleta',
                    required: true,
                    model: LocalColeta,
                    include: {
                        required: true,
                        model: Cidade,
                        include: {
                            required: true,
                            model: Estado,
                            include: {
                                as: 'pais',
                                required: true,
                                model: Pais,
                            },
                        },
                    },
                },
            ];

            const where = {
                ativo: true,
                hcf: tomboId,
            };

            return Tombo.findOne({ include, where });
        })
        .then(tombo => {
            if (!tombo) {
                throw new Error('Tombo não encontrado');
            }

            const include = {
                required: true,
                model: Usuario,
            };

            const where = {
                identificacao: true,
                status: 'APROVADO',
                tombo_hcf: tombo.hcf,
            };

            const options = {
                order: [['id', 'desc']],
                limit: 1,
            };

            return Alteracao.findAll({ include, where, ...options })
                .then(alteracoes => {
                    if (alteracoes.length < 1) {
                        return {
                            tombo: tombo.toJSON(),
                            identificacao: {},
                        };
                    }

                    const [identificacao] = alteracoes;
                    return {
                        tombo: tombo.toJSON(),
                        identificacao: identificacao.toJSON(),
                    };
                });

        })
        .then(resultado => {
            const { tombo, identificacao } = resultado;

            const coletores = tombo.coletores
                .map(coletor => coletor.nome)
                .join(', ');

            const localColeta = tombo.local_coleta;
            const { cidade } = localColeta;
            const { estado } = cidade;
            const { pais } = estado;

            const parametros = {
                tombo: {
                    ...tombo,
                    coletores,
                    data_tombo: formataDataSaida(tombo.data_tombo),
                    data_coleta: formataDataColeta(
                        tombo.data_coleta_dia,
                        tombo.data_coleta_mes,
                        tombo.data_coleta_ano
                    ),
                },

                familia: tombo.familia,
                especie: tombo.especie,
                identificacao: {
                    ...identificacao,
                    data_identificacao: formataDataSaida(
                        identificacao.data_identificacao_dia,
                        identificacao.data_identificacao_mes,
                        identificacao.data_identificacao_ano
                    ),
                },

                localColeta,
                cidade,
                estado,
                pais,
            };

            const caminhoArquivoHtml = path.resolve(__dirname, '../views/ficha-tombo.ejs');
            return renderizaArquivoHtml(caminhoArquivoHtml, parametros, response)
                .then(html => {
                    response.status(200).send(html);
                });
        })
        .catch(next);
}
