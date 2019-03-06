import validacoesMiddleware from '../middlewares/validacoes-middleware';
import refloraAgenda from '../validators/reflora-agenda';

const controller = require('../controllers/reflora-controller');

export default app => {
    app.route('/reflora').get([controller.chamaReflora]);
    app.route('/reflora/:horario-periodicidade').get([
        validacoesMiddleware(refloraAgenda),
        controller.agendaReflora,
    ]);
};
