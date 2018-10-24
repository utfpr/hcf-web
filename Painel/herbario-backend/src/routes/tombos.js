import tokensMiddleware, { TIPOS_USUARIOS } from '../middlewares/tokens-middleware';
import listagensMiddleware from '../middlewares/listagens-middleware';
import validacoesMiddleware from '../middlewares/validacoes-middleware';
import cadastrarTomboEsquema from '../validators/tombo-cadastro';
import cadastrarTipoEsquema from '../validators/tipo-cadastro';
import coletorCadastro from '../validators/coletor-cadastro';
import listagemTombo from '../validators/tombo-listagem';

const controller = require('../controllers/tombos-controller');

export default app => {

    app.route('/tombos/dados')
        .get([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR, TIPOS_USUARIOS.OPERADOR,
            ]),
            controller.getDadosCadTombo,
        ]);

    app.route('/tombos')
        .post([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR, TIPOS_USUARIOS.OPERADOR,
            ]),
            validacoesMiddleware(cadastrarTomboEsquema),
            controller.cadastro,
        ])
        .get([
            listagensMiddleware,
            validacoesMiddleware(listagemTombo),
            controller.listagem,
        ]);

    app.route('/tombos/:tombo_id')
        .delete([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR, TIPOS_USUARIOS.OPERADOR,
            ]),
            controller.desativar,
        ])
        .get([
            listagensMiddleware,
            controller.obterTombo,
        ]);


    app.route('/tipos')
        .post([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR, TIPOS_USUARIOS.OPERADOR,
            ]),
            validacoesMiddleware(cadastrarTipoEsquema),
            controller.cadastrarTipo,
        ])
        .get([
            controller.buscarTipos,
        ]);

    app.route('/coletores')
        .post([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR, TIPOS_USUARIOS.OPERADOR,
            ]),
            validacoesMiddleware(coletorCadastro),
            controller.cadastrarColetores,
        ])
        .get([
            controller.buscarColetores,
        ]);

    app.route('/numero-coletores')
        .get([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR, TIPOS_USUARIOS.OPERADOR,
            ]),
            controller.buscarProximoNumeroColetor,
        ]);

};
