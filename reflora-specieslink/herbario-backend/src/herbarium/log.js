
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

export function leLOG(nomeArquivo) {
    const caminhoArquivo = `logs/${nomeArquivo}.log`;
    return fs.readFileSync(caminhoArquivo, 'utf8');
}

export function transformaLog(conteudo) {
    // const trans = conteudo.replace(/\{}/g, '"');
    const transformacaoUm = conteudo.replace(/\[/g, '"');
    const transformacaoDois = transformacaoUm.replace(/\] /g, '": "');
    const transformacaoTres = transformacaoDois.replace(/\./g, '",');
    const transformacaoQuatro = transformacaoTres.substring(0, transformacaoTres.lastIndexOf(','));
    const transformacaoCinco = `{${transformacaoQuatro}}`;
    return JSON.parse(transformacaoCinco);
}
