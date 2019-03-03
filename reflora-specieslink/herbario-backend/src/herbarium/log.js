import fs from 'fs';
import moment from 'moment';

function getHoraAtual() {
    return moment().format('DD/MM/YYYY-HH:mm:ss');
}

export function getNomeArquivo() {
    /* Não funciona o barra / e : para criar arquivo */
    return moment().format('DD-MM-YYYY-HH-mm-ss');
}

export function escreveLOG(nomeArquivo, mensagem) {
    const caminhoArquivo = `logs/${nomeArquivo}.log`;
    const conteudo = `[${getHoraAtual()}] ${mensagem}\n`;
    fs.writeFileSync(caminhoArquivo, conteudo, { flag: 'a' });
}
