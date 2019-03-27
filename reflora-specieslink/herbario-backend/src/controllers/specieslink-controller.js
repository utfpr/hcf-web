export const preparaRequisicao = (request, response, next) => {
    // eslint-disable-next-line no-console
    console.log('Request ---', request.body);
    // eslint-disable-next-line no-console
    console.log('Request file ---', request.file);
    response.status(200).json(JSON.parse(' { "result": "success" } '));
};

export default { };
