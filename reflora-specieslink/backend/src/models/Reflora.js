function associate(modelos) {
}

export default (Sequelize, DataTypes) => {

    const attributes = {
        cod_barra: {
            type: DataTypes.STRING(12),
            allowNull: false,
            primaryKey: true,
        },
        tombo_json: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        ja_comparou: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        contador: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    };

    const options = {
        freezeTableName: false,
        // Disabilita o created_at e updated_at
        timestamps: false,
        tableName: 'reflora',
        id: false,
    };

    const Model = Sequelize.define('reflora', attributes, options);

    Model.associate = associate;

    return Model;
};
