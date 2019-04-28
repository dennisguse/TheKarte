/**
Menu item to export data as KML.

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionExportKML extends MenuActionOnce {
    /**
    @param {boolean} all Should all features or only from the active VectorLayer be returned.
    */
    constructor(theKarte, all) {
        super(theKarte);

        this._all = all;
    }
    start() {
        this._theKarte.exportFeatures(this._theKarte.getFeatures(this._all));
    }
    toString() {
        return this.constructor.name + "(all features: " + this._all + ")";
    }
    getDescription() {
        return "Export the geographical data as KML to your local device.";
    }
}

/**
Menu item to export the current visible area as PNG.

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionExportPNG extends MenuActionOnce {
    constructor(theKarte) {
        super(theKarte);
    }

    start() {
        this._theKarte.exportScreenshot();
    }
    getDescription() {
        return "Export the current visible area as PNG to your local device.";
    }
}
