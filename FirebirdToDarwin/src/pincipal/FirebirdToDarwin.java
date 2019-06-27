/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pincipal;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import classes.DarwinCore;
import com.ibm.icu.text.CharsetDetector;
import com.ibm.icu.text.CharsetMatch;
import static com.sun.media.jfxmediaimpl.MediaUtils.error;
import static com.sun.org.apache.xalan.internal.xsltc.compiler.sym.error;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.*;
import static sun.management.Agent.error;
import static sun.management.Agent.error;

public class FirebirdToDarwin {

    public static class Info {

        double degrees;
        double minutes;
        double seconds;
        boolean isSouth;
    }
    static String taxon = "";
    static String identificationQualifier = "";
    static String infraspecificEpithet = "";

    public static Info parseCoordinateInfo(String coordinate) {
        Pattern p = Pattern.compile("^(\\d+)[^\\d]+(\\d+)[^\\d]+([\\d,]+)?([^\\d]*S)?");
        Matcher m = p.matcher(coordinate);
        if (!m.find()) {
            return null;
        }

        Info info = new Info();
        //     System.out.println("\n M3GROUP " + m);

        if (m.group(1) == null || m.group(1).equals("")) {
            info.degrees = 0.0;
        } else {
            info.degrees = Double.parseDouble(m.group(1));
        }
        if (m.group(2) == null || m.group(2).equals("")) {
            info.minutes = 0.0;
        } else {
            info.minutes = Double.parseDouble(m.group(2));
        }

        if (m.group(3) == null || m.group(3).equals("")) {
            info.seconds = 0.0;
        } else {
            info.seconds = Double.parseDouble(m.group(3).replaceAll(",", "."));
        }

        info.isSouth = m.group(4) != null;
        return info;
    }

    public static String nomeTabelas() {
        String nomeTabelas = "select rdb$relation_name\n"
                + "from rdb$relations\n"
                + "where rdb$view_blr is null \n"
                + "and (rdb$system_flag is null or rdb$system_flag = 0);";

        return nomeTabelas;
    }

    public static String getCamposTabela(String tabela) {
        String pegaCamposTabela = "SELECT rdb$field_name FROM rdb$relation_fields WHERE rdb$relation_name = '" + tabela + "'";
        return pegaCamposTabela;
    }

    public static String selectTabelaHerbario() { //ORDER BY TOMBO.HCF ASC
        String sqlLinha = "SELECT TOMBO.DATA_IDENTIFICACAO, TOMBO.NUM_COLETA, TOMBO.HCF, TOMBO.COMPLEMENTO_COLETOR, ESPECIE.ESPECIE, TIPO.TP_DESCRICAO,"
                + " TOMBO.OBS_TOMBO, TOMBO.DATA_COLETA, TOMBO.ALTITUDE, COLETOR.NUM_COLETOR, COLETOR.NOME_COLETOR, VEGETACAO.TP_VEGETACAO,"
                + " TOMBO_EXSICATA.COD_BARRA, "
                + " TOMBO.LATITUDE, TOMBO.LONGITUDE, TOMBO_EXSICATA.SEQUENCIA, TOMBO.ESPECIE_ESPECIE_2, "
                + " TOMBO.ESPECIE_SUBSPECIE, FAMILIA.FAMILIA, IDENTIFICADOR.NOME, LOCAL_COLETA.ESTADO, LOCAL_COLETA.CIDADE,"
                + " TOMBO.ESPECIE_VARIEDADE, TOMBO.ESPECIE_ESPECIE_AUTOR, TOMBO.ESPECIE_SUBSPECIE_AUTOR, TOMBO.ESPECIE_VARIEDADE_AUTOR,"
                + " TOMBO.NOMES_POPULARES\n"
                + " FROM TOMBO \n"
                + " LEFT JOIN COLETOR ON TOMBO.TOMBO_COLETOR = COLETOR.NUM_COLETOR\n"
                + " LEFT JOIN VEGETACAO ON VEGETACAO.COD_VEGETACAO = TOMBO.CODIGO_VEGETACAO\n"
                + " LEFT JOIN LOCAL_COLETA ON LOCAL_COLETA.CODIGO = TOMBO.LOCAL_COLETA\n"
                + " LEFT JOIN FAMILIA ON FAMILIA.COD_FAMILIA = TOMBO.CODIGO_FAMILIA\n"
                + " LEFT JOIN ESPECIE ON ESPECIE.CODIGO_ESPECIE = TOMBO.CODIGO_ESPECIE AND ESPECIE.CD_FAMILIA = TOMBO.CODIGO_FAMILIA\n"
                + " LEFT JOIN TIPO ON TOMBO.TIPO = TIPO.COD_TIPO\n"
                + " LEFT JOIN IDENTIFICADOR ON IDENTIFICADOR.NUM_IDENTIFICADOR = TOMBO.TOMBO_IDENTIFICADOR\n"
                + " INNER JOIN TOMBO_EXSICATA ON TOMBO.HCF = TOMBO_EXSICATA.NUM_TOMBO ORDER BY TOMBO.HCF ASC";
        return sqlLinha;
    }

