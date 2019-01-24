import Request from 'request';

function hasPendency(tombo) {
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

function checkSuggest(tomboCodBarra, queueTomboAlterado) {
    /**
    * Chamamos essa função para verificar se esse tombo tem pendência ou não
    * Após a execução dessa função teremos 291, dos 300
    */
    if (!hasPendency(queueTomboAlterado)) {
        /**
         * Quando o tamanho é maior que zero, significa que tem tombos alterados
         * Detalhe que não dá para por junto com o if de cima, porque senão
         * se o tombo tem pendência ele irá realizar a comparação.
        */
        if (queueTomboAlterado.length > 0) {
            /**
             * Após passar por essa condição, no nosso caso só será feito de 256
             * Então primeiramente eu vou comparar com as alterações que foram feitas
             */

            const options = {
                url: `http://servicos.jbrj.gov.br/v2/herbarium/${tomboCodBarra}`,
                method: 'GET',
                headers: {
                    // 'User-Agent': 'my-reddit-client',
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Content-type': 'application/json',
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
                    'Accept-Charset': 'utf-8',
                    Connection: 'keep-alive',
                    Host: 'servicos.jbrj.gov.br',
                    'Upgrade-Insecure-Requests': '1',
                },
            };

            Request(options, (err, res, body) => {
                // const json = JSON.parse(body);
                // console.log(json);
            });

            /**
             * Então faço a requisição ao reflora, se der match com algumas das sugestões
             * já paro e vou para o próximo tombo.
            */
            /**
             * Depois de comparar com as sugestões feitas (caso não encontre), devo comparar com
             * os valores da tabela de tombos. Mas como ele sai do if ele irá comparar com lá.
             */
        }
        /**
         * Caso contrário não foi alterado nenhum tombo, portanto só comparar com tabela de tombos.
         * Dos 300, 35 não tem pendências.
        */
    }
}

/**
 * Para poder utilizar as funções em outros arquivosé necessário exportar
 */
export default {
    hasPendency, checkSuggest,
};
