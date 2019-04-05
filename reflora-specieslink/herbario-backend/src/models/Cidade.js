function associate(modelos) {
    const {
        Estado,
        Cidade,
    } = modelos;

    Cidade.belongsTo(Estado, {
        foreignKey: 'estados_nome',
    });
    Cidade.belongsTo(Estado, {
        foreignKey: 'estados_sigla',
    });
    Cidade.belongsTo(Estado, {
        foreignKey: 'estados_paises_nome',
    });
    Cidade.belongsTo(Estado, {
        foreignKey: 'estados_paises_sigla',
    });
}

export default (Sequelize, DataTypes) => {

    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    };

    const Model = Sequelize.define('cidades', attributes);

    Model.associate = associate;

    return Model;
};
