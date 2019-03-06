const Reflora = require('../herbarium/reflora/main');

export const chamaReflora = (request, response, next) => {
    Reflora.main().then(saidaLog => {
        response.status(200).json(saidaLog);
        // eslint-disable-next-line no-console
        // console.log(saidaLog);
    }).catch(next);
};

export const agendaReflora = (request, response, next) => {
    // eslint-disable-next-line no-console
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa');
    const { horario } = request.params;
    const { periodicidade } = request.params;
    Reflora.agenda(horario, periodicidade).then(() => {
        response.status(200).json(JSON.parse(' { "title": "example glossary" } '));
    }).catch(next);
    // response.status(200).json(JSON.parse(' { "title": "example glossary" } ')).catch(next);
};

export default {};
