const controller = require('../controllers/reflora-controller');

export default app => {
    app.route('/reflora').get([
        controller.chamaReflora,
    ]);
    app.route('/reflora-agenda').get([
        controller.agendaReflora,
    ]);
    app.route('/reflora-todoslogs').get([
        controller.todosLogs,
    ]);
};
