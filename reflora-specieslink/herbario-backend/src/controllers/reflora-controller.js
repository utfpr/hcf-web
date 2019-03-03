const Reflora = require('../herbarium/reflora/main');

export const chamaReflora = (request, response, next) => {
    Reflora.main().then(saidaLog => {
        response.status(200).json(saidaLog);
        // eslint-disable-next-line no-console
        // console.log(saidaLog);
    }).catch(next);
};

export default {};
