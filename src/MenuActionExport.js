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
