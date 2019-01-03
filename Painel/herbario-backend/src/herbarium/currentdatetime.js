module.exports = {
    getCurrentDateTime(action) {
        const date = new Date();
        /* A partir do date retorna o dia */
        const day = date.getDate();

        /* Janeiro é zero, por isso o mais um */
        /* A partir do date retorna o mês */
        const month = date.getMonth() + 1;

        /* A partir do date retorna o ano */
        const year = date.getFullYear();

        /* A partir do date retorna a hora */
        const time = date.toLocaleTimeString('pt-BR', { hour: 'numeric', minute: 'numeric', second: 'numeric' });

        /* Converte os dados somente para formatar */
        let dayString = '';
        let monthString = '';
        let dateTime = '';

        /* Se o dia for menor que 10 adiciona um algarismo para formatar */
        if (day < 10) {
            dayString = `0${day.toString()}`;
        }

        /* Se o mês for menor que 10 adiciona um algarismo para formatar */
        if (month < 10) {
            monthString = `0${month.toString()}`;
        }

        /* Verifica se é necessário converter os dados de dia para string */
        if (dayString.length > 0) {
            dateTime = `${dayString}/`;
        } else {
            dateTime = `${day}/`;
        }

        /* Verifica se é necessário converter os dados de mês para string */
        if (monthString.length > 0) {
            dateTime = `${dateTime + monthString}/${year} ${time} - ${action}`;
        } else {
            dateTime = `${dateTime + month}/${year} ${time} - ${action}`;
        }

        return dateTime;
    },
};
