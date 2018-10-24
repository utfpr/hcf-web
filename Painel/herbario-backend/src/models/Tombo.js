function associate(modelos) {
    const {
        LocalColeta,
        Tombo,
        Variedade,
        Herbario,
        Tipo,
        Especie,
        Genero,
        Coletor,
        Familia,
        Subfamilia,
        Subespecie,
        ColecaoAnexa,
        Usuario,
        Alteracao,
        TomboColetor,
        Remessa,
        RetiradaExsiccata,
    } = modelos;

    Tombo.belongsToMany(Usuario, {
        through: Alteracao,
        foreignKey: 'tombo_hcf',
    });

    Tombo.belongsToMany(Remessa, {
        through: RetiradaExsiccata,
        foreignKey: 'tombo_hcf',
    });

    Tombo.belongsToMany(Coletor, {
        through: TomboColetor,
        foreignKey: 'tombo_hcf',
    });

    Tombo.belongsTo(Herbario, {
        foreignKey: 'entidade_id',
    });

    Tombo.belongsTo(LocalColeta, {
        foreignKey: 'local_coleta_id',
    });

    Tombo.belongsTo(Variedade, {
        foreignKey: 'variedade_id',
    });

    Tombo.belongsTo(Tipo, {
        foreignKey: 'tipo_id',
    });

    Tombo.belongsTo(Especie, {
        foreignKey: 'especie_id',
    });

    Tombo.belongsTo(Genero, {
        foreignKey: 'genero_id',
    });

    Tombo.belongsTo(Familia, {
        foreignKey: 'familia_id',
    });

    Tombo.belongsTo(Subfamilia, {
        foreignKey: 'sub_familia_id',
    });

    Tombo.belongsTo(Subespecie, {
        foreignKey: 'sub_especie_id',
    });

    Tombo.belongsTo(ColecaoAnexa, {
        foreignKey: 'colecao_anexa_id',
    });
}

export const defaultScope = {
    attributes: {
        exclude: [
            'created_at',
            'updated_at',
        ],
    },
};

export default (Sequelize, DataTypes) => {

    const attributes = {
        hcf: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        data_coleta_dia: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        data_coleta_mes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        data_coleta_ano: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        observacao: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        nomes_populares: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        numero_coleta: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        altitude: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
        situacao: {
            type: DataTypes.ENUM('REGULAR', 'PERMUTADO', 'EMPRESTADO', 'DOADO'),
            allowNull: true,
        },
        nome_cientifico: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rascunho: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        cor: {
            type: DataTypes.ENUM('VERMELHO', 'VERDE', 'AZUL'),
            allowNull: true,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    };

    const options = {
        defaultScope,
    };

    const Model = Sequelize.define('tombos', attributes, options);

    Model.associate = associate;

    return Model;
};
