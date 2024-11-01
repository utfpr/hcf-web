/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package conversao_novo_banco;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author Elaine
 */
public class Coordenadas {

    public Coordenadas() {
    }
    
    
    public static class Info {
        double degrees;
        double minutes;
        double seconds;
        boolean isSouth;
    }
    
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

}
