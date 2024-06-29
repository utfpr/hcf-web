package br.edu.utfpr.cm.firebirddarwincore.model;

public class DarwinCore {
    private String basisOfRecord;
    private String modified;
    private String institutionID;
    private String institutionCode;
    private String collectionCode;
    private String license;
    private String rightsHolder;
    private String dynamicProperties;
    private String occurrenceID;
    private String catalogNumber;
    private String recordedBy;
    private String recordNumber;
    private String disposition;
    private String occurrenceRemarks;
    private String eventDate;
    private String habitat;
    private String continent;
    private String country;
    private String countryCode;
    private String stateProvince;
    private String county;
    private String minimumElevationInMeters;
    private String maximumElevationInMeters;
    private String verbatimLatitude;
    private String verbatimLongitude;
    private String geodeticDatum;
    private String georeferenceProtocol;
    private String kingdom;
    private String family;
    private String genus;
    private String specificEpithet;
    private String infraspecificEpithet;
    private String scientificName;
    private String scientificNameAuthorship;
    private String taxonRank;
    private String vernacularName;
    private String taxonRemarks;
    private String typeStatus;
    private String identifiedBy;
    private String dateIdentified;
    private String decimalLatitude;
    private String decimalLongitude;
    private String type;
    private String year;
    private String month;
    private String day;
    private String language;
    private String identificationQualifier;
    //genus specificEpithet infraspecificEpithet

    public DarwinCore(String modified, String dynamicProp, String occurrenceID, String catalogNumber,
                      String recordedBy, String recordNumber,
                      String occurrenceRemarks, String eventDate, String year, String month, String day,
                      String habitat, String stateProvince, String county,
                      String minElevation,
                      String maxElevation, String latitude, String longitude, String family, String genus,
                      String specificEpithet, String infraspecificEpithet,
                      String scientificName, String scientificNameAuthors, String taxonRank,
                      String vernacularName, String typeStatus, String identifiedBy,
                      String dateIdentified, String identificationQualifier) {
        this.basisOfRecord = "PreservedSpecimen";
        this.language = "pt";
        this.year = year;
        this.month = month;
        this.day = day;
        this.identificationQualifier = identificationQualifier == null ? "" : identificationQualifier;
        this.modified = modified == null ? "" : modified;
        this.dynamicProperties = dynamicProp == null ? "" : dynamicProp;
        this.occurrenceID = occurrenceID == null ? "" : occurrenceID;
        this.catalogNumber = catalogNumber == null ? "" : catalogNumber;
        this.recordedBy = recordedBy == null ? "" : recordedBy.replaceAll(";", "");
        this.recordNumber = recordNumber == null ? "" : recordNumber;
        this.occurrenceRemarks = occurrenceRemarks == null ? "" : occurrenceRemarks;
        this.eventDate = eventDate == null ? "" : eventDate;
        this.habitat = habitat == null ? "" : habitat;
        this.stateProvince = stateProvince == null ? "" : stateProvince;
        this.county = county == null ? "" : county;
        this.minimumElevationInMeters = minElevation == null ? "" : minElevation;
        this.maximumElevationInMeters = maxElevation == null ? "" : maxElevation;
        if (!this.minimumElevationInMeters.equals("")) {
            this.minimumElevationInMeters = this.minimumElevationInMeters.replaceAll("m", "");
        }
        if (!this.maximumElevationInMeters.equals("")) {
            this.maximumElevationInMeters = this.maximumElevationInMeters.replaceAll("m", "");
        }
        this.decimalLatitude = latitude == null ? "" : latitude;
        this.decimalLongitude = longitude == null ? "" : longitude;
        this.family = family == null ? "" : family;
        this.genus = genus == null ? "" : genus;
        this.specificEpithet = specificEpithet == null ? "" : specificEpithet;
        this.infraspecificEpithet = infraspecificEpithet == null ? "" : infraspecificEpithet;
        this.scientificName = scientificName == null ? "" : scientificName;
        this.scientificNameAuthorship = scientificNameAuthors == null ? "" : scientificNameAuthors;
        if (!this.scientificNameAuthorship.equals("") && this.scientificNameAuthorship.split("&").length > 0) {
            this.scientificNameAuthorship = this.scientificNameAuthorship.replaceAll("&", " | ").replaceAll(";", "");
        }
        this.taxonRank = taxonRank == null ? "" : taxonRank;
        this.vernacularName = vernacularName == null ? "" : vernacularName;
        this.typeStatus = typeStatus == null ? "" : typeStatus;
        this.identifiedBy = identifiedBy == null ? "" : identifiedBy;
        if (!this.identifiedBy.equals("") && this.identifiedBy.split("&").length > 0) {
            this.identifiedBy = this.identifiedBy.replaceAll("&", " | ");
        }
        this.dateIdentified = dateIdentified == null ? "" : dateIdentified;
        this.institutionID = "02.032.297/0005-26";
        this.institutionCode = "UTFPR";
        this.collectionCode = "Herbario da Universidade Tecnologica Federal do Parana – Campus Campo Mourao – HCF";
        this.license = "Os dados nao devem ser usados para fins comerciais. Qualquer uso dos dados de registros em análises ou"
                + " publicações devem constar nos agradecimentos; com a devida indicação de procedência dos dados originais;"
                + " e o responsável pela coleção deverá ser notificado; os dados; mesmo parciais; não podem ser redistribuídos"
                + " sem explícita autorização escrita do responsável pela coleção. Uma cópia de qualquer publicação em que os"
                + " dados sejam citados deve ser enviada ao Herbário HCF. Pesquisadores e suas instituições são responsáveis"
                + " pelo uso adequado dos dados. Este herbário procura minimizar a entrada de erros dos dados; entretanto não"
                + " garantimos que a base de dados esteja livre de erros; tanto na identificação quanto na transcrição dos dados "
                + "de coleta das amostras.";
        this.license = this.license.replaceAll(";", ".");
        this.license = this.license;
        this.rightsHolder = "UTFPR";
        this.continent = "America do Sul";
        this.continent = this.continent;
        this.country = "Brasil";
        this.countryCode = "BR";
        this.geodeticDatum = "WGS84";
        this.georeferenceProtocol = "GPS";
        this.kingdom = "Plantae";
        this.type = "Colecao";
    }

