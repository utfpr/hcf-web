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
    // eslint-disable-next-line no-console
    console.log(novaListaCodBarra);
    return novaListaCodBarra;
}

export default {};
