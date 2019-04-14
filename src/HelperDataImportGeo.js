/**
Handles dragAndDrop-events and paste-events for loading geo data.
Adds the loaded features to the currently active layer.

This functions supports as text WKT and as file GPX, GeoJSON, KML, and WKT.
File content is determined by suffix.
*/

/**
Loads data from text.

@param {string} fileSuffix The type (file suffix) of the data to be loaded.
@param {string} fileContent The content to be loaded.

@return {Set<ol.Feature>|null}
*/
function TheKarteHelperDataImport_loadGeoFromText(fileSuffix, fileContent) {
    let format = TheKarteHelperDataImport_getOpenlayerFormat(fileSuffix);
    if (format == null) {
        return;
    }

    let features = format.readFeatures(fileContent, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
    console.log("HelperDataImport: read " + features.length + " features (using EPSG:4326).");

    return features;
}

/**
Identify the geo-data format using the file-suffix and creates the Openlayer formatter.

@param {string} fileSuffix The suffix of the file.
@return {ol.format.Format|null} The formatter capable of parsing the content.
*/
function TheKarteHelperDataImport_getOpenlayerFormat(fileSuffix) {
    let format = null;

    if (typeof(fileSuffix) !== "string") {
        console.error("HelperDataImport: fileSuffix must be a string.");
        return;
    }

    switch (fileSuffix.toLowerCase()) {
        case "gpx":
            format = new ol.format.WKT();
            break;

        case "geojson":
        case "json":
            format = new ol.format.GeoJSON();
            break;

        case "kml":
            format = new ol.format.KML({
                defaultStyle: null,
                extractStyles: false
            });
            break;

        case "wkt":
            format = new ol.format.WKT();
            break;

        default:
            console.error("HelperDataImport: don't know how to read file with suffix: " + fileSuffix);
            break;
    }
    return format;
}
