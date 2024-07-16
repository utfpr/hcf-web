package br.edu.utfpr.cm.firebirddarwincore.model;

import java.nio.charset.StandardCharsets;

public class DarwinCore {
    final private String basisOfRecord;
    final private String modified;
    final private String institutionID;
    final private String institutionCode;
    final private String collectionCode;
    private String license;
    final private String rightsHolder;
    final private String dynamicProperties;
    final private String occurrenceID;
    final private String catalogNumber;
    final private String recordedBy;
    final private String recordNumber;
    private String disposition;
    final private String occurrenceRemarks;
    final private String eventDate;
    final private String habitat;
    final private String continent;
    final private String country;
    final private String countryCode;
    final private String stateProvince;
    final private String county;
    private String minimumElevationInMeters;
    private String maximumElevationInMeters;
    private String verbatimLatitude;
    private String verbatimLongitude;
    final private String geodeticDatum;
    final private String georeferenceProtocol;
    final private String kingdom;
    final private String family;
    final private String genus;
    final private String specificEpithet;
    final private String infraspecificEpithet;
    final private String scientificName;
    private String scientificNameAuthorship;
    final private String taxonRank;
    final private String vernacularName;
    private String taxonRemarks;
    final private String typeStatus;
    private String identifiedBy;
    final private String dateIdentified;
    final private String decimalLatitude;
    final private String decimalLongitude;
    final private String type;
    final private String year;
    final private String month;
    final private String day;
    final private String language;
    final private String identificationQualifier;
    final private String sequence;

