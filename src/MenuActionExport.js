/**
Menu item to export data as KML.

@class MenuActionExportKML
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {boolean} all Should all features or only from the active VectorLayer be returned.
*/
function MenuActionExportKML(theKarte, all) {
    MenuActionOnce.call(this, theKarte);

    this._all = all;
}
MenuActionExportKML.prototype = Object.create(MenuActionOnce.prototype);
MenuActionExportKML.prototype.constructor = MenuActionExportKML;
MenuActionExportKML.prototype.start = function() {
    this._theKarte.exportFeatures(this._theKarte.getFeatures(this._all));
};
MenuActionExportKML.prototype.toString = function() {
    return this.constructor.name + "(all features: " + this._all + ")";
};
MenuActionExportKML.prototype.getDescription = function() {
    return "Export the geographical data as KML to your local device.";
};

/**
Menu item to export the current visible area as PNG.

@class MenuActionExportPNG
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionExportPNG(theKarte) {
    MenuActionOnce.call(this, theKarte);
}
MenuActionExportPNG.prototype = Object.create(MenuActionOnce.prototype);
MenuActionExportPNG.prototype.constructor = MenuActionExportPNG;
MenuActionExportPNG.prototype.start = function() {
    this._theKarte.exportScreenshot();
};
MenuActionExportPNG.prototype.getDescription = function() {
    return "Export the current visible area as PNG to your local device.";
};
