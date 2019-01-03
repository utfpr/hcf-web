const mysql = require('mysql2');

module.exports = {
    create() {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'hcf',
        });
        return connection;
    },
    test(connection) {
        connection.connect(err => {
            if (err) {
                // console.error('error connecting: ' + err.stack);
                // return;
            }
            // console.log('connected as id ' + connection.threadId);
        });
    },
    select(connection, query, callback) {
        connection.query(
            query,
            (err, results, fields) => {
                callback(results);
            },
        );
    },
    end(connection) {
        connection.end(err => {
            if (err) {
                // console.error('Conexão encerrada com problemas');
                // return;
            }
            // console.log('Conexão encerrada com sucesso');
            // The connection is terminated now
        });
    },
};
