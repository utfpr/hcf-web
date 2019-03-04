
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
    const ultimaAtualizacao = conteudo.substring(conteudo.lastIndexOf('[') + 1, conteudo.lastIndexOf(']'));
    const transformacaoUm = conteudo.replace(/\[/g, '{ "saida": "[');
    const transformacaoDois = transformacaoUm.replace(/\./g, '." } ,');
    const transformacaoTres = transformacaoDois.substring(0, transformacaoDois.lastIndexOf(','));
    const transformacaoQuatro = `{ "horario": "${ultimaAtualizacao}", "log": [ ${transformacaoTres} ] }`;
    return JSON.parse(transformacaoQuatro);
}
