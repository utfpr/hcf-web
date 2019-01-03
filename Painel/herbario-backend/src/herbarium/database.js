const mysql = require('mysql2');

module.exports = {
	create : function(){
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'hcf'
        });
        return connection;
    },
    test : function(connection){
        connection.connect(function(err) {
            if (err) {
              console.error('error connecting: ' + err.stack);
              return;
            }
          
            console.log('connected as id ' + connection.threadId);
        });
    },
    select : function(connection, query, callback){
        connection.query(
            query,
            function(err, results, fields) {
                callback(results);
            }
        );
    },
    end : function(connection){
        connection.end(function(err) {
            if(err){
            console.error('Conexão encerrada com problemas');
            return;
            }
        
            console.log('Conexão encerrada com sucesso');
            // The connection is terminated now
        });
    }
};
