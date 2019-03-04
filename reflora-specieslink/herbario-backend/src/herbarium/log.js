
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
    console.log(`1${conteudo}`);
    const transformacaoUm = conteudo.replace(/\[/g, '{ "saida": "[');
    const transformacaoDois = transformacaoUm.replace(/\./g, '." } ,');
    console.log(`2${transformacaoDois}`);
    const transformacaoTres = transformacaoDois.substring(0, transformacaoDois.lastIndexOf(','));
    console.log(`3${transformacaoTres}`);
    const transformacaoQuatro = `{ "horario": "${ultimaAtualizacao}", "log": [ ${transformacaoTres} ] }`;
    console.log(JSON.parse(transformacaoQuatro));
    // return JSON.parse(transformacaoQuatro);
}
