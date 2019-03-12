const controller = require('../controllers/reflora-controller');

export default app => {
    app.route('/reflora').get([
        controller.chamaReflora,
    ]);
    app.route('/reflora-executando').get([
        controller.estaExecutando,
    ]);
    app.route('/reflora-agenda').get([
        controller.agendaReflora,
    ]);
    app.route('/reflora-todoslogs').get([
        controller.todosLogs,
    ]);
    app.route('/reflora-log').get([
        controller.getLog,
    ]);
    app.route('/reflora-status-agenda').get([
        controller.getStatusAgenda,
    ]);
};
