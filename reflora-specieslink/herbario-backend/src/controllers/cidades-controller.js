import models from '../models';

const {
    Cidade,
} = models;

export const listaTodosCidades = where => Cidade.findAndCountAll({
    attributes: {
        exclude: ['updated_at', 'created_at'],
    },
    where,
});

export const listagem = (request, response, next) => {
    let where = {};

    if (request.query.estado_sigla !== undefined) {
        where = {
            estados_nome: request.query.estado_nome,
            estados_sigla: request.query.estado_sigla,
        };
    }
    Promise.resolve()
        .then(() => listaTodosCidades(where))
        .then(cidades => {
            response.status(200).json(cidades.rows);
        })
        .catch(next);
};