    public static String converteParaGrausDecimais(String coordenada) {

        Info info = new Info();
        info = parseCoordinateInfo(coordenada);

        double resultado = 0.0;
        //     System.out.println("\n\n " + coordenada);
        //  System.out.println("\n\n INFO: " + info.degrees +" "+ info.minutes+" "+ info.seconds);
        try {
            resultado = info.degrees + ((info.minutes / 60) + (info.seconds / 3600));

            //   if (info.isSouth){
            resultado = resultado * -1;
        } catch (NullPointerException ex) {
            //  System.out.println("point" + ex);
        }

        //   }
        //   System.out.println(resultado);
        return String.valueOf(resultado);
    }

    public static String[] getParts(String s) {
        String part1 = "";
        String part2 = "";

        Pattern p = Pattern.compile("(\\w+\\.)");
        Matcher m = p.matcher(s);
        if (m.find()) {
            part1 = m.group(1);
        }

        part2 = s.replaceAll("\\s*\\w+\\.\\s*", " ");

        return new String[]{
            part1.trim(),
            part2.trim()
        };
    }

    public static String retornaNomeCientifico(String familia, String genero, String especie, String subespecie, String variedade) {
        String nomeCientifico = "";
        String nomeCientificoInfra = familia + " " + genero + " " + especie + " " + subespecie + " " + variedade;
        String[] valoresNomeCientifico = getParts(nomeCientificoInfra);
        boolean cf = valoresNomeCientifico[0].toLowerCase().equals("cf.");
        boolean aff = valoresNomeCientifico[0].toLowerCase().equals("aff.");
        if (aff) {
            System.out.println("aff " + aff);
        }
        if (cf || aff) {
            System.out.println("cf");
            identificationQualifier = "";
            identificationQualifier = valoresNomeCientifico[0];
        }
        if (!genero.equals("") || !especie.equals("")) {
            if (!genero.equals("")) {
                nomeCientifico = getParts(genero)[1];
                taxon = "gen.";
            }
            if (!especie.equals("")) {
                nomeCientifico += " " + getParts(especie)[1];
                taxon = "sp.";
                if (!subespecie.equals("")) {
                    nomeCientifico += " subsp. " + getParts(subespecie)[1];
                    taxon = "subsp.";
                    infraspecificEpithet = "";
                    infraspecificEpithet = getParts(subespecie)[1];
                }
                if (!variedade.equals("")) {
                    nomeCientifico += " var. " + getParts(variedade)[1];
                    taxon = "var.";
                    infraspecificEpithet = "";
                    infraspecificEpithet = getParts(variedade)[1];
                }
            }
        } else if (!familia.equals("")) {
            nomeCientifico = getParts(familia)[1];
            taxon = "fam.";
        }
        return nomeCientifico;
    }

    public static String getDay(String dataColeta) {
        return dataColeta.substring(8);
    }

    //2015-05-12
    //0123456789
    public static String getMonth(String dataColeta) {
        return dataColeta.substring(5, 7);
    }

    public static String getYear(String dataColeta) {
        return dataColeta.substring(0, 4);
    }

