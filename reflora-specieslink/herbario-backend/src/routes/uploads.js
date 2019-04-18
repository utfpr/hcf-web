import multer from 'multer';
import tokensMiddleware from '../middlewares/tokens-middleware';
import { upload } from '../config/upload';

const controller = require('../controllers/uploads-controller');

const uploadMiddleware = multer({ dest: upload });

export default app => {
    app.route('/uploads')
        .post([
            tokensMiddleware(),
            uploadMiddleware.single('imagem'),
            controller.post,
        ]);
};
