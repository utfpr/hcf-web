import fs from 'fs';
import moment from 'moment';

export function getHoraAtual() {
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

export function trocaCaractere(texto, indice, novoValor) {
    return texto.substring(0, indice) + novoValor + texto.substring(indice + 1, texto.length);
}

export function processaNomeLog(nomeLog) {
    // '1', '15/03/2019-19:56:10', NULL, 'MANUAL', 'REFLORA'
    const transformacaoUm = trocaCaractere(nomeLog, 2, '-');
    const transformacaoDois = trocaCaractere(transformacaoUm, 5, '-');
    const transformacaoTres = trocaCaractere(transformacaoDois, 13, '-');
    return trocaCaractere(transformacaoTres, 16, '-');
}

export function getHoraFim(conteudoLog) {
    const inicio = conteudoLog.lastIndexOf('[');
    const fim = conteudoLog.lastIndexOf(']');
    return conteudoLog.substring(inicio + 1, fim);
}

export function transformaNomeLog(nomeArquivo) {
    const processoUm = nomeArquivo.replace('.log', '');
    const processoDois = trocaCaractere(processoUm, 2, '/');
    const processoTres = trocaCaractere(processoDois, 5, '/');
    const processoQuatro = trocaCaractere(processoTres, 10, ' ');
    const processoCinco = trocaCaractere(processoQuatro, 13, ':');
    return trocaCaractere(processoCinco, 16, ':');
    // return processoSeis;
}

export function tempoGastoLog(conteudoLog) {
    const dataInicial = conteudoLog.substring(conteudoLog.indexOf('[') + 1, conteudoLog.indexOf(']'));
    const dataFinal = conteudoLog.substring(conteudoLog.lastIndexOf('[') + 1, conteudoLog.lastIndexOf(']'));
    const diferenca = moment(dataFinal, 'DD/MM/YYYY-HH:mm:ss').diff(moment(dataInicial, 'DD/MM/YYYY-HH:mm:ss'));
    const duracao = moment.duration(diferenca);
    return Math.floor(duracao.asHours()) + moment.utc(diferenca).format(':mm:ss');
    // console.log(dataInicial);
    // console.log(dataFinal);
    // a
}