    public static void criarInstancia(ResultSet rs, FileWriter arq) throws IOException, SQLException {
        int cont = 0;
        if (rs != null) {
            while (rs.next()) {
                infraspecificEpithet = "";
                identificationQualifier = "";
                taxon = "";
                String dataIdentificacao = (rs.getString("DATA_IDENTIFICACAO") != null) ? rs.getString("DATA_IDENTIFICACAO") : "";
                String hcf = rs.getString("HCF") + rs.getString("SEQUENCIA");
                String complementoColetor = rs.getString("COMPLEMENTO_COLETOR");
                complementoColetor = (complementoColetor != null) ? new String(complementoColetor) : "";
                complementoColetor = (complementoColetor != null) ? complementoColetor.replaceAll(",", ";") : "";
                String genero = rs.getString("ESPECIE");
                genero = (genero != null) ? new String(genero) : "";
                genero = (genero != null) ? genero.replaceAll(",", ";") : "";
                String tipo = rs.getString("TP_DESCRICAO");
                tipo = (tipo != null) ? new String(tipo) : "";
                tipo = (tipo != null) ? tipo.replaceAll(",", ";") : "";
                String observacao = rs.getString("OBS_TOMBO");
                observacao = (observacao != null) ? new String(observacao) : "";
                observacao = (observacao != null) ? observacao.replaceAll(",", ";") : "";
                String dataColeta = rs.getString("DATA_COLETA");
                String day = (dataColeta != null) ? getDay(dataColeta) : "";
                String month = (dataColeta != null) ? getMonth(dataColeta) : "";
                String year = (dataColeta != null) ? getYear(dataColeta) : "";
                String altitude = rs.getString("ALTITUDE");
                String numColetor = rs.getString("NUM_COLETOR");
                String nomeColetor = rs.getString("NOME_COLETOR");
                String numColeta = rs.getString("NUM_COLETA");
                nomeColetor = (nomeColetor != null) ? new String(nomeColetor) : "";
                nomeColetor = (nomeColetor != null) ? nomeColetor.replaceAll(",", ";") : "";
                String vegetacao = rs.getString("TP_VEGETACAO");
                vegetacao = (vegetacao != null) ? new String(vegetacao) : "";
                vegetacao = (vegetacao != null) ? vegetacao.replaceAll(",", ";") : "";
                String codigoBarras = "{\"barcode\":" + "\"" + rs.getString("COD_BARRA") + "\"" + "}";
                String latitude = rs.getString("LATITUDE");
                latitude = (latitude != null) ? new String(latitude) : "";
                String longitude = rs.getString("LONGITUDE");
                longitude = (longitude != null) ? new String(longitude) : "";
                String especie = rs.getString("ESPECIE_ESPECIE_2");
                especie = (especie != null) ? new String(especie) : "";
                especie = (especie != null) ? especie.replaceAll(",", ";") : "";
                String subspecie = rs.getString("ESPECIE_SUBSPECIE");
                subspecie = (subspecie != null) ? new String(subspecie) : "";
                subspecie = (subspecie != null) ? subspecie.replaceAll(",", ";") : "";
                String familia = rs.getString("FAMILIA");
                familia = (familia != null) ? new String(familia) : "";
                familia = (familia != null) ? familia.replaceAll(",", ";") : "";
                String identificador = rs.getString("NOME");
                identificador = (identificador != null) ? new String(identificador) : "";
                identificador = (identificador != null) ? identificador.replaceAll(",", ";") : "";
                String especieVariedade = rs.getString("ESPECIE_VARIEDADE");
                especieVariedade = (especieVariedade != null) ? new String(especieVariedade) : "";
                especieVariedade = (especieVariedade != null) ? especieVariedade.replaceAll(",", ";") : "";
                String autorEspecie = rs.getString("ESPECIE_ESPECIE_AUTOR");
                autorEspecie = (autorEspecie != null) ? new String(autorEspecie) : "";
                autorEspecie = (autorEspecie != null) ? autorEspecie.replaceAll(",", ";") : "";
                String autorSubEspecie = rs.getString("ESPECIE_SUBSPECIE_AUTOR");
                autorSubEspecie = (autorSubEspecie != null) ? new String(autorSubEspecie) : "";
                autorSubEspecie = (autorSubEspecie != null) ? autorSubEspecie.replaceAll(",", ";") : "";
                String autorVariedade = rs.getString("ESPECIE_VARIEDADE_AUTOR");
                autorVariedade = (autorVariedade != null) ? new String(autorVariedade) : "";
                autorVariedade = (autorVariedade != null) ? autorVariedade.replaceAll(",", ";") : "";
                String nomesPopulares = rs.getString("NOMES_POPULARES");
                //      nomesPopulares = (nomesPopulares != null) ? new String(nomesPopulares) : "";
                nomesPopulares = (nomesPopulares != null) ? nomesPopulares.replaceAll(";", " | ") : "";
                String cidade = rs.getString("CIDADE");
                // System.out.println("Cidade code: " + discoverEnconding(cidade)); 
                //   cidade = (cidade != null) ? new String(cidade) : "";
                cidade = (cidade != null) ? cidade.replaceAll(",", ";") : "";
                String estado = rs.getString("ESTADO");
                estado = (estado != null) ? new String(estado) : "";
                estado = (estado != null) ? estado.replaceAll(",", ";") : "";

                estado = converteSiglaEstadoToNomeEstado(estado);

                if (!latitude.equals("")) {
                    System.out.println("Antes --------------------------");
                    System.out.println(latitude);
                    System.out.println("Depois ----------------------------------");
                    latitude = converteParaGrausDecimais(latitude);
                    System.out.println(latitude);
                    System.out.println("-----------------------------------------");
                }
                if (!longitude.equals("")) {
                    longitude = converteParaGrausDecimais(longitude);
                }

                if (familia.toLowerCase().equals("indeterminada")) {
                    familia = "";
                }
                if (dataIdentificacao != null) {
                    dataIdentificacao = formatarData(dataIdentificacao);
                }
                String autor = "";
                if (autorEspecie != null) {
                    autor = autorEspecie;
                }
                if (autorSubEspecie != null) {
                    if (autor.equals("")) {
                        autor += autorSubEspecie;
                    } else {
                        autor += ";" + autorSubEspecie;
                    }
                }
                if (autorVariedade != null) {
                    if (autor.equals("")) {
                        autor += autorVariedade;
                    } else {
                        autor += ";" + autorVariedade;
                    }
                }
                if (!"".equals(autor)) {
                    autor = autor.replaceAll(",", ".");
                }
                String coletor = "";

                if (nomeColetor != null) {
                    coletor = nomeColetor;
                }
                if (complementoColetor != null) {
                    if (coletor.equals("")) {
                        coletor += complementoColetor;
                    } else {
                        coletor += ";" + complementoColetor;
                    }
                }
                if (!"".equals(coletor)) {
                    coletor = coletor.replaceAll(",", ".");
                    if (coletor.split("&").length > 0) {
                        coletor = coletor.replaceAll("&", " | ");
                    }

                }

                String nomeCientifico = retornaNomeCientifico(familia, genero, especie, subspecie, especieVariedade);

                if (!autorEspecie.equals("")) {
                    Boolean inicialNome = autorEspecie.toUpperCase().charAt(0) == '(';
                    char autorInicial = inicialNome ? autorEspecie.toUpperCase().charAt(1) : autorEspecie.toUpperCase().charAt(0);
                    nomeCientifico += " " + autorInicial;
                }
                if (!"".equals(nomeCientifico)) {
                    nomeCientifico = nomeCientifico.replaceAll(",", ".");
                }

                String[] valores = getParts(especie);
                especie = valores[1];
                boolean cf = valores[0].toLowerCase().equals("cf.");
                boolean aff = valores[0].toLowerCase().equals("aff.");
                if (identificationQualifier.equals("") && (cf || aff)) {
                    identificationQualifier = valores[0];
                }

                DarwinCore dc = new DarwinCore(dataIdentificacao, codigoBarras, "Br:UTFPR:HCF:" + hcf, hcf, coletor, numColeta,
                        observacao, dataColeta, day, month, year, vegetacao, estado, cidade, altitude, altitude, latitude, 
                        longitude, familia, genero, especie, infraspecificEpithet, nomeCientifico, autor, taxon, 
                        nomesPopulares, tipo, identificador, dataIdentificacao, identificationQualifier);

                String resultadoFinal = dc.toString();
                resultadoFinal = resultadoFinal.replaceAll("null", "");

                arq.write(resultadoFinal);
            }
        }
        arq.flush();
    }

