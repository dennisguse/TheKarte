/**
Abstract menu item for exporting features via local device download.

The filename is prefixed with "TheKarte".

this._fileSuffix should be overwritten by child classes.

@class MenuActionExport
@abstract
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {boolean} all Should all features or only from the active VectorLayer be returned.
*/
function MenuActionExport(theKarte, all) {
    MenuActionMode.call(this, theKarte);

    this._filePrefix = "TheKarte";
    this._fileSuffix = "";
    this._all = all;
}
MenuActionExport.prototype = Object.create(MenuActionOnce.prototype);
MenuActionExport.prototype.constructor = MenuActionExport;
MenuActionExport.prototype.start = function() {
    var exportString = this._featuresToString(this._theKarte.getFeatures(this._all));

    var textFileAsBlob = new Blob([exportString], {
        type: 'text/plain'
    });
    var fileNameToSaveAs = this._filePrefix + " " + new Date().toJSON() + "." + this._fileSuffix;
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.click();
};
/**
Convert the @{link ol.Feature}s to string.
@abstract
@param {ol.Feature} features The features to be converted.
*/
MenuActionExport.prototype._featuresToString = function(features) {
    console.warn(this.constructor.name + ": shoudld be overridden.");
};
MenuActionExport.prototype.toString = function() {
    return this.constructor.name + "(allFeatures: " + this._all + ")";
};

/**
Menu item to export data as GeoJSON (EPSG:4326).

@class MenuActionExportGeoJSON
@abstract
@augments MenuActionAbstract
@augments MenuActionOnce
@augments MenuActionExport
@constructor
*/
function MenuActionExportGeoJSON(theKarte, all) {
    MenuActionExport.call(this, theKarte, all);
    this._fileSuffix = "geojson";
}
MenuActionExportGeoJSON.prototype = Object.create(MenuActionExport.prototype);
MenuActionExportGeoJSON.prototype.constructor = MenuActionExportGeoJSON;
MenuActionExportGeoJSON.prototype._featuresToString = function(features) {
    var exportFormatter = new ol.format.GeoJSON();
    return exportFormatter.writeFeatures(
        features, {
            featureProjection: 'EPSG:4326'
        }
    );
};

/**
Menu item to export data as KML (EPSG:3857).

@class MenuActionExportKML
@abstract
@augments MenuActionAbstract
@augments MenuActionOnce
@augments MenuActionExport
@constructor
*/
function MenuActionExportKML(theKarte, all) {
    MenuActionExport.call(this, theKarte, all);
    this._fileSuffix = "kml";
}
MenuActionExportKML.prototype = Object.create(MenuActionExport.prototype);
MenuActionExportKML.prototype.constructor = MenuActionExportKML;
MenuActionExportKML.prototype._featuresToString = function(features) {
    var exportFormatter = new ol.format.KML();
    return exportFormatter.writeFeatures(
        features, {
            featureProjection: 'EPSG:3857'
        }
    );
};
