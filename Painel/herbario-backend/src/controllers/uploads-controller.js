import { renameSync, existsSync, mkdirSync } from 'fs';
import moment from 'moment-timezone';
import { join, extname } from 'path';
import BadRequestExeption from '../errors/bad-request-exception';
import { storage } from '../config/directory';
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

function apenasNumeros(string) {
    var numsStr = string.replace(/[^0-9]/g,'');
    return parseInt(numsStr);
}

export const post = (request, response, next) => {
    console.log( "esse e meu request bodyyyyyyyyy post\n\n\n\n\n\n\n", request.body); // eslint-disable-line
    const { file } = request;

    var maximoGlobalCodBarras = "";
    var isTrueSet = (request.body.em_vivo == 'true');
    const fn = transaction => Promise.resolve()
        .then(() => TomboFoto.findAll({
            where: {
                em_vivo : isTrueSet
            },
            attributes: [
                'id',
                'codigo_barra',
            ],
        }))
        .then(codBarras => {
            // const maximoCodBarras = Math.max(... codBarras.map(e => e.id));
            var maximoCodBarras = codBarras[0];
            for (var i = 0; i < codBarras.length; i++) {
                if ( codBarras[i].id > maximoCodBarras.id ) {
                    maximoCodBarras = codBarras[i];
                }
            }
            maximoGlobalCodBarras = maximoCodBarras.dataValues.codigo_barra;
        })
        .then(() => {
            const body = pick(request.body, [
                'tombo_hcf',
                'em_vivo',
            ]);

            return TomboFoto.create(body, { transaction });
        })
        .then(foto => {
            const subdiretorio = moment()
                .format('YYYY-MM-DD');

            const basediretorio = join(storage, subdiretorio);
            if (!existsSync(basediretorio)) {
                // @ts-ignore
                mkdirSync(basediretorio, { recursive: true });
            }

            var nomeArquivo;
            // @ts-ignore
            console.log("esse e meu maximoooo\n\n\n", maximoGlobalCodBarras);
            maximoGlobalCodBarras = apenasNumeros(maximoGlobalCodBarras);
            if(foto.em_vivo){
                nomeArquivo = `HCFV${String(maximoGlobalCodBarras + 1).padStart(8, '0')}`;
            } else {
                nomeArquivo = `HCF${String(maximoGlobalCodBarras + 1).padStart(9, '0')}`;
            }

            const numeroBarra = `${maximoGlobalCodBarras + 1}.${''.padEnd(6, '0')}`;

            const extensao = extname(file.originalname);
            const caminho = join(subdiretorio, `${nomeArquivo}${extensao}`);

            const atualizacao = {
                ...foto,
                codigo_barra: nomeArquivo,
                num_barra: numeroBarra,
                caminho_foto: caminho,
            };

            return foto.update(atualizacao, { transaction });
        })
        .then(foto => {

            console.log("estes dados sao meusssss\n\n\n\n", file.path, )
            renameSync(file.path, join(storage, foto.caminho_foto));
            return foto;
        });

    sequelize.transaction(fn)
        .then(imagem => {
            response.status(201)
                .json(imagem);
        })
        .catch(ForeignKeyConstraintError, catchForeignKeyConstraintError)
        .catch(next);
};

export const put = (request, response, next) => {
    console.log(request.body); // eslint-disable-line
    const { file } = request;

    const fn = transaction => Promise.resolve()
        .then(() => {
            const body = pick(request.body, [
                'tombo_codBarr',
            ]);
            return TomboFoto.findOne({
                where: {
                    codigo_barra : body.tombo_codBarr
                },
            })
        })
        .then(foto => {
            console.log("essa aqui e minha:", foto);
            const subdiretorio = moment()
                 .format('YYYY-MM-DD');

            const basediretorio = join(storage, subdiretorio);
            if (!existsSync(basediretorio)) {
                // @ts-ignore
                mkdirSync(basediretorio, { recursive: true });
            }

            var nomeArquivo;
            // @ts-ignore
            if(foto.em_vivo){
                nomeArquivo = `HCFV${String(foto.id).padStart(8, '0')}`;
            } else {
                nomeArquivo = `HCF${String(foto.id).padStart(9, '0')}`;
            }

            // const numeroBarra = `${foto.id}.${''.padEnd(6, '0')}`;

            const extensao = extname(file.originalname);
            const caminho = join(subdiretorio, `${nomeArquivo}${extensao}`);

            const atualizacao = {
                ...foto,
                caminho_foto: caminho,
            };
            
            return foto.update(atualizacao, { transaction });
        })
        .then(foto => {
            renameSync(file.path, join(storage, foto.caminho_foto));
            return foto;
        });

    sequelize.transaction(fn)
        .then(imagem => {
            response.status(201)
                .json(imagem);
        })
        .catch(ForeignKeyConstraintError, catchForeignKeyConstraintError)
        .catch(next);

};

export const postBarrSemFotos = (request, response, next) => {
    console.log( "esse e meu request bodyyyyyyyyy\n\n\n\n\n\n\n", request.body); // eslint-disable-line
    var maximoGlobalCodBarras = "";
    var isTrueSet = (request.body.em_vivo == 'true');
    const fn = transaction => Promise.resolve()
        .then(() => TomboFoto.findAll({
            where: {
                em_vivo : isTrueSet
            },
            attributes: [
                'id',
                'codigo_barra',
            ],
        }))
        .then(codBarras => {
            // const maximoCodBarras = Math.max(... codBarras.map(e => e.id));
            var maximoCodBarras = codBarras[0];
            for (var i = 0; i < codBarras.length; i++) {
                if ( codBarras[i].id > maximoCodBarras.id ) {
                    maximoCodBarras = codBarras[i];
                }
            }
            maximoGlobalCodBarras = maximoCodBarras.dataValues.codigo_barra;
        })
        .then(() => {
            const body = pick(request.body, [
                'tombo_hcf',
                'em_vivo',
            ]);

            return TomboFoto.create(body, { transaction });
            
        })
        .then(foto => {
            var nomeArquivo;
            // @ts-ignore
            console.log("esse e meu maximoooo\n\n\n", maximoGlobalCodBarras);
            maximoGlobalCodBarras = apenasNumeros(maximoGlobalCodBarras);

            if(foto.em_vivo){
                nomeArquivo = `HCFV${String(maximoGlobalCodBarras + 1).padStart(8, '0')}`;
            } else {
                nomeArquivo = `HCF${String(maximoGlobalCodBarras + 1).padStart(9, '0')}`;
            }

            const numeroBarra = `${maximoGlobalCodBarras + 1}.${''.padEnd(6, '0')}`;

            const caminho = "semFoto.png";

            const atualizacao = {
                ...foto,
                codigo_barra: nomeArquivo,
                num_barra: numeroBarra,
                caminho_foto: caminho,
            };

            return foto.update(atualizacao, { transaction });
        })

    sequelize.transaction(fn)
        .then(imagem => {
            response.status(201)
                .json(imagem);
        })
        .catch(ForeignKeyConstraintError, catchForeignKeyConstraintError)
        .catch(next);
};

export default {};
