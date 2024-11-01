package Dao;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.Persistence;

public class DAOGeneric<T> { 
    private static final EntityManager em = Persistence.createEntityManagerFactory("UP").createEntityManager();
    
    private Class clazz;

    public DAOGeneric(Class clazz) {
        this.clazz = clazz;
    }

    public void insert(T entity) {
        em.getTransaction().begin();
        em.persist(entity);
        em.getTransaction().commit();
    }

    public void update(T entity) {
        em.getTransaction().begin();
        em.merge(entity);
        em.getTransaction().commit();
    }

    public void remove(int id) {
        T obj = this.get(id);
        if (obj == null) {
            return;
        }
        em.getTransaction().begin();
        em.remove(obj);
        em.getTransaction().commit();
    }

    public T get(int id) {
        return (T) em.find(this.clazz, id);
    }

    public List<T> list() {
        return em.createQuery("SELECT c FROM " + clazz.getSimpleName() + " c").getResultList();
    }   
    public List<T> getId(String nome) {
        return em.createQuery("SELECT e FROM "+clazz.getSimpleName()+" e WHERE e.nome LIKE '%"+nome+"%'").getResultList();
    }
    
    public List<T> getObject(int id) {
        return em.createQuery("SELECT e FROM "+clazz.getSimpleName()+" e WHERE e.id = "+id).getResultList();
    }
    
     public List<T> getObjectDoisLike(String nome) {
        return em.createQuery("SELECT e FROM "+clazz.getSimpleName()+" e WHERE e.nome LIKE '%"+nome+"%'").getResultList();
    }
    
    public List<T> getIdAutor(String nome) {
        return em.createQuery("SELECT e FROM "+clazz.getSimpleName()+" e WHERE e.nomeAntigo LIKE '%"+nome+"%'").getResultList();
    }
    /*  public List<T> listByEmissora(String nome) {
        return em.createQuery("SELECT e FROM "+clazz.getSimpleName()+" e WHERE e.nome LIKE '%"+nome+"%'").getResultList();
    }
      public List<T> listByProdutora(String nome) {
        return em.createQuery("SELECT e FROM "+clazz.getSimpleName()+" e WHERE e.nome LIKE '%"+nome+"%'").getResultList();
    }
      public List<T> listByDiretor(String nome) {
        return em.createQuery("SELECT e FROM "+clazz.getSimpleName()+" e WHERE e.nome LIKE '%"+nome+"%'").getResultList();
    }
      public List<T> listByCategoria(String nome) {
        return em.createQuery("SELECT e FROM "+clazz.getSimpleName()+" e WHERE e.nome LIKE '%"+nome+"%'").getResultList();
    };*/
}
