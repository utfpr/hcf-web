export default (object, attributes = [], inverse = false) => {
    if (!Array.isArray(attributes)) {
        return {};
    }

    const red = o => (prev, key) => {
        const value = o[key];
        return value === undefined ? prev : { ...prev, [key]: value };
    };

    return attributes.reduce(red(object), {});
};
