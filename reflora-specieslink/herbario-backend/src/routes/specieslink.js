import multer from 'multer';
import path from 'path';
import moment from 'moment';
import { upload } from '../config/upload';

const controller = require('../controllers/specieslink-controller');
const controllerComum = require('../controllers/herbariovirtual-controller');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, `ArquivoSpeciesLink${moment().format('HH-mm-ss-DD-MM-YYYY')}${path.extname(file.originalname)}`);
    },
});

const uploadMiddleware = multer({
    dest: upload,
    storage,
}).single('arquivoSpeciesLink');

export default app => {
    app.route('/specieslink-executa').post([
        uploadMiddleware,
        controller.preparaRequisicao,
    ]);
    app.route('/specieslink-status-execucao').get([
        controller.statusExecucao,
    ]);
    app.route('/specieslink-todoslogs').get([
        controllerComum.todosLogs,
    ]);
    app.route('/specieslink-log').get([
        controllerComum.getLog,
    ]);
};
