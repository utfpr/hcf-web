import mysql from 'mysql2';

function create() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'xxxx',
        database: 'hcf',
    });
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

function select(connection, query, callback) {
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
    create, connect, test, select, end,
};
