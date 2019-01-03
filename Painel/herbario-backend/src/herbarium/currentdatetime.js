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

        if (day < 10) {
            dayString = `0${day.toString()}`;
        }

        if (month < 10) {
            monthString = `0${month.toString()}`;
        }

        if (dayString.length > 0) {
            dateTime = `${dayString}/`;
        } else {
            dateTime = `${day}/`;
        }

        if (monthString.length > 0) {
            dateTime = `${dateTime + monthString}/${year} ${time} - ${action}`;
        } else {
            dateTime = `${dateTime + month}/${year} ${time} - ${action}`;
        }

        return dateTime;
    },
};