    public static String formatarData(String data) {
        String novaData = "";
        String dia = null;
        String mes = null;
        String ano = null;
        if (data != null) {
            String caracter = null;
            if (data.contains("-")) {
                caracter = "-";
            } else if (data.contains("/")) {
                caracter = "/";
            }

            if (caracter != null) {
                int aux = data.split(caracter).length;
                if (aux == 3) {
                    dia = data.split(caracter)[2];
                    mes = data.split(caracter)[1];
                    ano = data.split(caracter)[0];
                    mes = converteRomanoToNumber(mes);
                    return ano + "-" + mes + "-" + dia;
                } else if (aux == 2) {
                    mes = data.split(caracter)[1];
                    ano = data.split(caracter)[0];
                    mes = converteRomanoToNumber(mes);
                    return ano + "-" + mes;
                }
            } else {
                return data;
            }

        }
        return novaData;
    }

    public static String converteRomanoToNumber(String mes) {
        switch (mes) {
            case "I":
                mes = "01";
                break;
            case "II":
                mes = "02";
                break;
            case "III":
                mes = "03";
                break;
            case "IV":
                mes = "04";
                break;
            case "V":
                mes = "05";
                break;
            case "VI":
                mes = "06";
                break;
            case "VII":
                mes = "07";
                break;
            case "VIII":
                mes = "08";
                break;
            case "IX":
                mes = "09";
                break;
            case "X":
                mes = "10";
                break;
            case "XI":
                mes = "11";
                break;
            case "XII":
                mes = "12";
                break;
        }
        return mes;
    }