    public DarwinCore(
            String modified,
            String dynamicProp,
            String occurrenceID,
            String catalogNumber,
            String recordedBy,
            String recordNumber,
            String occurrenceRemarks,
            String eventDate,
            String year,
            String month,
            String day,
            String habitat,
            String stateProvince,
            String county,
            String minElevation,
            String maxElevation,
            String latitude,
            String longitude,
            String family,
            String genus,
            String specificEpithet,
            String infraspecificEpithet,
            String scientificName,
            String scientificNameAuthors,
            String taxonRank,
            String vernacularName,
            String typeStatus,
            String identifiedBy,
            String dateIdentified,
            String identificationQualifier,
            String sequence
    ) {
        this.basisOfRecord = "PreservedSpecimen";
        this.language = "pt";
        this.year = convertFromIso88591ToUtf8(year);
        this.month = convertFromIso88591ToUtf8(month);
        this.day = convertFromIso88591ToUtf8(day);
        this.sequence = sequence;
        this.identificationQualifier = identificationQualifier == null ? "" : identificationQualifier;
        this.modified = modified == null ? "" : convertFromIso88591ToUtf8(modified);
        this.dynamicProperties = dynamicProp == null ? "" : convertFromIso88591ToUtf8(dynamicProp);
        this.occurrenceID = occurrenceID == null ? "" : occurrenceID;
        this.catalogNumber = catalogNumber == null ? "" : convertFromIso88591ToUtf8(catalogNumber);
        this.recordedBy = recordedBy == null ? "" : convertFromIso88591ToUtf8(recordedBy.replaceAll(";", ""));
        this.recordNumber = recordNumber == null ? "" : convertFromIso88591ToUtf8(recordNumber);
        this.occurrenceRemarks = occurrenceRemarks == null ? "" : convertFromIso88591ToUtf8(occurrenceRemarks);
        this.eventDate = eventDate == null ? "" : convertFromIso88591ToUtf8(eventDate);
        this.habitat = habitat == null ? "" : convertFromIso88591ToUtf8(habitat);
        this.stateProvince = stateProvince == null ? "" : stateProvince;
        this.county = county == null ? "" : convertFromIso88591ToUtf8(county);
        this.minimumElevationInMeters = minElevation == null ? "" : convertFromIso88591ToUtf8(minElevation);
        this.maximumElevationInMeters = maxElevation == null ? "" : convertFromIso88591ToUtf8(maxElevation);
        if (!this.minimumElevationInMeters.equals("")) {
            this.minimumElevationInMeters = this.minimumElevationInMeters.replaceAll("m", "");
        }
        if (!this.maximumElevationInMeters.equals("")) {
            this.maximumElevationInMeters = this.maximumElevationInMeters.replaceAll("m", "");
        }
        this.decimalLatitude = latitude == null ? "" : convertFromIso88591ToUtf8(latitude);
        this.decimalLongitude = longitude == null ? "" : convertFromIso88591ToUtf8(longitude);
        this.family = family == null ? "" : family;
        this.genus = genus == null ? "" : genus;
        this.specificEpithet = specificEpithet == null ? "" : convertFromIso88591ToUtf8(specificEpithet);
        this.infraspecificEpithet = infraspecificEpithet == null ? "" : infraspecificEpithet;
        this.scientificName = scientificName == null ? "" : convertFromIso88591ToUtf8(scientificName);
        this.scientificNameAuthorship = scientificNameAuthors == null ? "" : convertFromIso88591ToUtf8(scientificNameAuthors);
        if (!this.scientificNameAuthorship.equals("") && this.scientificNameAuthorship.split("&").length > 0) {
            this.scientificNameAuthorship = convertFromIso88591ToUtf8(this.scientificNameAuthorship.replaceAll("&", " | ").replaceAll(";", ""));
        }
        this.taxonRank = taxonRank == null ? "" : taxonRank;
        this.vernacularName = vernacularName == null ? "" : convertFromIso88591ToUtf8(vernacularName);
        this.taxonRemarks = taxonRemarks == null ? "" : convertFromIso88591ToUtf8(taxonRemarks);
        this.typeStatus = typeStatus == null ? "" : convertFromIso88591ToUtf8(typeStatus);
        this.identifiedBy = identifiedBy == null ? "" : convertFromIso88591ToUtf8(identifiedBy);
        if (!this.identifiedBy.equals("") && this.identifiedBy.split("&").length > 0) {
            this.identifiedBy = this.identifiedBy.replaceAll("&", " | ");
        }
        this.dateIdentified = dateIdentified == null ? "" : dateIdentified;
        this.institutionID = "02.032.297/0005-26";
        this.institutionCode = "UTFPR";
        this.collectionCode = "Herbário da Universidade Tecnologica Federal do Paraná - Campus Campo Mourão - HCF";
        this.license = "Os dados não devem ser usados para fins comerciais. Qualquer uso dos dados de registros em análises ou"
                + " publicações devem constar nos agradecimentos; com a devida indicação de procedência dos dados originais;"
                + " e o responsável pela coleção deverá ser notificado; os dados; mesmo parciais; não podem ser redistribuídos"
                + " sem explícita autorização escrita do responsável pela coleção. Uma cópia de qualquer publicação em que os"
                + " dados sejam citados deve ser enviada ao Herbário HCF. Pesquisadores e suas instituições são responsáveis"
                + " pelo uso adequado dos dados. Este herbário procura minimizar a entrada de erros dos dados; entretanto não"
                + " garantimos que a base de dados esteja livre de erros; tanto na identificação quanto na transcrição dos dados"
                + " de coleta das amostras.";
        this.license = this.license.replaceAll(";", ".");
        this.rightsHolder = "UTFPR";
        this.continent = "America do Sul";
        this.country = "Brasil";
        this.countryCode = "BR";
        this.geodeticDatum = "WGS84";
        this.georeferenceProtocol = "GPS";
        this.kingdom = "Plantae";
        this.type = "Colecao";
    }

    private String convertFromIso88591ToUtf8(String text) {
        return new String(text.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String toString() {
        return basisOfRecord + "\t" + type + "\t" + language + "\t" + modified + "\t" + institutionID + "\t" + institutionCode
                + "\t" + collectionCode + "\t" + license + "\t" + rightsHolder + "\t" + dynamicProperties + "\t" + occurrenceID + "\t" + catalogNumber
                + "\t" + recordedBy + "\t" + recordNumber + "\t" + disposition + "\t" + occurrenceRemarks + "\t" + eventDate + "\t" + day + "\t" + month + "\t" + year + "\t" + habitat + "\t" + continent + "\t" + country + "\t" + countryCode
                + "\t" + stateProvince + "\t" + county + "\t" + minimumElevationInMeters + "\t" + maximumElevationInMeters + "\t" + verbatimLatitude + "\t" + verbatimLongitude
                + "\t" + decimalLatitude + "\t" + decimalLongitude + "\t" + geodeticDatum + "\t" + georeferenceProtocol + "\t" + kingdom + "\t" + family
                + "\t" + genus + "\t" + specificEpithet + "\t" + infraspecificEpithet + "\t" + scientificName + "\t" + scientificNameAuthorship
                + "\t" + taxonRank + "\t" + vernacularName + "\t" + taxonRemarks + "\t" + typeStatus + "\t" + identifiedBy + "\t" + dateIdentified + "\t" + identificationQualifier + "\t" + sequence + "\n";
    }
}
