function associate(modelos) {

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

    const Model = Sequelize.define('paises', attributes);

    Model.associate = associate;

    return Model;
};
