import { createConnection } from 'mysql2';

function main() {
    const database = createConnection({
        host: 'localhost',
        user: 'root',
        password: 'xxxx',
        database: 'hcf',
    });
    return database;
}

main();
