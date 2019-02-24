const {
    DB_NAME = 'hcf',
    DB_USER = 'root',
    DB_PASS = 'xxxx',
    DB_HOST = 'localhost',
    DB_PORT = '3306',
} = process.env;

export const database = DB_NAME;
export const username = DB_USER;
export const password = DB_PASS;

export const options = {
    dialect: 'mysql',
    host: DB_HOST,
    port: parseInt(DB_PORT) || 41890,
    define: {
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        paranoid: false,
    },
    operatorsAliases: false,
    dialectOptions: {
        charset: 'utf8mb4',
        multipleStatements: true,
    },
};
