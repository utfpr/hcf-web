/**
 * A função geraListaAleatorio, seleciona uma certa quantidade de códigos
 * de barras que serão utilizados para serm realizados as suas requisições
 * e comparações de seus dados.
 * @param {*} listaCodBarra, é uma lista com todos os código de barras.
 * @param {*} quantidadeAleatorios, quantidade de códigos de barras que devem ser selecionados.
 * @return listaCodBarra ou novaListaCodBarra, é uma lista de código de barras selecionados
 * que quando a quantidade de códigos de barras aleatórios é zero é retornando listaCodBarra,
 * caso contrário é retorna a novaListaCodBarra.
 */
export function geraListaAleatorio(listaCodBarra, quantidadeAleatorios) {
    if (quantidadeAleatorios === 0) {
        return listaCodBarra;
    }
    let aleatorio = 0;
    const novaListaCodBarra = [];
    for (let i = 0; i < quantidadeAleatorios; i += 1) {
        aleatorio = Math.floor((Math.random() * listaCodBarra.length) + 0);
        novaListaCodBarra.push(listaCodBarra[aleatorio]);
    }
    return novaListaCodBarra;
}

export default {};
