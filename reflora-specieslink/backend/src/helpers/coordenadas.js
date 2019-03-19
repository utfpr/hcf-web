export const converteParaDecimal = coordenada => {
    const regex = /^(\d+)\D+(\d+)\D+(\d+(?:[.,]\d+)?)\W+([NSWE])$/;
    const matches = coordenada.match(regex);

    if (matches.length < 5) {
        throw new Error('Coordenada inválida');
    }

    const graus = parseInt(matches[1]);
    const minutos = parseInt(matches[2]);
    const segundos = parseFloat(matches[3].replace(',', '.'));
    const hemisferio = matches[4];

    const sinal = (['S', 'W'].includes(hemisferio)) ? -1 : 1;

    return sinal * (graus + (minutos / 60) + (segundos / 3600));
};


export default {};
