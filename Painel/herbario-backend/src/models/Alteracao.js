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
        status: {
            type: DataTypes.ENUM('ESPERANDO', 'APROVADO', 'REPROVADO'),
            allowNull: false,
        },
        observacao: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        tombo_json: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
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