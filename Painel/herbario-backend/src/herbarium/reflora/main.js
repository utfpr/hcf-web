var dateTime = require('../currentdatetime');
const mysql = require('mysql2');

function main(){
  /* Para gerar um log é necessário criar um arquivo */
  /* LOG - Inicializando a integração com o reflora */
  console.log(dateTime.getCurrentDateTime("Inicializando a integração com o Reflora."));

  /* LOG - Estabelecendo uma conexão com o BD */
  console.log(dateTime.getCurrentDateTime("Estabelecendo uma conexão com o banco de dados."));

  // create the connection to database
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hcf'
  });

  /* Testa a configuração */
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  
    console.log('connected as id ' + connection.threadId);
  });

  connection.query(
    'SELECT * FROM tombos_fotos',
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(results.length)
      console.log(results[results.length-1].codigo_barra)
      console.log(fields); // fields contains extra meta data about results, if available
    }
  );

  connection.end(function(err) {
    if(err){
      console.error('Conexão encerrada com problemas');
      return;
    }
  
    console.log('Conexão encerrada com sucesso');
    // The connection is terminated now
  });

//  connection.execute('select * from tombos_fotos', console.log);

}



main();
/**
 * Detalhe do package.json:
 * script foi adicionado reflora para executar o código do reflora
 *e utilizando o nodemon que toda vez alterado ele executa automaticamente
 */