
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
    const transformacaoUm = conteudo.replace(/\[/g, ' "[');
    const transformacaoDois = transformacaoUm.replace(/\./g, '." ,');
    const transformacaoTres = transformacaoDois.substring(0, transformacaoDois.lastIndexOf(','));
    const transformacaoQuatro = `{ "log": [ ${transformacaoTres} ] }`;
    // eslint-disable-next-line no-console
    console.log(transformacaoQuatro);
    return JSON.parse(transformacaoQuatro);
}