    @Override
    public String toString() {
        return basisOfRecord + "\t" + type + "\t" + language + "\t" + modified + "\t" + institutionID + "\t" + institutionCode
                + "\t" + collectionCode + "\t" + license + "\t" + rightsHolder + "\t" + dynamicProperties + "\t" + occurrenceID + "\t" + catalogNumber
                + "\t" + recordedBy + "\t" + recordNumber + "\t" + disposition + "\t" + occurrenceRemarks + "\t" + eventDate + "\t" + day + "\t" + month + "\t" + year + "\t" + habitat + "\t" + continent + "\t" + country + "\t" + countryCode
                + "\t" + stateProvince + "\t" + county + "\t" + minimumElevationInMeters + "\t" + maximumElevationInMeters + "\t" + verbatimLatitude + "\t" + verbatimLongitude
                + "\t" + decimalLatitude + "\t" + decimalLongitude + "\t" + geodeticDatum + "\t" + georeferenceProtocol + "\t" + kingdom + "\t" + family
                + "\t" + genus + "\t" + specificEpithet + "\t" + infraspecificEpithet + "\t" + scientificName + "\t" + scientificNameAuthorship
                + "\t" + taxonRank + "\t" + vernacularName + "\t" + taxonRemarks + "\t" + typeStatus + "\t" + identifiedBy + "\t" + dateIdentified + "\t" + identificationQualifier + "\t" + "\n";
    }
}
