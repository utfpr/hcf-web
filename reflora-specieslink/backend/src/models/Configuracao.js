function associate(modelos) {
}

export default (Sequelize, DataTypes) => {

    const attributes = {
        hora_inicio: {
            type: DataTypes.STRING(19),
            allowNull: false,
        },
        hora_fim: {
            type: DataTypes.STRING(19),
            allowNull: true,
        },
        periodicidade: {
            type: DataTypes.ENUM,
            values: ['MANUAL', 'SEMANAL', '1MES', '2MESES'],
            allowNull: true,
        },
        data_proxima_atualizacao: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        nome_arquivo: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },
        servico: {
            type: DataTypes.ENUM,
            values: ['REFLORA', 'SPECIESLINK'],
        },
    };

    const options = {
        freezeTableName: false,
        // Disabilita o created_at e updated_at
        timestamps: false,
        tableName: 'configuracao',
    };

    const Model = Sequelize.define('configuracao', attributes, options);

    Model.associate = associate;

    return Model;
};
