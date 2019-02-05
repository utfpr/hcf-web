import fs from 'fs';
import moment from 'moment';

function getCurrentHour() {
    return moment().format('DD/MM/YYYY-HH:mm:ss');
}

function startApplication(fileName, herbarium) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] Inicializando a aplicação do ${herbarium}\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

function getFileName(herbarium) {
    /* Não funciona o barra / e : para criar arquivo */
    const fileName = moment().format('DD-MM-YYYY-HH-mm-ss');
    startApplication(fileName, herbarium);
    return fileName;
}

/* LOG - relacionado ao database */
function connectDatabase(fileName) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] Conectando ao banco de dados\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

function whatQuery(query) {
    /* Não dá pra importar a const de database, pois gera um loop */
    if (query === 'SELECT MAX(num_barra) AS MAX FROM tombos_fotos') {
        return 'Realizando o select e capturando o maior valor de código de barra';
    }
    return 'Problemas com o select';
}

function selectDatabase(fileName, query) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] ${whatQuery(query)}\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

/* LOG - relacionado ao tombo */
function processMaxCodBarra(fileName) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] Processando o maior código de barra existente\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

/* LOG - relacionado ao reflora */
function startRequestReflora(fileName) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] Inicializando a requisição da API do Reflora\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

function requestReflora(fileName, codBarra) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] Realizando a requisição do código de barra ${codBarra}\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

function generateCodBarra(fileName, codBarra) {
    const pathFile = `logs\\${fileName}.log`;
    let content = `[${getCurrentHour()}] `;
    if (codBarra === -1) {
        content = `${content}[ERRO] Erro na geração do código de barra\n`;
    } else {
        content = `${content}Gerando o código de barra ${codBarra}\n`;
    }
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

function processResponseReflora(fileName, codBarra) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] Convertendo para JSON o resultado da requisição do código de barra ${codBarra}\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

function hasResultResponseReflora(fileName, codBarra) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] O código de barra ${codBarra} possui registro no Reflora\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

function noResultResponseReflora(fileName, codBarra) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] O código de barra ${codBarra} não possui registro no Reflora\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

function errorResponseReflora(fileName, codBarra, error) {
    const pathFile = `logs\\${fileName}.log`;
    const content = `[${getCurrentHour()}] O código de barra ${codBarra} teve problemas na conexão ${error}\n`;
    fs.writeFileSync(pathFile, content, { flag: 'a' });
}

export default {
    startApplication, getFileName, connectDatabase, selectDatabase, processMaxCodBarra, startRequestReflora, requestReflora, generateCodBarra, processResponseReflora, hasResultResponseReflora, noResultResponseReflora, errorResponseReflora,
};
