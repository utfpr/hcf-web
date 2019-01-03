module.exports = {
    enqueue(items) {
        const queue = [];
        /* Percorro todos os valores presentes em items */
        items.forEach(element => {
            /* Adiciono os itens na nossa fila */
            queue.push({ tombo_hcf: element.tombo_hcf, num_barra: element.num_barra });
        });
        return queue;
    },
    removeRepeat(queue) {
        /* Após enfilerar, é necessário verificar se existem com tombos repetidos */
        for (let i = 1; i < queue.length; i += 1) {
            let repeat = 0;
            queue.forEach(element => {
                if (queue[i].tombo_hcf === element.tombo_hcf) {
                    repeat += 1;
                }
            });
            if (repeat > 1) {
                queue.splice(i, 1);
            }
        }
    },
};