    public static String converteSiglaEstadoToNomeEstado(String sigla) {
        if (sigla != null) {
            if (sigla.toUpperCase().equals("PR")) {
                return "Paraná";
            } else if (sigla.toUpperCase().equals("AC")) {
                return "Acre";
            } else if (sigla.toUpperCase().equals("AL")) {
                return "Alagoas";
            } else if (sigla.toUpperCase().equals("AP")) {
                return "Amapá";
            } else if (sigla.toUpperCase().equals("AM")) {
                return "Amazonas";
            } else if (sigla.toUpperCase().equals("BA")) {
                return "Bahia";
            } else if (sigla.toUpperCase().equals("CE")) {
                return "Ceará";
            } else if (sigla.toUpperCase().equals("DF")) {
                return "Distrito Federal";
            } else if (sigla.toUpperCase().equals("ES")) {
                return "Espírito Santo";
            } else if (sigla.toUpperCase().equals("GO")) {
                return "Goiás";
            } else if (sigla.toUpperCase().equals("MA")) {
                return "Maranhão";
            } else if (sigla.toUpperCase().equals("MT")) {
                return "Mato Grosso";
            } else if (sigla.toUpperCase().equals("MS")) {
                return "Mato Grosso do Sul";
            } else if (sigla.toUpperCase().equals("MG")) {
                return "Minas Gerais";
            } else if (sigla.toUpperCase().equals("PA")) {
                return "Pará";
            } else if (sigla.toUpperCase().equals("PB")) {
                return "Paraíba";
            } else if (sigla.toUpperCase().equals("PE")) {
                return "Pernambuco";
            } else if (sigla.toUpperCase().equals("PI")) {
                return "Piauí";
            } else if (sigla.toUpperCase().equals("RJ")) {
                return "Rio de Janeiro";
            } else if (sigla.toUpperCase().equals("RN")) {
                return "Rio Grande do Norte";
            } else if (sigla.toUpperCase().equals("RS")) {
                return "Rio Grande do Sul";
            } else if (sigla.toUpperCase().equals("RO")) {
                return "Rondônia";
            } else if (sigla.toUpperCase().equals("RR")) {
                return "Roraima";
            } else if (sigla.toUpperCase().equals("SC")) {
                return "Santa Catarina";
            } else if (sigla.toUpperCase().equals("SP")) {
                return "São Paulo";
            } else if (sigla.toUpperCase().equals("SE")) {
                return "Sergipe";
            } else if (sigla.toUpperCase().equals("TO")) {
                return "Tocantins";
            }
        }
        return "";
    }

    public static String discoverEnconding(String texto) {
        CharsetDetector charsetDetector = new CharsetDetector();
        charsetDetector.setText(texto.getBytes()); // Aqui você seta sua String
        CharsetMatch detect = charsetDetector.detect();
        return detect.getName();
    }

