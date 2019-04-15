/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Date;
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
public class Sub_Familias implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nome;
    @ManyToOne
    private Familias familia;
    @ManyToOne
    private Autores autor;
  
    
    public Sub_Familias() {
        created_at = Calendar.getInstance().getTime();
        updated_at = Calendar.getInstance().getTime();
        ativo = true;
    }
    

    public Familias getFamilia() {
        return familia;
    }

    public void setFamilia(Familias familia) {
        this.familia = familia;
    }

 
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date created_at;
    @Temporal(TemporalType.TIMESTAMP)
    private java.util.Date updated_at;
    private boolean ativo;

    public Familias getFamilias() {
        return familia;
    }

    public void setFamilias(Familias familias) {
        this.familia = familias;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public Autores getAutor() {
        return autor;
    }

    public void setAutor(Autores autor) {
        this.autor = autor;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Date getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Date updated_at) {
        this.updated_at = updated_at;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
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