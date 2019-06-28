const colunas = [
    'basisOfRecord',
    'type',
    'language',
    'modified',
    'institutionID',
    'institutionCode',
    'collectionCode',
    'license',
    'rightsHolder',
    'dynamicProperties',
    'occurrenceID',
    'catalogNumber',
    'recordedBy',
    'recordNumber',
    'disposition',
    'occurrenceRemarks',
    'eventDate',
    'year',
    'month',
    'day',
    'habitat',
    'continent',
    'country',
    'countryCode',
    'stateProvince',
    'county',
    'minimumElevationInMeters',
    'maximumElevationInMeters',
    'verbatimLatitude',
    'verbatimLongitude',
    'decimalLatitude',
    'decimalLongitude',
    'geodeticDatum',
    'georeferenceProtocol',
    'kingdom',
    'family',
    'genus',
    'specificEpithet',
    'infraspecificEpithet',
    'scientificName',
    'scientificNameAuthorship',
    'taxonRank',
    'vernacularName',
    'taxonRemarks',
    'typeStatus',
    'identifiedBy',
    'dateIdentified',
    'identificationQualifier',
];


export default colunas;

export function colunasComoLinhaUnica() {
    return colunas.join('\t');
}
