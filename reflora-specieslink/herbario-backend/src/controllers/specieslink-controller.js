/* eslint-disable max-len */
import fs from 'fs';
import { main } from '../herbarium/specieslink/main';
import { criaConexao, selectTemExecucaoSpeciesLink } from '../herbarium/database';

export const preparaRequisicao = (request, response, next) => {
    const conteudoArquivo = fs.readFileSync(request.file.path, 'utf8');
    if (conteudoArquivo.includes('datelastmodified\tinstitutioncode\tcollectioncode\tcatalognumber\tscientificname\tbasisofrecord\tkingdom\tphylum\tclass\tordem\tfamily\tgenus\tspecies\tsubspecies\tscientificnameauthor\tidentifiedby\tyearidentified\tmonthidentified\tdayidentified\ttypestatus\tcollectornumber\tfieldnumber\tcollector\tyearcollected\tmonthcollected\tdaycollected\tjulianday\ttimeofday\tcontinentocean\tcountry\tstateprovince\tcounty\tlocality\tlongitude\tlatitude\tlongitude_mun\tlatitude_mun\tcoordinateprecision\tboundingbox\tminimumelevation\tmaximumelevation\tminimumdepth\tmaximumdepth\tsex\tpreparationtype\tindividualcount\tpreviouscatalognumber\trelationshiptype\trelatedcatalogitem\tnotes\tbarcode')) {
        main(request.file.filename, response);
        // console.log(request.file)
    } else {
        response.status(200).json(JSON.parse(' { "result": "error_file" } '));
    }
};

export const statusExecucao = (request, response, next) => {
    // a
    const conexao = criaConexao();
    selectTemExecucaoSpeciesLink(conexao).then(execucao => {
        // eslint-disable-next-line no-console
        console.log(`-------------------->${execucao.length}`);
        if (execucao.length === 0) {
            response.status(200).json(JSON.parse(' { "result": false } '));
        } else {
            const horaFim = execucao[0].dataValues.hora_fim;
            // eslint-disable-next-line no-console
            console.log(`-------------------->${horaFim}`);
            if (horaFim === null) {
                response.status(200).json(JSON.parse(' { "result": false } '));
            } else if (horaFim === 'EXECUTANDO') {
                response.status(200).json(JSON.parse(' { "result": true } '));
            } else {
                response.status(200).json(JSON.parse(' { "result": false } '));
            }
        }
    });
};

export default { };
