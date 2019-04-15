/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

import java.io.Serializable;
import javafx.scene.text.Text;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

/**
 *
 * @author Elaine
 */
@Entity
public class Locais_Coleta implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String descricao;
    @ManyToOne
    private Vegetacoes vegetacao;
    @ManyToOne
    private Relevos relevo;
    @ManyToOne
    private Solos solo;
    @ManyToOne
    private Cidades cidade;
    private String complemento;
    @ManyToOne
    private Fase_sucessional fase;

    
    public Locais_Coleta() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Relevos getRelevo() {
        return relevo;
    }

    public void setRelevo(Relevos relevo) {
        this.relevo = relevo;
    }

    public Solos getSolo() {
        return solo;
    }

    public void setSolo(Solos solo) {
        this.solo = solo;
    }

    public Fase_sucessional getFase() {
        return fase;
    }

    public void setFase(Fase_sucessional fase) {
        this.fase = fase;
    }

    public Vegetacoes getVegetacao() {
        return vegetacao;
    }

    public void setVegetacao(Vegetacoes vegetacao) {
        this.vegetacao = vegetacao;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }  

    public Cidades getCidade() {
        return cidade;
    }

    public void setCidade(Cidades cidade) {
        this.cidade = cidade;
    }

   

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }
    
}
