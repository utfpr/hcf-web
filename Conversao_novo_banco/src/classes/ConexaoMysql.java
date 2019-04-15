/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

/**
 *
 * @author Elaine
 */
import java.sql.Connection;

import java.sql.DriverManager;

import java.sql.SQLException;

//Início da classe de conexão//
public class ConexaoMysql {

    public static String status = "Não conectou...";
    static Connection connection = null;          //atributo do tipo Connection

//Método Construtor da Classe//
    public ConexaoMysql() {

    }

//Método de Conexão//
    public static java.sql.Connection getConexaoMySQL() {


        try {

// Carregando o JDBC Driver padrão
            String driverName = "com.mysql.jdbc.Driver";

            Class.forName(driverName);

// Configurando a nossa conexão com um banco de dados//
            String serverName = "mysql995.umbler.com:41890";    //caminho do servidor do BD

            String mydatabase ="hcf";        //nome do seu banco de dados

            String url = "jdbc:mysql://" + serverName + "/" + mydatabase;


            connection = DriverManager.getConnection(url, "hcf", "masterkey");

            //Testa sua conexão//  
            if (connection != null) {

                status = ("STATUS--->Conectado com sucesso!");

            } else {

                status = ("STATUS--->Não foi possivel realizar conexão");

            }

            return connection;

        } catch (ClassNotFoundException e) {  //Driver não encontrado

            System.out.println("O driver expecificado nao foi encontrado.");

            return null;

        } catch (SQLException e) {
            System.out.println(e);
//Não conseguindo se conectar ao banco
            System.out.println("Nao foi possivel conectar ao Banco de Dados.");

            return null;

        }

    }

    //Método que retorna o status da sua conexão//
    public static String statusConection() {

        return status;

    }
    
    public static Connection getConexao() {
        return connection;
    }

    //Método que fecha sua conexão//
    public static boolean FecharConexao() {

        try {

            ConexaoMysql.getConexaoMySQL().close();

            return true;

        } catch (SQLException e) {

            return false;

        }

    }



}
