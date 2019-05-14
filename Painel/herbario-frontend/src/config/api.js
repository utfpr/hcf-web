const {
    API_BASE_URL = 'http://localhost:3003/api',
} = process.env;

export const baseUrl = API_BASE_URL;

export const fotosBaseUrl = `${baseUrl}/fotos`;

export default {};
