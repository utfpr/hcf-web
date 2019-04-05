/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package classes;

/**
 *
 * @author nanii
 */
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

    public String getBasisOfRecord() {
        return basisOfRecord;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIdentificationQualifier() {
        return identificationQualifier;
    }

    public void setIdentificationQualifier(String identificationQualifier) {
        this.identificationQualifier = identificationQualifier;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setBasisOfRecord(String basisOfRecord) {
        this.basisOfRecord = basisOfRecord;
    }

    public String getModified() {
        return modified;
    }

    public void setModified(String modified) {
        this.modified = modified;
    }

    public String getInstitutionID() {
        return institutionID;
    }

    public void setInstitutionID(String institutionID) {
        this.institutionID = institutionID;
    }

    public String getInstitutionCode() {
        return institutionCode;
    }

    public void setInstitutionCode(String institutionCode) {
        this.institutionCode = institutionCode;
    }

    public String getCollectionCode() {
        return collectionCode;
    }

    public void setCollectionCode(String collectionCode) {
        this.collectionCode = collectionCode;
    }

    public String getLicense() {
        return license;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public String getRightsHolder() {
        return rightsHolder;
    }

    public void setRightsHolder(String rightsHolder) {
        this.rightsHolder = rightsHolder;
    }

    public String getDynamicProperties() {
        return dynamicProperties;
    }

    public void setDynamicProperties(String dynamicProperties) {
        this.dynamicProperties = dynamicProperties;
    }

    public String getOccurrenceID() {
        return occurrenceID;
    }

    public void setOccurrenceID(String occurrenceID) {
        this.occurrenceID = occurrenceID;
    }

    public String getCatalogNumber() {
        return catalogNumber;
    }

    public void setCatalogNumber(String catalogNumber) {
        this.catalogNumber = catalogNumber;
    }

    public String getRecordedBy() {
        return recordedBy;
    }

    public void setRecordedBy(String recordedBy) {
        this.recordedBy = recordedBy;
    }

    public String getRecordNumber() {
        return recordNumber;
    }

    public void setRecordNumber(String recordNumber) {
        this.recordNumber = recordNumber;
    }

    public String getDisposition() {
        return disposition;
    }

    public void setDisposition(String disposition) {
        this.disposition = disposition;
    }

    public String getOccurrenceRemarks() {
        return occurrenceRemarks;
    }

    public void setOccurrenceRemarks(String occurrenceRemarks) {
        this.occurrenceRemarks = occurrenceRemarks;
    }

    public String getEventDate() {
        return eventDate;
    }

    public void setEventDate(String eventDate) {
        this.eventDate = eventDate;
    }

    public String getHabitat() {
        return habitat;
    }

    public void setHabitat(String habitat) {
        this.habitat = habitat;
    }

    public String getContinent() {
        return continent;
    }

    public void setContinent(String continent) {
        this.continent = continent;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getStateProvince() {
        return stateProvince;
    }

    public void setStateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getMinimumElevationInMeters() {
        return minimumElevationInMeters;
    }

    public void setMinimumElevationInMeters(String minimumElevationInMeters) {
        this.minimumElevationInMeters = minimumElevationInMeters;
    }

    public String getMaximumElevationInMeters() {
        return maximumElevationInMeters;
    }

    public void setMaximumElevationInMeters(String maximumElevationInMeters) {
        this.maximumElevationInMeters = maximumElevationInMeters;
    }

    public String getVerbatimLatitude() {
        return verbatimLatitude;
    }

    public void setVerbatimLatitude(String verbatimLatitude) {
        this.verbatimLatitude = verbatimLatitude;
    }

    public String getVerbatimLongitude() {
        return verbatimLongitude;
    }

    public void setVerbatimLongitude(String verbatimLongitude) {
        this.verbatimLongitude = verbatimLongitude;
    }

    public String getDecimalLatitude() {
        return decimalLatitude;
    }

    public void setDecimalLatitude(String decimalLatitude) {
        this.decimalLatitude = decimalLatitude;
    }

    public String getDecimalLongitude() {
        return decimalLongitude;
    }

    public void setDecimalLongitude(String decimalLongitude) {
        this.decimalLongitude = decimalLongitude;
    }

    public String getGeodeticDatum() {
        return geodeticDatum;
    }

    public void setGeodeticDatum(String geodeticDatum) {
        this.geodeticDatum = geodeticDatum;
    }

    public String getGeoreferenceProtocol() {
        return georeferenceProtocol;
    }

    public void setGeoreferenceProtocol(String georeferenceProtocol) {
        this.georeferenceProtocol = georeferenceProtocol;
    }

    public String getKingdom() {
        return kingdom;
    }

    public void setKingdom(String kingdom) {
        this.kingdom = kingdom;
    }

    public String getFamily() {
        return family;
    }

    public void setFamily(String family) {
        this.family = family;
    }

    public String getGenus() {
        return genus;
    }

    public void setGenus(String genus) {
        this.genus = genus;
    }

    public String getSpecificEpithet() {
        return specificEpithet;
    }

    public void setSpecificEpithet(String specificEpithet) {
        this.specificEpithet = specificEpithet;
    }

    public String getInfraspecificEpithet() {
        return infraspecificEpithet;
    }

    public void setInfraspecificEpithet(String infraspecificEpithet) {
        this.infraspecificEpithet = infraspecificEpithet;
    }

    public String getScientificName() {
        return scientificName;
    }

    public void setScientificName(String scientificName) {
        this.scientificName = scientificName;
    }

    public String getScientificNameAuthorship() {
        return scientificNameAuthorship;
    }

    public void setScientificNameAuthorship(String scientificNameAuthorship) {
        this.scientificNameAuthorship = scientificNameAuthorship;
    }

    public String getTaxonRank() {
        return taxonRank;
    }

    public void setTaxonRank(String taxonRank) {
        this.taxonRank = taxonRank;
    }

    public String getVernacularName() {
        return vernacularName;
    }

    public void setVernacularName(String vernacularName) {
        this.vernacularName = vernacularName;
    }

    public String getTaxonRemarks() {
        return taxonRemarks;
    }

    public void setTaxonRemarks(String taxonRemarks) {
        this.taxonRemarks = taxonRemarks;
    }

    public String getTypeStatus() {
        return typeStatus;
    }

    public void setTypeStatus(String typeStatus) {
        this.typeStatus = typeStatus;
    }

    public String getIdentifiedBy() {
        return identifiedBy;
    }

    public void setIdentifiedBy(String identifiedBy) {
        this.identifiedBy = identifiedBy;
    }

    public String getDateIdentified() {
        return dateIdentified;
    }

    public void setDateIdentified(String dateIdentified) {
        this.dateIdentified = dateIdentified;
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
