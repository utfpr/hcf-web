import multer from 'multer';
import { upload } from '../config/upload';
import tokensMiddleware, { TIPOS_USUARIOS } from '../middlewares/tokens-middleware';

const controller = require('../controllers/uploads-controller');

const uploadMiddleware = multer({ dest: upload });

export default app => {
    app.route('/uploads')
        .post([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR,
                TIPOS_USUARIOS.OPERADOR,
            ]),
            uploadMiddleware.single('imagem'),
            controller.post,
        ]);
};