    public static void main(String[] args) throws Exception {
        FileWriter arq = new FileWriter("C:\\Users\\Elaine\\Documents\\gitlab\\tcc\\codigo\\darwin.csv");
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

            ResultSet rs = null;
            String queryDarwin = selectTabelaHerbario();

            try {
                rs = st.executeQuery(queryDarwin);
            } catch (SQLException se) {
                se.printStackTrace();

            }

            String cabecalho = "basisOfRecord\ttype\tlanguage\tmodified\tinstitutionID\tinstitutionCode\tcollectionCode"
                    + "\tlicense\trightsHolder\tdynamicProperties\toccurrenceID\tcatalogNumber\trecordedBy\trecordNumber\t"
                    + "disposition\toccurrenceRemarks\teventDate\tyear\tmonth\tday\thabitat\tcontinent\tcountry\tcountryCode\tstateProvince\t"
                    + "county\tminimumElevationInMeters\tmaximumElevationInMeters\tverbatimLatitude\tverbatimLongitude\t"
                    + "decimalLatitude\tdecimalLongitude\tgeodeticDatum\tgeoreferenceProtocol\tkingdom\tfamily\tgenus\t"
                    + "specificEpithet\tinfraspecificEpithet\tscientificName\tscientificNameAuthorship\ttaxonRank\t"
                    + "vernacularName\ttaxonRemarks\ttypeStatus\tidentifiedBy\tdateIdentified\tidentificationQualifier \n";
            arq.write(cabecalho);

            criarInstancia(rs, arq);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
//"SELECT TOMBO.DATA_IDENTIFICACAO, TOMBO.HCF, TOMBO.COMPLEMENTO_COLETOR, ESPECIE.ESPECIE, TIPO.TP_DESCRICAO,"
//                + " TOMBO.OBS_TOMBO, TOMBO.DATA_COLETA, TOMBO.ALTITUDE, COLETOR.NUM_COLETOR, COLETOR.NOME_COLETOR, VEGETACAO.TP_VEGETACAO,"
//                + " TOMBO_EXSICATA.COD_BARRA, "
//                + " TOMBO.LATITUDE, TOMBO.LONGITUDE, TOMBO_EXSICATA.SEQUENCIA, TOMBO.ESPECIE_ESPECIE_2, "
//                + " TOMBO.ESPECIE_SUBSPECIE, FAMILIA.FAMILIA, IDENTIFICADOR.NOME, LOCAL_COLETA.ESTADO, LOCAL_COLETA.CIDADE,"
//                + " TOMBO.ESPECIE_VARIEDADE, TOMBO.ESPECIE_ESPECIE_AUTOR, TOMBO.ESPECIE_SUBSPECIE_AUTOR, TOMBO.ESPECIE_VARIEDADE_AUTOR,"
//                + " TOMBO.NOMES_POPULARES\n"
//                + " FROM TOMBO \n"
//                + " LEFT JOIN COLETOR ON TOMBO.TOMBO_COLETOR = COLETOR.NUM_COLETOR\n"
//                + " LEFT JOIN VEGETACAO ON VEGETACAO.COD_VEGETACAO = TOMBO.CODIGO_VEGETACAO\n"
//                + " LEFT JOIN LOCAL_COLETA ON LOCAL_COLETA.CODIGO = TOMBO.LOCAL_COLETA\n"
//                + " LEFT JOIN FAMILIA ON FAMILIA.COD_FAMILIA = TOMBO.CODIGO_FAMILIA\n"
//                + " LEFT JOIN ESPECIE ON ESPECIE.CODIGO_ESPECIE = TOMBO.CODIGO_ESPECIE AND ESPECIE.CD_FAMILIA = TOMBO.CODIGO_FAMILIA\n"
//                + " LEFT JOIN TIPO ON TOMBO.TIPO = TIPO.COD_TIPO\n"
//                + " LEFT JOIN IDENTIFICADOR ON IDENTIFICADOR.NUM_IDENTIFICADOR = TOMBO.TOMBO_IDENTIFICADOR\n"
//                + " INNER JOIN TOMBO_EXSICATA ON TOMBO.HCF = TOMBO_EXSICATA.NUM_TOMBO WHERE TOMBO.HCF = 6065"
