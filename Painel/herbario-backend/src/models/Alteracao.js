function associate(modelos) {
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
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tombo_hcf: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        novo_hcf: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('ESPERANDO', 'APROVADO', 'REPROVADO', 'CONCERTAR'),
            allowNull: false,
        },
        observacao: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        data_identificacao_dia: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        data_identificacao_mes: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        data_identificacao_ano: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    };

    const options = {
        defaultScope,
    };

    const Model = Sequelize.define('alteracoes', attributes, options);

    Model.associate = associate;

    return Model;
};
