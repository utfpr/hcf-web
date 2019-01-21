function temPendencia(tombo) {
    /**
     * Tentamos utilizar o for each, porém dava um erro que a função era do tipo void.
     */
    for (let i = 0; i < tombo.length; i += 1) {
        if (tombo[i].status === 'ESPERANDO') {
            return true;
        }
    }
    return false;
}

/**
 * Para poder utilizar as funções em outros arquivosé necessário exportar
 */
export default {
    temPendencia,
};
