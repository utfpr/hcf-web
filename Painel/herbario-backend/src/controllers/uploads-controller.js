import { renameSync, existsSync, mkdirSync } from 'fs';
import uuid from 'uuid/v4';
import moment from 'moment-timezone';
import { join, extname } from 'path';
import BadRequestExeption from '../errors/bad-request-exception';
import { storage } from '../config/upload';
import models from '../models';
import pick from '../helpers/pick';


const {
    sequelize,
    Sequelize: { ForeignKeyConstraintError },
    TomboFoto,
} = models;

const catchForeignKeyConstraintError = err => {
    if (err.fields.includes('tombo_hcf')) {
        throw new BadRequestExeption(416);
    }

    throw err;
};

export const post = (request, response, next) => {
    console.log(request.body); // eslint-disable-line

    const fn = transaction => Promise.resolve()
        .then(() => {
            const { file } = request;
            if (!existsSync(storage)) {
                mkdirSync(storage);
            }

            const subdiretorio = moment()
                .format('YYYY-MM-DD');

            const basediretorio = join(storage, subdiretorio);
            if (!existsSync(basediretorio)) {
                mkdirSync(basediretorio);
            }

            const extensao = extname(file.originalname);
            const nome = `${uuid()}${extensao}`;
            const foto = join(subdiretorio, nome);

            renameSync(file.path, join(storage, foto));

            return foto;
        })
        .then(arquivo => {
            const body = pick(request.body, [
                'tombo_hcf',
                'em_vivo',
            ]);

            const foto = {
                ...body,
                caminho_foto: arquivo,
            };

            return TomboFoto.create(foto, { transaction });
        })
        .then(foto => {
            const atualizacoes = {
                ...foto,
                // @ts-ignore
                codigo_barra: `HCF${String(foto.id).padStart(9, '0')}`,
                // @ts-ignore
                num_barra: `${foto.id}.${''.padEnd(6, '0')}`,
            };

            return foto.update(atualizacoes, { transaction });
        });

    sequelize.transaction(fn)
        .then(imagem => {
            response.status(201)
                .json(imagem);
        })
        .catch(ForeignKeyConstraintError, catchForeignKeyConstraintError)
        .catch(next);
};


export default {};
