const controller = require('../controllers/reflora-controller');
const controllerComum = require('../controllers/herbariovirtual-controller');

export default app => {
    app.route('/reflora').get([
        controller.preparaRequisicao,
    ]);
    app.route('/reflora-executando').get([
        controller.estaExecutando,
    ]);
    app.route('/reflora-todoslogs').get([
        controllerComum.todosLogs,
    ]);
    app.route('/reflora-log').get([
        controllerComum.getLog,
    ]);
};
