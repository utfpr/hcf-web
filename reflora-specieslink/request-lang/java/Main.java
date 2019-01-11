import java.io.*;
import java.net.*;


/**
 *
 * @author chandon
 */
public class Main {

    /**
     * @param args the command line arguments
     * @throws java.net.MalformedURLException
     */
    public static void main(String[] args) throws MalformedURLException, IOException {
        int count = 0;
        for(int i = 1; i < 301; i++){
            String num_barra = "HCF000000";
            if(i < 10){
                num_barra = num_barra + "00" + String.valueOf(i);
            } else if(i < 100){
                num_barra = num_barra + "0" + String.valueOf(i);
            } else {
                num_barra = num_barra + String.valueOf(i);
            }
            String request = "http://servicos.jbrj.gov.br/v2/herbarium/";
            request = request + num_barra;
            URL url = new URL(request);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");

            int status = con.getResponseCode();

            try (BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()))) {
                String inputLine;
                StringBuffer content = new StringBuffer();
                while ((inputLine = in.readLine()) != null) {
                     content.append(inputLine);
                }
                String conteudo = content.toString();
                if(conteudo.contains("\"rightsholder\":\"HCF\"")){
                    System.out.println(num_barra);
                    count++;
                }
                
             }
            con.disconnect();
            // System.out.println(request);
        }

        System.out.println(count);
    }
    
}
