import models from '../models';

const {
    Estado,
} = models;

export const listaTodosEstados = where => Estado.findAndCountAll({
    attributes: {
        exclude: ['updated_at', 'created_at'],
    },
    where,
});

export const listagem = (request, response, next) => {
    let where = {};

    if (request.query.pais_sigla !== undefined) {
        where = {
            paises_nome: request.query.pais_nome,
            paises_sigla: request.query.pais_sigla,
        };
    }
    Promise.resolve()
        .then(() => listaTodosEstados(where))
        .then(paises => {
            response.status(200).json(paises.rows);
        })
        .catch(next);
};
