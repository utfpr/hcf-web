function enqueue(items) {
    const queue = [];
    /* Percorro todos os valores presentes em items */
    items.forEach(element => {

        /* LOG console.log(dateTime.formatLog('Enfilerando os itens retornado pela consulta do BD.')); */
        /* Adiciono os itens na nossa fila */
        queue.push({ tombo_hcf: element.tombo_hcf, num_barra: element.num_barra });

    });

    /* Retorno a fila com todos os itens */
    return queue;
}

function removeTomboRepetido(queue) {
    /* É necessário verificar se existem com tombos repetidos, na qual utilizamos o for, pois precisamos
    do índice dele para remover o elemento repetido da fila */
    /* Além disso, isso acontece, pois um número de tombo pode ter mais de um código de barra */
    /* LOG console.log(dateTime.formatLog('Procurando elementos na fila repetidos.')); */
    for (let i = 0; i < queue.length; i += 1) {
        let repeat = 0;

        /* É necesśario outro for para que seja comparado todos os itens da fila */
        queue.forEach(element => {
            if (queue[i].tombo_hcf === element.tombo_hcf) {
                repeat += 1;
            }
        });

        /* Se contem mais de uma repetição, temos que remover aquele elemento */
        /* LOG console.log(dateTime.formatLog('Removendo elemento repetido.')); */
        if (repeat > 1) {
            queue.splice(i, 1);
        }
    }
}

export default {
    enqueue, removeTomboRepetido,
};
