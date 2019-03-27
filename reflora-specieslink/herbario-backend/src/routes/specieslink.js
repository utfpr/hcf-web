import multer from 'multer';
import path from 'path';
import { upload } from '../config/upload';

const controller = require('../controllers/specieslink-controller');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, `IMAGE-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const uploadMiddleware = multer({
    dest: upload,
    storage,
}).single('myImage');

export default app => {
    app.route('/specieslink-executa').post([
        uploadMiddleware,
        controller.preparaRequisicao,
    ]);
    app.route('/specieslink-status-execucao').get([
        controller.statusExecucao,
    ]);
};
