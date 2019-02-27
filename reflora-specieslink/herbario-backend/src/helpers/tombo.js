export function converteInteiroParaRomano(numero) {
    if (numero === 1) {
        return 'I';
    } if (numero === 2) {
        return 'II';
    } if (numero === 3) {
        return 'III';
    } if (numero === 4) {
        return 'IV';
    } if (numero === 5) {
        return 'V';
    } if (numero === 6) {
        return 'VI';
    } if (numero === 7) {
        return 'VII';
    } if (numero === 8) {
        return 'VIII';
    } if (numero === 9) {
        return 'IX';
    } if (numero === 10) {
        return 'X';
    } if (numero === 11) {
        return 'XI';
    }
    return 'XII';
}

export default {};
