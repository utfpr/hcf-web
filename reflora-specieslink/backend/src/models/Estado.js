function associate(modelos) {
    const {
        Estado,
        Pais,
    } = modelos;

    Estado.belongsTo(Pais, {
        foreignKey: 'paises_nome',
    });
    Estado.belongsTo(Pais, {
        foreignKey: 'paises_sigla',
    });
}

export default (Sequelize, DataTypes) => {

    const attributes = {
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true,
        },
        sigla: {
            type: DataTypes.STRING(3),
            allowNull: true,
            primaryKey: true,
        },
    };

    const Model = Sequelize.define('estados', attributes);

    Model.associate = associate;

    return Model;
};
