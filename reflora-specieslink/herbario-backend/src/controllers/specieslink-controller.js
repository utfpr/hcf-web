import fs from 'fs';
import { main } from '../herbarium/specieslink/main';

export const preparaRequisicao = (request, response, next) => {
    const conteudoArquivo = fs.readFileSync(request.file.path, 'utf8');
    if (conteudoArquivo.includes('datelastmodified\tinstitutioncode\tcollectioncode\tcatalognumber\tscientificname\tbasisofrecord\tkingdom\tphylum\tclass\tordem\tfamily\tgenus\tspecies\tsubspecies\tscientificnameauthor\tidentifiedby\tyearidentified\tmonthidentified\tdayidentified\ttypestatus\tcollectornumber\tfieldnumber\tcollector\tyearcollected\tmonthcollected\tdaycollected\tjulianday\ttimeofday\tcontinentocean\tcountry\tstateprovince\tcounty\tlocality\tlongitude\tlatitude\tlongitude_mun\tlatitude_mun\tcoordinateprecision\tboundingbox\tminimumelevation\tmaximumelevation\tminimumdepth\tmaximumdepth\tsex\tpreparationtype\tindividualcount\tpreviouscatalognumber\trelationshiptype\trelatedcatalogitem\tnotes\tbarcode')) {
        main(request.file.filename, response);
        // console.log(request.file)
    } else {
        response.status(200).json(JSON.parse(' { "result": "error_file" } '));
    }
};

export default { };
