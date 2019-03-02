const controller = require('../controllers/reflora-controller');

export default app => {

    app.route('/reflora')
        .get([
            controller.chamaReflora,
        ]);
};
