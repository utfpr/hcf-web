import mysql from 'mysql2';
import log from './log';

const selectMaxNumBarra = 'SELECT MAX(num_barra) AS MAX FROM tombos_fotos';

function create(fileName) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'xxxx',
        database: 'hcf',
    });
    log.connectDatabase(fileName);
    return connection;
}

function connect(connection) {
    this.connect = connection;
}

function test(connection) {
    connection.connect(err => {
        if (err) {
            return false;
        }
        return true;
    });
}

function select(fileName, connection, query, callback) {
    log.selectDatabase(fileName, query);
    connection.query(query, (err, results, fields) => {
        callback(results);
    });
}

function end(connection) {
    connection.end(err => {
        if (err) {
            // a
        }
        // b
    });
}

export default {
    create, connect, test, select, end, selectMaxNumBarra,
};
