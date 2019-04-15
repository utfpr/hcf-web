/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

import java.io.Serializable;
import java.util.Calendar;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Elaine
 */
@Entity
public class Familias implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nome;
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date created_at;
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date updated_at;
    private boolean ativo;

    public Familias() {
        created_at = Calendar.getInstance().getTime();
        updated_at = Calendar.getInstance().getTime();
        ativo = true;
    }
    
   
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    @Override
    public String toString() {
        return "Familias{" + "id=" + id + ", nome=" + nome + '}';
    }


    
    
    
}
