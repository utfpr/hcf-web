/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package conversao_novo_banco;

import classes.Autores;
import classes.Cidades;
import classes.Coletores;
import classes.ConexaoMysql;
import classes.Especies;
import classes.Familias;
import classes.Generos;
import classes.Locais_Coleta;
import classes.Relevos;
import classes.Solos;
import classes.Sub_Especies;
import classes.Sub_Familias;
import classes.Tipos;
import classes.Variedades;
import classes.Vegetacoes;
import dao.DAOGeneric;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javafx.scene.text.Text;
import javax.resource.cci.ConnectionFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONString;

/**
 *
 * @author Elaine
 */
public class Conversao_novo_banco {

    ArrayList<String> nomes = new ArrayList<String>();
    static ArrayList<Integer> locaisColetaErro = new ArrayList<Integer>();

    public static String selectTabelaVegetacao() {
        String sqlLinha = "SELECT * FROM VEGETACAO";
        return sqlLinha;
    }

    public static void insereInstanciaVegetacao(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into vegetacoes "
                + "(id,nome)"
                + " values (?,?)";

        try {
            // prepared statement para inserção
            PreparedStatement stmt = connection.prepareStatement(sql);

            int cont = 0;
            if (rs != null) {
                while (rs.next()) {
                    String nomeTipo = rs.getString("TP_VEGETACAO");
                    stmt.setString(2, nomeTipo);
                    int cod = Integer.parseInt(rs.getString("COD_VEGETACAO"));
                    stmt.setInt(1, cod);
                    stmt.execute();
                }
            }

            stmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public static String selectTabelaSolo() {
        String sqlLinha = "SELECT * FROM SOLO";
        return sqlLinha;
    }

    public static void insereInstanciaSolo(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into solos "
                + "(id,nome)"
                + " values (?,?)";

        try {
            // prepared statement para inserção
            PreparedStatement stmt = connection.prepareStatement(sql);

            int cont = 0;
            if (rs != null) {
                while (rs.next()) {
                    String nomeTipo = rs.getString("TP_SOLO");
                    stmt.setString(2, nomeTipo);
                    int cod = Integer.parseInt(rs.getString("COD_SOLO"));
                    stmt.setInt(1, cod);
                    stmt.execute();
                }
            }

            stmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

     public static String selectTabelaTomboExsicata() {
        String sqlLinha = "SELECT * FROM TOMBO_EXSICATA  where num_tombo > 16529 order by num_tombo asc";
        return sqlLinha;
    }

    public static void insereInstanciaTomboExsicata(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into tombos_fotos "
                + "(tombo_hcf, codigo_barra, num_barra, sequencia)"
                + " values (?, ?, ?, ?)";

        try {
            // prepared statement para inserção
            PreparedStatement stmt = connection.prepareStatement(sql);

            int cont = 0;
            if (rs != null) {
                while (rs.next()) {
                    String[] tombo = rs.getString("NUM_TOMBO").split("\\.");
                    
                    int hcf = Integer.parseInt(tombo[0]);
                    System.out.println(hcf);

                    stmt.setInt(1, hcf);
                    stmt.setString(2, rs.getString("COD_BARRA"));
                    stmt.setString(3, rs.getString("NUM_BARRA"));
                    stmt.setInt(4, rs.getInt("SEQUENCIA"));
                    stmt.execute();
                }
            }

            stmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    
    public static String selectTabelaRelevo() {
        String sqlLinha = "SELECT * FROM RELEVO";
        return sqlLinha;
    }

    public static void insereInstanciaRelevo(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into relevos "
                + "(id,nome)"
                + " values (?,?)";

        try {
            // prepared statement para inserção
            PreparedStatement stmt = connection.prepareStatement(sql);

            int cont = 0;
            if (rs != null) {
                while (rs.next()) {
                    String nomeTipo = rs.getString("TP_RELEVO");
                    stmt.setString(2, nomeTipo);
                    int cod = Integer.parseInt(rs.getString("COD_RELEVO"));
                    stmt.setInt(1, cod);
                    stmt.execute();
                }
            }

            stmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    public static String selectTabelaTipo() {
        String sqlLinha = "SELECT * FROM TIPO";
        return sqlLinha;
    }

    public static void insereInstanciaTipo(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into tipos "
                + "(id,nome)"
                + " values (?,?)";

        try {
            // prepared statement para inserção
            PreparedStatement stmt = connection.prepareStatement(sql);

            int cont = 0;
            if (rs != null) {
                while (rs.next()) {
                    String nomeTipo = rs.getString("TP_DESCRICAO");
                    stmt.setString(2, nomeTipo);
                    int cod = Integer.parseInt(rs.getString("COD_TIPO"));
                    stmt.setInt(1, cod);
                    stmt.execute();
                }
            }

            stmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    public static String selectTabelaFamilia() {
        String sqlLinha = "SELECT * FROM FAMILIA";
        return sqlLinha;
    }

    public static void insereInstanciaFamilia(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        ArrayList<String> fam = new ArrayList<String>();
        String sql = "insert into familias "
                + "(id,nome)"
                + " values (?,?)";

        try {
            // prepared statement para inserção
            PreparedStatement stmt = connection.prepareStatement(sql);

            int cont = 0;
            if (rs != null) {
                while (rs.next()) {
                    String nomeFam = rs.getString("FAMILIA");
                    if (!fam.contains(nomeFam)) {
                        stmt.setString(2, nomeFam);
                        int cod = Integer.parseInt(rs.getString("COD_FAMILIA"));
                        stmt.setInt(1, cod);
                        stmt.execute();
                        fam.add(nomeFam);
                    }

                }
            }

            stmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    public static String selectTabelaAutores() {
        String sqlLinha = "select * from (\n"
                + "    select replace(replace(replace(ESPECIE_ESPECIE_AUTOR, '.', ''), ' ', ''), '''', '') as nome from TOMBO\n"
                + "    union\n"
                + "    select replace(replace(replace(ESPECIE_SUBSPECIE_AUTOR, '.', ''), ' ', ''), '''', '') as nome from TOMBO\n"
                + "    union\n"
                + "    select replace(replace(replace(ESPECIE_VARIEDADE_AUTOR, '.', ''), ' ', ''), '''', '') as nome from TOMBO\n"
                + ") \n"
                + "group by(nome);";
        return sqlLinha;
    }

    public static String padronizaNomeAutor(String nome) {
        String nomeFinal = "";
        for (int i = 0; i < nome.length(); i++) {
            if (nome.charAt(i) != '(' && nome.charAt(i) != ')') {
                if (nome.charAt(i) == '&') {
                    nomeFinal += " & ";
                } else if (nome.codePointAt(i) >= 65 && nome.codePointAt(i) <= 90) { // é maiusculo
                    if (i + 1 < nome.length()) {
                        if (nome.charAt(i + 1) == '&') {
                            nomeFinal += nome.charAt(i) + ". ";
                        } else if (nome.codePointAt(i + 1) >= 65 && nome.codePointAt(i + 1) <= 90) {
                            nomeFinal += nome.charAt(i) + ". ";
                        } else if (i - 1 >= 0 && nome.codePointAt(i - 1) >= 97 && nome.codePointAt(i - 1) <= 122) {
                            nomeFinal += " " + nome.charAt(i);
                        } else {
                            nomeFinal += nome.charAt(i);
                        }
                    }
                } else {
                    nomeFinal += nome.charAt(i);
                }
            } else {
                nomeFinal += nome.charAt(i);
            }
        }
        return nomeFinal;
    }

    public static String getIniciaisAutores(String nome) {
        String iniciais = "";
        for (int i = 0; i < nome.length(); i++) {
            if (nome.charAt(i) == '&') {
                iniciais += " & ";
            } else if (nome.codePointAt(i) >= 65 && nome.codePointAt(i) <= 90) { // é maiusculo
                iniciais += nome.charAt(i) + ".";
            }
        }
        return iniciais;
    }

    public static void insereInstanciaAutores(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        ArrayList<String> autores = new ArrayList<String>();
        String sql = "insert into autores "
                + "(nome,iniciais)"
                + " values (?,?)";

        try {
            // prepared statement para inserção
            PreparedStatement stmt = connection.prepareStatement(sql);

            int cont = 0;
            if (rs != null) {
                while (rs.next()) {
                    String nome = rs.getString("nome");
                    if (nome != null) {
                        if (!autores.contains(nome)) {
                            autores.add(nome);
                        }
                    }

                }
            }
            for (String nome : autores) {
                stmt.setString(1, padronizaNomeAutor(nome));
                stmt.setString(2, getIniciaisAutores(nome));
                stmt.execute();
            }

            stmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    public static String selectTabelaSubfamilia() {
        String sqlLinha = "SELECT SUBFAMILIA.CD_FAMILIASUB, SUBFAMILIA.CODIGO_SUBFAM ,SUBFAMILIA.SUBFAMILIA, FAMILIA.FAMILIA\n"
                + "FROM SUBFAMILIA\n"
                + "INNER JOIN FAMILIA ON FAMILIA.COD_FAMILIA = SUBFAMILIA.CD_FAMILIASUB";
        return sqlLinha;
    }

    public static void insereInstanciaSubfamilia(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        ArrayList<String> subfam = new ArrayList<String>();
        String sql = "insert into sub_familias "
                + "(id,nome,familia_id)"
                + " values (?,?,?)";

        try {
            // prepared statement para inserção
            PreparedStatement stmt = connection.prepareStatement(sql);

            int cont = 0;
            if (rs != null) {
                while (rs.next()) {
                    String nome = rs.getString("SUBFAMILIA");
                    System.out.println(nome);
                    String familia = rs.getString("FAMILIA");
                    int cod = Integer.parseInt(rs.getString("CODIGO_SUBFAM"));
                    if (!subfam.contains(nome)) {
                        Sub_Familias subf = new Sub_Familias();
                        subf.setNome(nome);
                        subf.setId(cod);

                        DAOGeneric<Familias> fam = new DAOGeneric<>(Familias.class);
                        Familias familiaBuscada = new Familias();
                        familiaBuscada = (Familias) (fam.getId(familia).get(0));

                        stmt.setString(2, nome);
                        stmt.setInt(1, cod);
                        stmt.setInt(3, familiaBuscada.getId());
                        stmt.execute();
                        subfam.add(nome);

                    }
                }
            }

            stmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    public static String selectTabelaGenero() {
        String sqlLinha = "SELECT ESPECIE.CD_FAMILIA, ESPECIE.CODIGO_ESPECIE, ESPECIE.ESPECIE, FAMILIA.FAMILIA\n"
                + "FROM ESPECIE\n"
                + "INNER JOIN FAMILIA ON FAMILIA.COD_FAMILIA = ESPECIE.CD_FAMILIA";
        return sqlLinha;
    }

    public static void insereInstanciaGenero(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        HashMap<String, String> generos = new HashMap<String, String>();
        String sql = "insert into generos "
                + "(nome, familia_id)"
                + " values (?,?)";
        PreparedStatement stmt = connection.prepareStatement(sql);
        int cont = 0;
        if (rs != null) {
            while (rs.next()) {
                String nome = rs.getString("ESPECIE");
                String familia = rs.getString("FAMILIA");
                if (!generos.containsKey(nome)) {
                    generos.put(nome, familia);
                }
            }
        }

        for (String key : generos.keySet()) {
            DAOGeneric<Familias> fam = new DAOGeneric<>(Familias.class);
            Familias familiaBuscada = new Familias();
            familiaBuscada = (Familias) (fam.getId(generos.get(key)).get(0));

            stmt.setString(1, key);
            stmt.setInt(2, familiaBuscada.getId());
            stmt.execute();
        }
        stmt.close();
    }

    public static String selectTabelaEspecies() {
        String sqlLinha = "select TOMBO.ESPECIE_ESPECIE_2 AS especie, ESPECIE.ESPECIE as genero, replace(replace(replace(TOMBO.ESPECIE_ESPECIE_AUTOR, '.', ''), ' ', ''), '''', '') as autor, FAMILIA.FAMILIA as familia FROM TOMBO \n"
                + "    INNER JOIN ESPECIE ON ESPECIE.CODIGO_ESPECIE = TOMBO.CODIGO_ESPECIE and TOMBO.CODIGO_FAMILIA = ESPECIE.CD_FAMILIA\n"
                + "    left join FAMILIA on FAMILIA.COD_FAMILIA = TOMBO.CODIGO_FAMILIA\n"
                + "    group by TOMBO.ESPECIE_ESPECIE_2, ESPECIE.ESPECIE,  TOMBO.ESPECIE_ESPECIE_AUTOR, FAMILIA.FAMILIA ";
        return sqlLinha;
    }

    public static void insereInstanciaEspecies(ResultSet rs) throws IOException, SQLException {
        int cont = 0;
        HashMap<String, String> especies = new HashMap<String, String>();
        HashMap<String, String> autores = new HashMap<String, String>();
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into especies "
                + "(nome, genero_id, autor_id, familia_id)"
                + " values (?,?,?,?)";
        PreparedStatement stmt = connection.prepareStatement(sql);

        if (rs != null) {
            while (rs.next()) {
                if (rs.getString("especie") != null) {
                    String nome = rs.getString("especie");
                    String genero = rs.getString("genero");
                    String autor = "";
                    if (!especies.containsKey(nome)) {
                        especies.put(nome, genero);
                        if (rs.getString("autor") != null) {
                            autor = rs.getString("autor");
                            autor = padronizaNomeAutor(autor);
                        }
                        autores.put(nome, autor);
                    }
                }
            }
        }
        for (String key : especies.keySet()) {
            Especies esp = new Especies();
            esp.setNome(key);
            String genero = especies.get(key);
            DAOGeneric<Generos> gen = new DAOGeneric<>(Generos.class);
            Generos generoBuscado = new Generos();
            generoBuscado = (Generos) (gen.getId(genero).get(0));
            esp.setGenero(generoBuscado);

            DAOGeneric<Familias> fam = new DAOGeneric<>(Familias.class);
            Familias familiaBuscada = new Familias();
            familiaBuscada = (Familias) (fam.getObject(generoBuscado.getFamilia().getId())).get(0);
            esp.setFamilia(familiaBuscada);

            if (!autores.get(key).equals("")) {
                String autor = autores.get(key);
                DAOGeneric<Autores> aut = new DAOGeneric<>(Autores.class);
                Autores autorBuscado = new Autores();
                autorBuscado = (Autores) (aut.getId(autor).get(0));
                esp.setAutor(autorBuscado);
            }
            stmt.setString(1, esp.getNome());
            stmt.setInt(2, esp.getGenero().getId());
            if (esp.getAutor() != null) {
                stmt.setInt(3, esp.getAutor().getId());
            }
            stmt.setInt(4, esp.getFamilia().getId());
            stmt.execute();

        }
        stmt.close();
    }

    public static String selectTabelaSubEspecies() {
        String sqlLinha = "select TOMBO.ESPECIE_ESPECIE_2 AS especie,\n"
                + "replace(replace(replace(TOMBO.ESPECIE_SUBSPECIE_AUTOR, '.', ''), ' ', ''), '''', '') as autor,\n"
                + "       TOMBO.ESPECIE_SUBSPECIE AS subspecies\n"
                + "FROM TOMBO where TOMBO.ESPECIE_SUBSPECIE is not null\n";
        return sqlLinha;
    }

    public static void insereInstanciaSubEspecies(ResultSet rs) throws IOException, SQLException {
        HashMap<String, String> subespecies = new HashMap<String, String>();
        HashMap<String, String> autores = new HashMap<String, String>();
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into sub_especies "
                + "(nome, especie_id, genero_id, autor_id, familia_id)"
                + " values (?,?,?,?,?)";
        PreparedStatement stmt = connection.prepareStatement(sql);

        int cont = 0;
        if (rs != null) {
            while (rs.next()) {
                String especie = rs.getString("especie");
                String nome = rs.getString("subspecies");
                String autor = "";

                if (nome != null && !subespecies.containsKey(nome)) {
                    subespecies.put(nome, especie);
                    if (rs.getString("autor") != null) {
                        autor = rs.getString("autor");
                        autor = padronizaNomeAutor(autor);
                    }
                    autores.put(nome, autor);
                }

            }
        }
        for (String sub : subespecies.keySet()) {

            Sub_Especies subesp = new Sub_Especies();
            subesp.setNome(sub);

            String especie = subespecies.get(sub);

            DAOGeneric<Especies> esp = new DAOGeneric<>(Especies.class);
            Especies especiesBuscado = new Especies();
            especiesBuscado = (Especies) (esp.getId(especie).get(0));

            subesp.setEspecie(especiesBuscado);
            subesp.setGenero(especiesBuscado.getGenero());
            subesp.setFamilia(especiesBuscado.getFamilia());

            if (!autores.get(sub).equals("")) {
                DAOGeneric<Autores> aut = new DAOGeneric<>(Autores.class);
                Autores autorBuscado = new Autores();
                autorBuscado = (Autores) (aut.getId(autores.get(sub)).get(0));
                subesp.setAutor(autorBuscado);
            }
            stmt.setString(1, subesp.getNome());
            stmt.setInt(2, subesp.getEspecie().getId());
            if (subesp.getAutor() != null) {
                stmt.setInt(4, subesp.getAutor().getId());
            }
            stmt.setInt(3, subesp.getGenero().getId());
            stmt.setInt(5, subesp.getFamilia().getId());
            stmt.execute();
        }
        stmt.close();
    }

    public static String selectTabelaVariedade() {
        String sqlLinha = "select TOMBO.ESPECIE_ESPECIE_2 AS especie,\n"
                + "replace(replace(replace(TOMBO.ESPECIE_VARIEDADE_AUTOR, '.', ''), ' ', ''), '''', '') as autor,\n"
                + "TOMBO.ESPECIE_VARIEDADE AS variedade\n"
                + "FROM TOMBO where TOMBO.ESPECIE_VARIEDADE is not null\n";

        return sqlLinha;
    }

    public static void insereInstanciaVariedades(ResultSet rs) throws IOException, SQLException {
        HashMap<String, String> variedades = new HashMap<String, String>();
        HashMap<String, String> autores = new HashMap<String, String>();
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into variedades "
                + "(nome, autor_id, especie_id, genero_id, familia_id)"
                + " values (?,?,?,?,?)";
        PreparedStatement stmt = connection.prepareStatement(sql);

        int cont = 0;
        if (rs != null) {
            while (rs.next()) {
                String especie = rs.getString("especie");
                String nome = rs.getString("variedade");
                String autor = "";

                if (nome != null && !variedades.containsKey(nome)) {
                    variedades.put(nome, especie);
                    if (rs.getString("autor") != null) {
                        autor = rs.getString("autor");
                        autor = padronizaNomeAutor(autor);
                    }
                    autores.put(nome, autor);
                }

            }
        }
        for (String vari : variedades.keySet()) {

            Variedades variedade = new Variedades();
            variedade.setNome(vari);

            String especie = variedades.get(vari);

            DAOGeneric<Especies> esp = new DAOGeneric<>(Especies.class);
            Especies especiesBuscado = new Especies();
            especiesBuscado = (Especies) (esp.getId(especie).get(0));

            variedade.setEspecie(especiesBuscado);
            variedade.setGenero(especiesBuscado.getGenero());
            variedade.setFamilia(especiesBuscado.getFamilia());

            if (!autores.get(vari).equals("")) {
                DAOGeneric<Autores> aut = new DAOGeneric<>(Autores.class);
                Autores autorBuscado = new Autores();
                autorBuscado = (Autores) (aut.getId(autores.get(vari)).get(0));
                variedade.setAutor(autorBuscado);
            }
            stmt.setString(1, variedade.getNome());
            stmt.setInt(3, variedade.getEspecie().getId());
            if (variedade.getAutor() != null) {
                stmt.setInt(2, variedade.getAutor().getId());
            }
            stmt.setInt(4, variedade.getGenero().getId());
            stmt.setInt(5, variedade.getFamilia().getId());
            stmt.execute();
        }
        stmt.close();
    }

    public static String selectTabelaColetor() {
        String sqlLinha = "SELECT * FROM COLETOR";
        return sqlLinha;
    }

    public static void insereInstanciaColetor(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into coletores "
                + "(nome, numero, id)"
                + " values (?,?, ?)";
        PreparedStatement stmt = connection.prepareStatement(sql);

        int cont = 0;
        ArrayList<String> coletores = new ArrayList<String>();
        if (rs != null) {
            while (rs.next()) {
                int numeroColetor = Integer.parseInt(rs.getString("NUM_COLETOR"));
                String nome = rs.getString("NOME_COLETOR");
                if (!coletores.contains(nome)) {
                    stmt.setString(1, nome);
                    stmt.setInt(2, numeroColetor);
                    stmt.setInt(3, numeroColetor);
                    stmt.execute();

                    Coletores coletor = new Coletores();
                    coletor.setNome(nome);
                    coletor.setNumero(numeroColetor);

                    coletores.add(nome);
                }

            }
        }
        stmt.close();
    }

    public static String selecionaColetoresTombo() {
        String sql = "SELECT TOMBO.HCF, TOMBO.COMPLEMENTO_COLETOR, TOMBO.TOMBO_COLETOR FROM TOMBO";
        return sql;
    }

    public static ResultSet buscaColetor(String nome, PreparedStatement stmt, Connection connection) throws SQLException {
        String sql = "SELECT * FROM coletores as c WHERE "
                + "c.nome LIKE \'%" + nome + "%\' LIMIT 1;";
        stmt = connection.prepareStatement(sql);
        ResultSet resultado = stmt.executeQuery();
        return resultado;
    }

    public static String selectTabelaColetorComplementar() {
        String sqlLinha = "SELECT TOMBO.HCF, TOMBO.COMPLEMENTO_COLETOR, TOMBO.TOMBO_COLETOR, COLETOR.NOME_COLETOR FROM TOMBO\n"
                + "inner join COLETOR on COLETOR.NUM_COLETOR = TOMBO.TOMBO_COLETOR \n"
                + "where hcf > 24252"
                + "order by hcf asc";
        return sqlLinha;
    }

    public static String[] separaColetores(String nome) {
        return nome.split("(&|;|,|:)");
    }

    public static void insereInstanciaColetorMysql(String nome) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into coletores "
                + "(nome)"
                + " values (?)";

        PreparedStatement stmt = connection.prepareStatement(sql);
        stmt.setString(1, nome);
        stmt.execute();
    }

    public static ResultSet buscaColetorTombo(int id, int hcf, PreparedStatement stmt, Connection connection) throws SQLException {
        String sql = "SELECT * FROM tombos_coletores as tc WHERE "
                + "tc.tombo_hcf = " + hcf + " and tc.coletor_id = " + id;
        stmt = connection.prepareStatement(sql);
        ResultSet resultado = stmt.executeQuery();
        return resultado;
    }

    public static void insereColetoresTombo(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into tombos_coletores "
                + "(tombo_hcf, coletor_id, principal)"
                + " values (?,?,?)";

        PreparedStatement stmt = connection.prepareStatement(sql);

        if (rs != null) {
            while (rs.next()) {
                int id = rs.getInt("hcf");
                int coletor_principal = rs.getInt("tombo_coletor");
                String complemento_coletor = rs.getString("complemento_coletor") == null ? "" : rs.getString("complemento_coletor");
                System.out.println("-----------------------");
                System.out.println("hcf: " + id);
                System.out.println("coletor principal: " + coletor_principal);
                System.out.println("complemento: " + complemento_coletor);

                if (!complemento_coletor.equals("") && !complemento_coletor.equals("?")) {
                    String coletores[] = separaColetores(complemento_coletor);
                    for (int i = 0; i < coletores.length; i++) {
                        if (!coletores[i].equals("")) {
                            String coletor = coletores[i].trim();
                            ResultSet result = buscaColetor(coletor, stmt, connection);
                            boolean achou = false;
                            while (result.next()) {
                                achou = true;
                                ResultSet resultColetorTombo = buscaColetorTombo(result.getInt("id"), id, stmt, connection);
                                boolean achouColetorTombo = false;
                                while (resultColetorTombo.next()) {
                                    achouColetorTombo = true;
                                }
                                if (!achouColetorTombo) {
                                    System.out.println("coletor i: " + coletor);
                                    System.out.println("id do coletor: " + result.getInt("id"));
                                    stmt.setInt(1, id);
                                    stmt.setInt(2, result.getInt("id"));
                                    stmt.setInt(3, 0);
                                    stmt.execute();
                                }
                            }
                            if (!achou) {
                                insereInstanciaColetorMysql(coletor);
                                ResultSet resultC = buscaColetor(coletor, stmt, connection);
                                if (resultC != null) {
                                    System.out.println("inseriu");
                                    System.out.println("coletor i: " + coletor);

                                    while (resultC.next()) {
                                        System.out.println("id do coletor: " + resultC.getInt("id"));
                                        stmt.setInt(1, id);
                                        stmt.setInt(2, resultC.getInt("id"));
                                        stmt.setInt(3, 0);
                                        stmt.execute();
                                    }
                                }
                            }
                        }
                    }

                }
                ResultSet result = buscaColetorTombo(coletor_principal, id, stmt, connection);
                boolean achou = false;
                while (result.next()) {
                    achou = true;
                }
                if (!achou) {
                    stmt.setInt(1, id);
                    stmt.setInt(2, coletor_principal);
                    stmt.setInt(3, 1);
                    stmt.execute();
                }
            }
        }

    }

    public static String selectTabelaLocalColeta() {
        String sqlLinha = "select * from LOCAL_COLETA where pais = 'Brasil' and cidade <> ''";
        return sqlLinha;
    }

    public static String selectTabelaLocalColeta2() {
        String sqlLinha = "select * from LOCAL_COLETA where pais <> 'Brasil' or cidade = ''";
        return sqlLinha;
    }

    public static String selectTabelaTombo() {
        String sqlLinha = "select TOMBO.HCF, TOMBO.VERMELHO, TOMBO.VERDE, TOMBO.AZUL, TOMBO.DATA_IDENTIFICACAO, TOMBO.TOMBO_FAMILIA_SUB, FAMILIA.FAMILIA, TOMBO.DATA_COLETA, TOMBO.OBSERVACAO, TOMBO.NOMES_POPULARES, \n"
                + "TOMBO.NUM_COLETA, TOMBO.LATITUDE,TOMBO.LONGITUDE, TOMBO.ALTITUDE, TOMBO.TOMBO_INSTITUICAO, RELEVO.TP_RELEVO, VEGETACAO.TP_VEGETACAO,\n"
                + "TOMBO.LOCAL_COLETA, TOMBO.ESPECIE_VARIEDADE, TOMBO.TIPO, TOMBO.ESPECIE_ESPECIE_2, TOMBO.ESPECIE_SUBSPECIE, SOLO.TP_SOLO,\n"
                + "ESPECIE.ESPECIE from TOMBO \n"
                + "LEFT JOIN ESPECIE ON ESPECIE.CODIGO_ESPECIE = TOMBO.CODIGO_ESPECIE AND ESPECIE.CD_FAMILIA = TOMBO.CODIGO_FAMILIA \n"
                + "LEFT JOIN FAMILIA ON FAMILIA.COD_FAMILIA = TOMBO.CODIGO_FAMILIA\n"
                + "LEFT JOIN RELEVO ON RELEVO.COD_RELEVO = TOMBO.CODIGO_RELEVO\n"
                + "LEFT JOIN VEGETACAO ON VEGETACAO.COD_VEGETACAO = TOMBO.CODIGO_VEGETACAO\n"
                + "LEFT JOIN SOLO ON SOLO.COD_SOLO = TOMBO.CODIGO_SOLO ORDER BY TOMBO.HCF ASC";

        return sqlLinha;
    }

    public static ResultSet buscaGenerica(String tabela, String nome, PreparedStatement stmt, Connection connection) throws SQLException {
        String sql = "SELECT * FROM " + tabela + " as c WHERE "
                + "c.nome LIKE ? LIMIT 1;";
        //PreparedStatement stmt = connection.prepareStatement(sql);
        stmt.setString(1, "%" + nome + "%");
        stmt = connection.prepareStatement(sql);
        ResultSet resultado = stmt.executeQuery();
        return resultado;
    }

    public static ResultSet buscaGenericaTombo(String tabela, String nome, PreparedStatement stmt, Connection connection) throws SQLException {
        String sql = "SELECT * FROM " + tabela + " as c WHERE "
                + "c.nome LIKE '%" + nome + "%' LIMIT 1;";

        stmt = connection.prepareStatement(sql);
        ResultSet resultado = stmt.executeQuery();
        return resultado;
    }

    public static ResultSet buscaGenericaColeta(String tabela, String nome, PreparedStatement stmt, Connection connection) throws SQLException {
        String sql = "SELECT * FROM " + tabela + " as c WHERE "
                + "c.nome LIKE \'%" + nome + "%\' LIMIT 1;";
        stmt = connection.prepareStatement(sql);
        ResultSet resultado = stmt.executeQuery();
        return resultado;
    }

    public static void updateLocalColetaVegetacao(int idCampo, int id, PreparedStatement stmt, Connection connection) throws SQLException {
        String sql = "UPDATE locais_coleta\n"
                + "SET vegetacao_id = " + idCampo + " \n"
                + "WHERE id = " + id;

        stmt = connection.prepareStatement(sql);
        stmt.execute();
    }

    public static void updateLocalColetaSolo(int idCampo, int id, PreparedStatement stmt, Connection connection) throws SQLException {
        String sql = "UPDATE locais_coleta\n"
                + "SET solo_id =  " + idCampo + " \n"
                + "WHERE id = " + id;

        stmt = connection.prepareStatement(sql);
        stmt.execute();
    }

    public static void updateLocalColetaRelevo(int idCampo, int id, PreparedStatement stmt, Connection connection) throws SQLException {
        String sql = "UPDATE locais_coleta\n"
                + "SET relevo_id = " + idCampo + " \n"
                + "WHERE id = " + id;
        stmt = connection.prepareStatement(sql);
        stmt.execute();
    }

    public static void getLocalColeta(ResultSet rs, PreparedStatement stmt, Connection connection) throws SQLException {
        String solo = rs.getString("TP_SOLO");
        String relevo = rs.getString("TP_RELEVO");
        String vegetacao = rs.getString("TP_VEGETACAO");

        if (rs.getString("LOCAL_COLETA") != null) {
            int localColeta = Integer.parseInt(rs.getString("LOCAL_COLETA"));

            int idSolo = -1;
            int idRelevo = -1;
            int idVeg = -1;

            if (solo != null) {
                ResultSet result = buscaGenericaColeta("solos", solo, stmt, connection);
                while (result.next()) {
                    idSolo = result.getInt("id");
                    updateLocalColetaSolo(idSolo, localColeta, stmt, connection);
                }
            }

            if (relevo != null) {
                ResultSet result = buscaGenericaColeta("relevos", relevo, stmt, connection);
                while (result.next()) {
                    idRelevo = result.getInt("id");
                    updateLocalColetaRelevo(idRelevo, localColeta, stmt, connection);
                }
            }

            if (vegetacao != null) {
                ResultSet result = buscaGenericaColeta("vegetacoes", vegetacao, stmt, connection);
                while (result.next()) {
                    idVeg = result.getInt("id");
                    updateLocalColetaVegetacao(idVeg, localColeta, stmt, connection);
                }
            }
            stmt.setInt(12, localColeta);
        } else {
            stmt.setNull(12, java.sql.Types.INTEGER);
        }
    }

    public static void insereInstanciaTombo(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into tombos "
                + "(hcf, data_coleta_dia, data_coleta_mes, data_coleta_ano, observacao,\n"
                + "nomes_populares, numero_coleta, latitude, longitude, altitude, entidade_id, local_coleta_id,"
                + "variedade_id, tipo_id, especie_id, genero_id, familia_id, sub_familia_id, "
                + "sub_especie_id, nome_cientifico, cor, taxon, "
                + "data_identificacao_dia, data_identificacao_mes, data_identificacao_ano)"
                + " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

        PreparedStatement stmt = connection.prepareStatement(sql);

        if (rs != null) {
            while (rs.next()) {

                int id = Integer.parseInt(rs.getString("hcf"));
                if (id == 4919) {
                    System.out.println("ehehe");
                }
                System.out.println(id);
                stmt.setInt(1, id);

                getLocalColeta(rs, stmt, connection);

                if (rs.getString("DATA_COLETA") != null) {
                    String dataC = rs.getString("DATA_COLETA").replaceAll("-", ".").replaceAll("/", ".");
                    String[] dataColeta = dataC.split("\\.");
                    stmt.setInt(4, Integer.parseInt(dataColeta[0]));
                    stmt.setInt(3, Integer.parseInt(dataColeta[1]));
                    stmt.setInt(2, Integer.parseInt(dataColeta[2]));
                } else {
                    stmt.setNull(2, java.sql.Types.INTEGER);
                    stmt.setNull(4, java.sql.Types.INTEGER);
                    stmt.setNull(3, java.sql.Types.INTEGER);
                }

                if (rs.getString("OBSERVACAO") != null) {
                    String observacao = rs.getString("OBSERVACAO");
                    stmt.setString(5, observacao);
                } else {
                    stmt.setNull(5, java.sql.Types.VARCHAR);
                }

                if (rs.getString("NOMES_POPULARES") != null) {
                    String nomesPopulares = rs.getString("NOMES_POPULARES");
                    stmt.setString(6, nomesPopulares);
                } else {
                    stmt.setNull(6, java.sql.Types.VARCHAR);
                }

                if (rs.getString("NUM_COLETA") != null) {
                    int numeroColeta = Integer.parseInt(rs.getString("NUM_COLETA"));
                    stmt.setInt(7, numeroColeta);
                } else {
                    stmt.setNull(7, java.sql.Types.INTEGER);
                }

                String lat = rs.getString("LATITUDE");
                String lng = rs.getString("LONGITUDE");
                if (lat != null) {
                    double latitude = Double.parseDouble(Coordenadas.converteParaGrausDecimais(lat));
                    stmt.setDouble(8, latitude);
                } else {
                    stmt.setNull(8, java.sql.Types.DOUBLE);
                }

                if (lng != null) {
                    double longitude = Double.parseDouble(Coordenadas.converteParaGrausDecimais(lng));
                    stmt.setDouble(9, longitude);
                } else {
                    stmt.setNull(9, java.sql.Types.DOUBLE);
                }

                if (rs.getString("ALTITUDE") != null) {
                    String altitude = (rs.getString("ALTITUDE")).replace("m", "");
                    altitude = altitude.replaceAll(" ", "");
                    altitude = altitude.replaceAll(",", ".");
                    if (altitude.contains("-")) {
                        altitude = altitude.split("-")[0];
                    }
                    stmt.setDouble(10, Double.parseDouble(altitude));
                } else {
                    stmt.setNull(10, java.sql.Types.DOUBLE);
                }

                if (rs.getInt("TOMBO_INSTITUICAO") > 0 && rs.getInt("TOMBO_INSTITUICAO") < 34) {
                    int entidade = rs.getInt("TOMBO_INSTITUICAO");
                    System.out.println(entidade);
                    stmt.setInt(11, entidade);
                } else {
                    stmt.setNull(11, java.sql.Types.INTEGER);
                }

                String nomeCientifico = "";
                String taxon = "";

                String familia = rs.getString("FAMILIA");

                if (familia != null) {
                    nomeCientifico += familia;
                    ResultSet result = buscaGenericaTombo("familias", familia, stmt, connection);
                    while (result.next()) {
                        int idFam = result.getInt("id");
                        stmt.setInt(17, idFam);
                    }
                    taxon = "familia";
                } else {
                    stmt.setNull(17, java.sql.Types.INTEGER);
                }

                String subfamilia = rs.getString("TOMBO_FAMILIA_SUB");

                if (subfamilia != null) {
                    nomeCientifico += " " + subfamilia;
                    ResultSet result = buscaGenericaTombo("sub_familias", subfamilia, stmt, connection);
                    while (result.next()) {
                        int idSubFam = result.getInt("id");
                        stmt.setInt(18, idSubFam);
                    }
                    taxon = "subfamilia";
                } else {
                    stmt.setNull(18, java.sql.Types.INTEGER);
                }

                String genero = rs.getString("ESPECIE");

                if (genero != null) {
                    nomeCientifico += " " + genero;
                    ResultSet result = buscaGenericaTombo("generos", genero, stmt, connection);
                    while (result.next()) {
                        int idGen = result.getInt("id");
                        stmt.setInt(16, idGen);
                    }
                    taxon = "genero";
                } else {
                    stmt.setNull(16, java.sql.Types.INTEGER);
                }

                String especie = rs.getString("ESPECIE_ESPECIE_2");

                if (especie != null) {
                    nomeCientifico += " " + especie;
                    ResultSet result = buscaGenericaTombo("especies", especie, stmt, connection);
                    while (result.next()) {
                        int idEsp = result.getInt("id");
                        stmt.setInt(15, idEsp);
                    }
                    taxon = "especie";
                } else {
                    stmt.setNull(15, java.sql.Types.INTEGER);
                }

                String subespecie = rs.getString("ESPECIE_SUBSPECIE");

                if (subespecie != null) {
                    nomeCientifico += " " + subespecie;
                    ResultSet result = buscaGenericaTombo("sub_especies", subespecie, stmt, connection);
                    while (result.next()) {
                        int idSubEsp = result.getInt("id");
                        stmt.setInt(19, idSubEsp);
                    }
                    taxon = "subespecie";
                } else {
                    stmt.setNull(19, java.sql.Types.INTEGER);
                }

                String variedade = rs.getString("ESPECIE_VARIEDADE");

                if (variedade != null) {
                    nomeCientifico += " " + variedade;
                    ResultSet result = buscaGenericaTombo("variedades", variedade, stmt, connection);
                    while (result.next()) {
                        int idVariedade = result.getInt("id");
                        stmt.setInt(13, idVariedade);
                    }
                    taxon = "variedade";
                } else {
                    stmt.setNull(13, java.sql.Types.INTEGER);
                }

                nomeCientifico = nomeCientifico.trim();

                String tipo = rs.getString("TIPO");

                if (tipo != null) {
                    ResultSet result = buscaGenericaTombo("tipos", tipo, stmt, connection);
                    while (result.next()) {
                        int idTipo = result.getInt("id");
                        stmt.setInt(14, idTipo);
                    }
                } else {
                    stmt.setNull(14, java.sql.Types.INTEGER);
                }

                if (!nomeCientifico.equals("")) {
                    stmt.setString(20, nomeCientifico);
                } else {
                    stmt.setNull(20, java.sql.Types.VARCHAR);
                }

                int vermelho = rs.getInt("VERMELHO");
                int verde = rs.getInt("VERDE");
                int azul = rs.getInt("AZUL");

                String cor = "VERMELHO";
                if (verde == 1) {
                    cor = "VERDE";
                } else if (azul == 1) {
                    cor = "AZUL";
                }

                stmt.setString(21, cor);
                if (taxon.equals("")) {
                    stmt.setNull(22, java.sql.Types.VARCHAR);
                } else {
                    stmt.setString(22, taxon);
                }

                String dataIdentificacao = rs.getString("DATA_IDENTIFICACAO");

                if (dataIdentificacao != null) {
                    dataIdentificacao = dataIdentificacao.replace("-", "/");
                    dataIdentificacao = dataIdentificacao.replace(".", "/");
                    dataIdentificacao = dataIdentificacao.replace(" ", "");
                    int totalData = dataIdentificacao.split("/").length;
                    String[] datas = dataIdentificacao.split("/");
                    if (totalData == 3) {
                        stmt.setInt(23, Integer.parseInt(datas[0]));
                        stmt.setInt(24, converteRomanoToNumber(datas[1]));
                        stmt.setInt(25, Integer.parseInt(datas[2]));
                    } else if (totalData == 2) {
                        stmt.setInt(24, converteRomanoToNumber(datas[0]));
                        stmt.setInt(25, Integer.parseInt(datas[1]));
                        stmt.setNull(23, java.sql.Types.INTEGER);
                    } else {
                        String data = datas[0];
                        if (data.contains("mb")) {
                            data = data.replace("mb", "");
                        }
                        stmt.setInt(25, Integer.parseInt(data));
                        stmt.setNull(23, java.sql.Types.INTEGER);
                        stmt.setNull(24, java.sql.Types.INTEGER);
                    }
                } else {
                    stmt.setNull(23, java.sql.Types.INTEGER);
                    stmt.setNull(24, java.sql.Types.INTEGER);
                    stmt.setNull(25, java.sql.Types.INTEGER);
                }

                stmt.execute();

            }
        }

    }

    public static int converteRomanoToNumber(String mes) {
        switch (mes.toUpperCase()) {
            case "I":
                return 1;
            case "II":
                return 2;
            case "III":
                return 3;
            case "IV":
                return 4;
            case "V":
                return 5;
            case "VI":
                return 6;
            case "VII":
                return 7;
            case "VIII":
                return 8;
            case "IX":
                return 9;
            case "X":
                return 10;
            case "XI":
                return 11;
            case "XII":
                return 12;
        }
        return 1;
    }

    public static void insereInstanciaLocalColeta2(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into locais_coleta "
                + "(id, descricao)"
                + " values (?,?)";

        PreparedStatement stmt = connection.prepareStatement(sql);

        int cont = 0;
        if (rs != null) {
            while (rs.next()) {
                int id = Integer.parseInt(rs.getString("CODIGO"));
                String local = rs.getString("LOCAL") == null ? "" : rs.getString("LOCAL");
                String regiaoLocal = rs.getString("REGIAO_DO_LOCAL") == null ? "" : "-" + rs.getString("REGIAO_DO_LOCAL");

                String estado = rs.getString("ESTADO") == null ? "" : "-" + rs.getString("ESTADO");
                String pais = rs.getString("PAIS") == null ? "" : "-" + rs.getString("PAIS");

                stmt.setInt(1, id);
                stmt.setString(2, (local + regiaoLocal + estado + pais));
                stmt.execute();
            }
        }
    }

    public static void insereInstanciaLocalColeta(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into locais_coleta "
                + "(id, cidade_id, descricao)"
                + " values (?,?,?)";

        PreparedStatement stmt = connection.prepareStatement(sql);

        int cont = 0;
        if (rs != null) {
            while (rs.next()) {
                int id = Integer.parseInt(rs.getString("CODIGO"));
                System.out.println(id);
                String local = rs.getString("LOCAL");
                String regiaoLocal = rs.getString("REGIAO_DO_LOCAL");
                String cidade = rs.getString("CIDADE");
                if (cidade.contains("'")) {
                    cidade = cidade.replaceAll("\'", "\\\'");
                }
                String estado = rs.getString("ESTADO");
                String pais = rs.getString("PAIS");
                System.out.println(cidade);

                ResultSet cidadeBuscada = buscaGenerica("cidades", cidade, stmt, connection);
                if (!cidadeBuscada.first()) {
                    locaisColetaErro.add(id);
                } else {
                    stmt.setInt(1, id);
                    stmt.setInt(2, cidadeBuscada.getInt("id"));
                    stmt.setString(3, (local + "\n" + regiaoLocal));
                    stmt.execute();
                }

            }
        }

    }

    public static String selectTabelaIdentificador() {
        String sqlLinha = "select * from IDENTIFICADOR";
        return sqlLinha;
    }

    public static void insereInstanciaIdentificador(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into usuarios "
                + "(id, nome, email, senha, tipo_usuario_id, herbario_id)"
                + " values (?,?,?,?,?,?)";

        PreparedStatement stmt = connection.prepareStatement(sql);

        if (rs != null) {
            while (rs.next()) {
                int id = Integer.parseInt(rs.getString("NUM_IDENTIFICADOR"));
                String nome = rs.getString("NOME");

                stmt.setInt(1, id);
                stmt.setString(2, nome);
                stmt.setString(3, "identificador" + id + "@gmail.com");
                stmt.setString(4, "$2a$10$mOCFQJPzQq1Z37zYu.yZuOebyXcNjXEjV7OF.Q8kSy/th1nXq7wtW");
                stmt.setInt(5, 3);
                stmt.setInt(6, 2);
                stmt.execute();

            }
        }

    }

    public static ResultSet buscarTombos(PreparedStatement stmt, Connection connection) throws SQLException {
        String sql = "SELECT * FROM tombos";
        //PreparedStatement stmt = connection.prepareStatement(sql);
        stmt = connection.prepareStatement(sql);
        ResultSet resultado = stmt.executeQuery();
        return resultado;
    }

    public static String convertToJson(ResultSet rs) throws SQLException {
        String retorno = "{";
        retorno += "\"hcf\":" + rs.getString("hcf") + ",";
        retorno += "\"data_tombo\": \"" + rs.getString("data_tombo") + "\",";
        retorno += "\"data_coleta_dia\":" + rs.getString("data_coleta_dia") + ",";
        String observacao = rs.getString("observacao") != null ? rs.getString("observacao").replace("\'", "\\'") : "";
        retorno += "\"observacao\":\"" + observacao + "\",";
        String nomePopular = rs.getString("nomes_populares") != null ? rs.getString("nomes_populares").replace("\'", "\\'") : "";
        retorno += "\"nomes_populares\":\"" + nomePopular + "\",";
        retorno += "\"numero_coleta\":" + rs.getString("numero_coleta") + ",";
        retorno += "\"latitude\":" + rs.getString("latitude") + ",";
        retorno += "\"longitude\":" + rs.getString("longitude") + ",";
        retorno += "\"altitude\":" + rs.getString("altitude") + ",";
        retorno += "\"entidade_id\":" + rs.getString("entidade_id") + ",";
        retorno += "\"local_coleta_id\":" + rs.getString("local_coleta_id") + ",";
        retorno += "\"variedade_id\":" + rs.getString("variedade_id") + ",";
        retorno += "\"tipo_id\":" + rs.getString("tipo_id") + ",";
        retorno += "\"situacao\": \"" + rs.getString("situacao") + "\",";
        retorno += "\"especie_id\":" + rs.getString("especie_id") + ",";
        retorno += "\"genero_id\":" + rs.getString("genero_id") + ",";
        retorno += "\"familia_id\":" + rs.getString("familia_id") + ",";
        retorno += "\"sub_familia_id\":" + rs.getString("sub_familia_id") + ",";
        retorno += "\"sub_especie_id\":" + rs.getString("sub_especie_id") + ",";
        String nomeCientifico = rs.getString("nome_cientifico") != null ? rs.getString("nome_cientifico").replace("\'", "\\'") : "";
        retorno += "\"nome_cientifico\":\"" + nomeCientifico + "\",";
        retorno += "\"colecao_anexa_id\":" + rs.getString("colecao_anexa_id") + ",";
        retorno += "\"cor\": \"" + rs.getString("cor") + "\",";
        retorno += "\"data_coleta_mes\":" + rs.getString("data_coleta_mes") + ",";
        retorno += "\"data_coleta_ano\":" + rs.getString("data_coleta_ano") + ",";
        retorno += "\"created_at\": \"" + rs.getString("created_at") + "\",";
        retorno += "\"updated_at\": \"" + rs.getString("updated_at") + "\",";
        retorno += "\"ativo\":" + rs.getString("ativo") + ",";
        retorno += "\"taxon\": \"" + rs.getString("taxon") + "\",";
        retorno += "\"data_identificacao_dia\":" + rs.getString("data_identificacao_dia") + ",";
        retorno += "\"data_identificacao_mes\":" + rs.getString("data_identificacao_mes") + ",";
        retorno += "\"data_identificacao_ano\":" + rs.getString("data_identificacao_ano") + ",";
        retorno += "\"rascunho\":" + rs.getString("rascunho");

        retorno += "}";
        return retorno;
    }

    public static void gerarAlteracao() throws SQLException, Exception {
        Connection connection = ConexaoMysql.getConexao();
        String status = "\'APROVADO\'";
        String observacao = "\'Migrado do banco do firebase.\'";
        String sql = "insert into alteracoes "
                + "(usuario_id, status, observacao, tombo_hcf, identificacao, tombo_json)"
                + " values (1159," + status + ", " + observacao + ", ?, ?, ?)";
 
        PreparedStatement stmt = connection.prepareStatement(sql);
        ResultSet rs = buscarTombos(stmt, connection);
        if (rs != null) {
            while (rs.next()) {
                String data_dia = rs.getString("data_identificacao_dia");
                String data_mes = rs.getString("data_identificacao_mes");
                String data_ano = rs.getString("data_identificacao_ano");
                int hcf = Integer.parseInt(rs.getString("hcf"));
                String tombo_json = convertToJson(rs).replaceAll("null", "\"\"").replaceAll("\n", "");
                boolean identificacao = false;

                if (!(data_dia == null && data_mes == null && data_ano == null)) {
                    identificacao = true;
                }

                stmt.setInt(1, hcf);
                stmt.setBoolean(2, identificacao);
                stmt.setString(3, tombo_json);
                stmt.execute();
                System.out.println(hcf);

            }
        }
    }

    public static String selectTabelaDoacao() {
        String sqlLinha = "select t.hcf, t.tombo_doado_a from TOMBO as t where t.tombo_doado_a is not null and t.tombo_doado_a <> 2";
        return sqlLinha;
    }
    
    public static void insereInstanciaDoacao(ResultSet rs) throws IOException, SQLException {
        Connection connection = ConexaoMysql.getConexao();
        String sql = "insert into doacao "
                + "(id, nome, email, senha, tipo_usuario_id, herbario_id)"
                + " values (?,?,?,?,?,?)";

        PreparedStatement stmt = connection.prepareStatement(sql);

        if (rs != null) {
            while (rs.next()) {
                int id = Integer.parseInt(rs.getString("NUM_IDENTIFICADOR"));
                String nome = rs.getString("NOME");

                stmt.setInt(1, id);
                stmt.setString(2, nome);
                stmt.setString(3, "identificador" + id + "@gmail.com");
                stmt.setString(4, "$2a$10$mOCFQJPzQq1Z37zYu.yZuOebyXcNjXEjV7OF.Q8kSy/th1nXq7wtW");
                stmt.setInt(5, 3);
                stmt.setInt(6, 2);
                stmt.execute();

            }
        }

    }

    public static void main(String[] args) throws IOException {
        try {
            Class.forName("org.firebirdsql.jdbc.FBDriver");
            Properties props = new Properties();
            props.setProperty("user", "SYSDBA");
            props.setProperty("password", "masterkey");
            props.setProperty("encoding", "NONE");
            Connection connection = DriverManager.getConnection(
                    "jdbc:firebirdsql:localhost/3050:C:/Firebird/herbario.gdb", props);
//             Connection connection = DriverManager.getConnection(
//                    "jdbc:firebirdsql:localhost/3050:C:/Firebird_1.5/databases/herbario.gdb", props);
            Statement st = connection.createStatement();

            ResultSet resultado = null;

            ConexaoMysql.getConexaoMySQL();

            ///////////////TIPO///////////////
            /*try {
                resultado = st.executeQuery(selectTabelaTipo());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaTipo(resultado);
            
            /////////////////RELEVO////////////////
            
            try {
                resultado = st.executeQuery(selectTabelaRelevo());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaRelevo(resultado);
            
            ///////////////VEGETACAO///////////////
            try {
                resultado = st.executeQuery(selectTabelaVegetacao());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaVegetacao(resultado);
            
            ////////////SOLO/////////
            try {
                resultado = st.executeQuery(selectTabelaSolo());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaSolo(resultado);
            
            ///////////////FAMILIA///////////////
            try {
                resultado = st.executeQuery(selectTabelaFamilia());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaFamilia(resultado);
            ///////////////autores///////////////
            try {
                resultado = st.executeQuery(selectTabelaAutores());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaAutores(resultado);
            ///////////////SUBFAMILIA///////////////
            try {
                resultado = st.executeQuery(selectTabelaSubfamilia());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaSubfamilia(resultado);
            ///////////////GENERO///////////////
            try {
                resultado = st.executeQuery(selectTabelaGenero());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaGenero(resultado);
            ///////////////ESPECIES///////////////
            try {
                resultado = st.executeQuery(selectTabelaEspecies());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaEspecies(resultado);
            ///////////////SUBESPECIES///////////////
            try {
                resultado = st.executeQuery(selectTabelaSubEspecies());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaSubEspecies(resultado);

            ///////////////VARIEDADE///////////////
            try {
                resultado = st.executeQuery(selectTabelaVariedade());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaVariedades(resultado);
            ///////////////coletor///////////////
            try {
                resultado = st.executeQuery(selectTabelaColetor());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaColetor(resultado);
            ///////////////LOCAL_COLETA/////////////// tem que migrar na mao
            /*try {
                resultado = st.executeQuery(selectTabelaLocalColeta());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaLocalColeta(resultado);*/
            ///////////////IDENTIFICADOR///////////////            
            /*try {
                resultado = st.executeQuery(selectTabelaIdentificador());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaIdentificador(resultado);*/
            ///////////////DOACAO///////////////            
//            try {
//                resultado = st.executeQuery(selectTabelaDoacao());
//            } catch (SQLException se) {
//                se.printStackTrace();
//            }
//            insereInstanciaDoacao(resultado);
//            try {;
//                resultado = st.executeQuery(selectTabelaLocalColeta2());
//            } catch (SQLException se) {
//                se.printStackTrace();
//            }
            ///////////TOMBO//////////
            /*try {
                resultado = st.executeQuery(selectTabelaTombo());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaTombo(resultado);
            ///////////COLETORES COMPLEMENTARES//////////
            try {
                resultado = st.executeQuery(selectTabelaColetorComplementar());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereColetoresTombo(resultado);*/
            ////////Alteracao//////////////
            //gerarAlteracao();*/
            
             ///////////////TOMBO EXSICATA///////////////
            try {
                resultado = st.executeQuery(selectTabelaTomboExsicata());
            } catch (SQLException se) {
                se.printStackTrace();
            }
            insereInstanciaTomboExsicata(resultado);

//            System.out.println("----------------Locais de coleta não inseridos-------------------");
//            for (int i = 0; i < locaisColetaErro.size(); i++) {
//                System.out.println(locaisColetaErro.get(i));
//            }
//            System.out.println("-----------------------------------");
         } catch (Exception e) {
            e.printStackTrace();
        }

    }

}
