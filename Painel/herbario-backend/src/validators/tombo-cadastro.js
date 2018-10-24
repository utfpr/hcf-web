const validaData = ({ dia, mes, ano }) => {
    if (dia && mes && ano) {
        return true;
    }

    if (!dia && mes && ano) {
        return true;
    }

    if (!dia && !mes && ano) {
        return true;
    }

    return false;
};

const validaCor = cor => {
    if (cor === 'VERMELHO' || cor === 'AZUL' || cor === 'VERDE') {
        return true;
    }

    return false;
};

const validaColetores = coletores => {
    if (!Array.isArray(coletores)) {
        return false;
    }

    if (coletores.length <= 0) {
        return false;
    }

    for (let i = 0; i < coletores.length; i += 1) {
        if (!Number.isInteger(coletores[i])) {
            return false;
        }
    }
    return true;
};

export default {
    'principal.nome_popular': {
        in: 'body',
        isString: true,
        optional: true,
        isLength: {
            options: [{ min: 3 }],
        },
    },
    'principal.entidade_id': {
        in: 'body',
        isEmpty: false,
        isInt: true,
    },
    'principal.numero_coleta': {
        in: 'body',
        isEmpty: false,
        isInt: true,
    },
    'principal.data_coleta': {
        in: 'body',
        custom: {
            options: validaData,
        },
    },
    'principal.tipo_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'principal.cor': {
        in: 'body',
        optional: true,
        custom: {
            options: validaCor,
        },
    },
    'taxonomia.familia_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'taxonomia.genero_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'taxonomia.subfamilia_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'taxonomia.especie_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'taxonomia.variedade_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'taxonomia.subespecie_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'localidade.latitude': {
        in: 'body',
        optional: true,
        isString: true,
    },
    'localidade.longitude': {
        in: 'body',
        optional: true,
        isString: true,
    },
    'localidade.altitude': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'localidade.cidade_id': {
        in: 'body',
        isEmpty: false,
        isInt: true,
    },
    'localidade.complemento': {
        in: 'body',
        isString: true,
        isEmpty: false,
        isLength: {
            options: [{ min: 3 }],
        },
    },
    'paisagem.solo_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'paisagem.relevo_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'paisagem.vegetacao_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'paisagem.fase_sucessional': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'paisagem.descricao': {
        in: 'body',
        isString: true,
        optional: true,
        isLength: {
            options: [{ min: 3 }],
        },
    },
    'identificacao.identificador_id': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'identificacao.data_identificacao': {
        in: 'body',
        optional: true,
        custom: {
            options: validaData,
        },
    },
    coletores: {
        in: 'body',
        isEmpty: false,
        custom: {
            options: validaColetores,
        },
    },
    'colecoes_anexas.tipo': {
        in: 'body',
        optional: true,
        isInt: true,
    },
    'colecoes_anexas.observacoes': {
        in: 'body',
        optional: true,
        isString: true,
        isLength: {
            options: [{ min: 3 }],
        },
    },
    observacoes: {
        in: 'body',
        isString: true,
        optional: true,
        isLength: {
            options: [{ min: 3 }],
        },
    },
};
