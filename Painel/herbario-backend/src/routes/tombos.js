import tokensMiddleware, { TIPOS_USUARIOS } from '../middlewares/tokens-middleware';
import listagensMiddleware from '../middlewares/listagens-middleware';
import validacoesMiddleware from '../middlewares/validacoes-middleware';
import cadastrarTomboEsquema from '../validators/tombo-cadastro';
import cadastrarTipoEsquema from '../validators/tipo-cadastro';
import coletorCadastro from '../validators/coletor-cadastro';
import listagemTombo from '../validators/tombo-listagem';
import tomboExportarCadastro from '../validators/tombo-exportar-cadastro';

import {
    getDadosCadTombo, getExportarDados, getNumeroTombo, cadastro, listagem,
    desativar, obterTombo, cadastrarTipo, buscarTipos, cadastrarColetores, buscarColetores,
    buscarProximoNumeroColetor, alteracao,
} from '../controllers/tombos-controller';

export default app => {

    app.route('/tombos/dados')
        .get([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR,
                TIPOS_USUARIOS.OPERADOR,
                TIPOS_USUARIOS.IDENTIFICADOR,
            ]),
            getDadosCadTombo,
        ]);

    app.route('/tombos/exportar')
        .get([
            getExportarDados,
            validacoesMiddleware(tomboExportarCadastro),
        ]);

    app.route('/tombos/filtrar_numero/:id')
        .get([
            getNumeroTombo,
        ]);

    app.route('/tombos')
        .post([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR,
                TIPOS_USUARIOS.OPERADOR,
            ]),
            validacoesMiddleware(cadastrarTomboEsquema),
            cadastro,
        ])
        .get([
            listagensMiddleware,
            validacoesMiddleware(listagemTombo),
            listagem,
        ]);

    app.route('/tombos/:tombo_id')
        .put([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR,
                TIPOS_USUARIOS.OPERADOR,
                TIPOS_USUARIOS.IDENTIFICADOR,
            ]),
            alteracao,
        ])
        .delete([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR,
                TIPOS_USUARIOS.OPERADOR,
            ]),
            desativar,
        ])
        .get([
            listagensMiddleware,
            obterTombo,
        ]);


    app.route('/tipos')
        .post([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR, TIPOS_USUARIOS.OPERADOR,
            ]),
            validacoesMiddleware(cadastrarTipoEsquema),
            cadastrarTipo,
        ])
        .get([
            buscarTipos,
        ]);

    app.route('/coletores')
        .post([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR, TIPOS_USUARIOS.OPERADOR,
            ]),
            validacoesMiddleware(coletorCadastro),
            cadastrarColetores,
        ])
        .get([
            buscarColetores,
        ]);

    app.route('/numero-coletores')
        .get([
            tokensMiddleware([
                TIPOS_USUARIOS.CURADOR, TIPOS_USUARIOS.OPERADOR,
            ]),
            buscarProximoNumeroColetor,
        ]);

};
