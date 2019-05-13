const { resolve } = require('path');

const { UPLOAD_PATH, STORAGE_PATH } = process.env;

export const upload = UPLOAD_PATH || resolve(__dirname, '..', '..', 'uploads');
export const storage = STORAGE_PATH || resolve(__dirname, '..', '..', 'storage');

export default {};
