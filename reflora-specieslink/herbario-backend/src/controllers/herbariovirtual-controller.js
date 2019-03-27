import {
    transformaLog,
    leLOG,
    transformaNomeLog,
    tempoGastoLog,
} from '../herbarium/log';

const fs = require('fs');

export const todosLogs = (request, response, next) => {
    const { herbarioVirtual } = request.query;
    let diretorioLog = '';
    if (herbarioVirtual === 'reflora') {
        /** linux */
        diretorioLog = `${__dirname}/../../logs/reflora`;
    } else {
        /** linux */
        diretorioLog = `${__dirname}/../../logs/specieslink/`;
    }
    // eslint-disable-next-line no-console
    console.log(herbarioVirtual);
    /** windows */
    let nomeArquivos = '';
    const listaArquivos = fs.readdirSync(diretorioLog);
    if (listaArquivos.length > 0) {
        // console.log('gg');
        listaArquivos.forEach(arquivos => {
            nomeArquivos = `${nomeArquivos}"${transformaNomeLog(arquivos)}", `;
        });
        const jsonLogs = nomeArquivos.substring(0, nomeArquivos.lastIndexOf(','));
        let tempoGasto = '';
        if (herbarioVirtual === 'reflora') {
            /** linux */
            tempoGasto = tempoGastoLog(leLOG(`reflora/${listaArquivos[listaArquivos.length - 1].replace('.log', '')}`));
        } else {
            /** linux */
            tempoGasto = tempoGastoLog(leLOG(`specieslink/${listaArquivos[listaArquivos.length - 1].replace('.log', '')}`));
        }
        // const tempoGasto = tempoGastoLog(leLOG(`specieslink/${listaArquivos[listaArquivos.length - 1].replace('.log', '')}`));
        response.status(200).json(JSON.parse(`{ "logs":[ ${jsonLogs} ], "duracao": "${tempoGasto}" }`));
    } else {
        response.status(200).json(JSON.parse('{ "logs":[ ], "duracao": " " }'));
    }
};

export const getLog = (request, response, next) => {
    const processaNomeArquivoUm = request.query.nomeLog.replace(/\//g, '-');
    const processaNomeArquivoDois = processaNomeArquivoUm.replace(/:/g, '-');
    const processaNomeArquivoTres = processaNomeArquivoDois.replace(/ /g, '-');
    let conteudoLog = '';
    if (request.query.herbarioVirtual === 'reflora') {
        conteudoLog = transformaLog(leLOG(`/reflora/${processaNomeArquivoTres}`));
    } else {
        conteudoLog = transformaLog(leLOG(`/specieslink/${processaNomeArquivoTres}`));
    }
    // const conteudoLog = transformaLog(leLOG(processaNomeArquivoTres));
    response.status(200).json(conteudoLog);
};

export default { };
