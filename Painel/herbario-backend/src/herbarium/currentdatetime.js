module.exports = {
	getCurrentDateTime : function (action){
	    var date = new Date();
	    /* A partir do date retorna o dia */
	    var day = date.getDate();

	    /* Janeiro é zero, por isso o mais um */
	    /* A partir do date retorna o mês */
	    var month = date.getMonth() + 1;
	    
	    /* A partir do date retorna o ano */
	    var year = date.getFullYear();

		/* A partir do date retorna a hora */
	    var time = date.toLocaleTimeString('pt-BR', {hour: "numeric", minute: "numeric", second: "numeric"});

		/* Converte os dados somente para formatar */
		var dayString = "";
		var monthString = "";
		var dateTime = "";

		if(day < 10)
			dayString = '0' + day.toString();

		if(month < 10)
			monthString = '0' + month.toString();

		if(dayString.length > 0)
			dateTime = dayString + '/';
		else
			dateTime = day + '/';

		if(monthString.length > 0)
			dateTime = dateTime + monthString + '/' + year + ' ' + time + ' - ' + action;
		else
			dateTime = dateTime + month + '/' + year + ' ' + time + ' - ' + action;

		return dateTime;
	}
};