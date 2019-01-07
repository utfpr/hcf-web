import masker from 'vanilla-masker';

export default value => {
    const sanitizedValue = value.replace(/[^0-9NSWO]+/g, '');
    return masker.toPattern(sanitizedValue, '99°99\'99"A');
}