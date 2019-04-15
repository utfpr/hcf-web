/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Elaine
 */
@Entity
public class Tipos implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nome;
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date created_at;
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date updated_at;

    public Tipos(int id, String nome) {  
        created_at = Calendar.getInstance().getTime();
        updated_at = Calendar.getInstance().getTime();
        this.id = id;
        this.nome = nome;
    }

    public Tipos(String nome) {
        this.nome = nome;
    }
    
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
    
}
