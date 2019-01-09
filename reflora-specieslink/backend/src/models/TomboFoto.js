function associate(modelos) {
    const {
        Tombo,
        TomboFoto,
    } = modelos;

    TomboFoto.belongsTo(Tombo, {
        foreignKey: 'tombo_hcf',
    });
}

export const defaultScope = {
    attributes: {
        exclude: [
            'id',
            'created_at',
            'updated_at',
        ],
    },
};

export default (Sequelize, DataTypes) => {
    const attributes = {
        tombo_hcf: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        num_barra: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },
    };

    const options = {
        defaultScope,
    };

    const Model = Sequelize.define('tombos_fotos', attributes, options);

    Model.associate = associate;

    return Model;
};
