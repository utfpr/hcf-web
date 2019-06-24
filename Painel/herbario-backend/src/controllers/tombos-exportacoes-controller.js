import knex from '../factories/knex';
import PreconditionFailedException from '../errors/precondition-failed-exception';


function adicionaColunaDataColeta(consulta, coluna) {
    const funcao = knex.raw('concat_ws(?, ??, ??, ??)', [
        '/',
        'tmb.data_coleta_dia',
        'tmb.data_coleta_mes',
        'tmb.data_coleta_ano',
    ]);

    consulta.column({ data_coleta: funcao });
}

function adicionaColunaFamilia(consulta, coluna) {
    const subconsulta = knex
        .select('nome')
        .from('familias')
        .where('id', knex.ref('tmb.familia_id'))
        .limit(1);

    consulta.column({ [coluna]: subconsulta });
}

function adicionaColunaSubfamilia(consulta, coluna) {
    const subconsulta = knex
        .select('nome')
        .from('sub_familias')
        .where('id', knex.ref('tmb.sub_familia_id'))
        .limit(1);

    consulta.column({ [coluna]: subconsulta });
}

function adicionaColunaGenero(consulta, coluna) {
    const subconsulta = knex
        .select('nome')
        .from('generos')
        .where('id', knex.ref('tmb.genero_id'))
        .limit(1);

    consulta.column({ [coluna]: subconsulta });
}

function adicionaColunaEspecie(consulta, coluna) {
    const subconsulta = knex
        .select('nome')
        .from('especies')
        .where('id', knex.ref('tmb.especie_id'))
        .limit(1);

    consulta.column({ [coluna]: subconsulta });
}

function adicionaColunaSubespecie(consulta, coluna) {
    const subconsulta = knex
        .select('nome')
        .from('sub_especies')
        .where('id', knex.ref('tmb.sub_especie_id'))
        .limit(1);

    consulta.column({ [coluna]: subconsulta });
}

function adicionaColunaVariedade(consulta, coluna) {
    const subconsulta = knex
        .select('nome')
        .from('sub_especies')
        .where('id', knex.ref('tmb.sub_especie_id'))
        .limit(1);

    consulta.column({ [coluna]: subconsulta });
}

function adicionaColunaColetores(consulta, coluna) {
    const nomes = knex.raw('group_concat(?? separator ?)', ['nome', ', ']);
    const subconsulta = knex
        .select(nomes)
        .from(['tombos_coletores', 'coletores'])
        .where('tombo_hcf', knex.ref('tmb.hcf'))
        .andWhere('coletor_id', knex.ref('id'));

    consulta.column({ [coluna]: subconsulta });
}

function adicionaColunasTombosFotos(consulta, coluna) {
    consulta.innerJoin({ tbf: 'tombos_fotos' }, 'tbf.tombo_hcf', 'tmb.hcf');

    consulta.columns([
        'sequencia',
        'codigo_barra',
    ]);
}


const COLUNAS = {
    hcf: consulta => { consulta.column('hcf'); },
    numero_coleta: consulta => { consulta.column('numero_coleta'); },
    data_coleta: adicionaColunaDataColeta,
    latitude: consulta => { consulta.column('latitude'); },
    longitude: consulta => { consulta.column('longitude'); },
    altitude: consulta => { consulta.column('altitude'); },
    familia: adicionaColunaFamilia,
    subfamilia: adicionaColunaSubfamilia,
    genero: adicionaColunaGenero,
    especie: adicionaColunaEspecie,
    subespecie: adicionaColunaSubespecie,
    variedade: adicionaColunaVariedade,
    coletores: adicionaColunaColetores,
    fotos: adicionaColunasTombosFotos,
};

const FILTROS = {
    de: (consulta, valor) => { consulta.where('tmb.hcf', '>=', valor); },
    ate: (consulta, valor) => { consulta.where('tmb.hcf', '<=', valor); },
    ids: (consulta, valor) => { consulta.whereIn('tmb.hcf', valor); },
};

function criaConsultaTombos(colunas, filtros) {

    const consulta = knex
        .from({ tmb: 'tombos' });

    colunas.forEach(coluna => {
        const funcao = COLUNAS[coluna];
        funcao(consulta, coluna);
    });

    Object.entries(filtros)
        .forEach(entrada => {
            const [chave, valor] = entrada;
            const funcao = FILTROS[chave];
            funcao(consulta, valor);
        });

    return consulta;
}

export default function exportacoes(request, response, next) {

    Promise.resolve({ query: request.query, paginacao: request.paginacao })
        .then(parametros => {
            const { query, paginacao } = parametros;
            if (!query.filtros) {
                throw new PreconditionFailedException(420);
            }

            const de = Number(query.filtros.de);
            const ate = Number(query.filtros.ate);
            if (de && ate && de >= ate) {
                throw new PreconditionFailedException(419);
            }

            const { ids } = query.filtros;
            if (de && ate && ids) {
                throw new PreconditionFailedException(422);
            }

            const consulta = criaConsultaTombos(query.campos, query.filtros)
                .limit(paginacao.limite)
                .offset(paginacao.offset);

            console.log(consulta.toString()); // eslint-disable-line

            consulta
                .then(registros => {
                    response.status(200)
                        .json(registros);
                });
        })
        .catch(next);
}
