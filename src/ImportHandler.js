/**
Handles importing of data from user input: for plain text handles drop- and paste-events and for files drop-events.

@class ImportHandler
@constructor
*/
function ImportHandler(theKarte) {
    this._theKarte = theKarte;

    this._mode = 'geo'; // or 'style'
}
ImportHandler.prototype.constructor = ImportHandler;

/**
@param {Element} parentElement The HTML element in which triggers dropEvents.
@param {Element} pasteEventEmitter The HTML element that gets the paste events.
*/
ImportHandler.prototype.setup = function(parentElement, pasteEventEmitter) {
    parentElement.addEventListener('dragover', this.dropAllow.bind(this));
    parentElement.addEventListener('drop', this.dropHandle.bind(this));

    pasteEventEmitter.addEventListener('paste', this.dropHandle.bind(this));
};

/**
Handles to start of a drop event.
*/
ImportHandler.prototype.dropAllow = function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (event.dataTransfer !== undefined)
        event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
};

/**
Handles to the drop event.
*/
ImportHandler.prototype.dropHandle = function(event) {
    this.dropAllow(event);

    switch (this._mode) {
        case 'geo':
            this._dragAndDropHandleGeodata(event);
            break;
        case 'style':
            this._dragAndDropHandleStyle(event);
            break;
    }
};

/**
Change how the drop-events are handled (i.e., what kind of data is expected).

@param {string} mode either 'geo' or 'style'
*/
ImportHandler.prototype.setMode = function(mode) {
    if (['geo', 'style'].indexOf(mode) >= 0) {
        this._mode = mode;
        return;
    }
    console.error("ImportHandler: don't know how to handle: " + mode);
};

/**
Handles dragAndDrop-events setting styles (i.e., image for point).

Replaces the style of the currently active layer.
NOTE: Accepts only drop request containing _ONE_ file.
*/
ImportHandler.prototype._dragAndDropHandleStyle = function(event) {
    if (event.dataTransfer.types.indexOf("Files") != 0) {
        console.error("ImportHandler: can only load one image.");
        return;
    }

    let file = event.dataTransfer.files[0];
    console.log("ImportHandler: got file (" + file.name + ").");

    let reader = new FileReader();
    reader.onload = function() {
        let result = reader.result;
        if (!result.startsWith("data:image/")) {
            this._theKarte.sendUserFeedback(false);
            console.error("ImportHandler: file is not an image.");
            return;
        }

        this._theKarte.sendUserFeedback(true);

        this._theKarte.getLayerActiveStyleContainer().setImage(result);
        this._theKarte.getLayerActive().changed();
    }.bind(this);
    reader.onerror = function() {
        this._theKarte.sendUserFeedback(false);
        console.error("ImportHandler: error reading (" + file.name + "): " + reader.error);
    };
    reader.readAsDataURL(file);
};

/**
Handles dragAndDrop-events and paste-events for loading geo data.
Adds the loaded features to the currently active layer.

This functions supports as text WKT and as file GPX, GeoJSON, KML, and WKT.
File content is determined by suffix.
*/
ImportHandler.prototype._dragAndDropHandleGeodata = function(event) {
    //Handle text/plain as WKT: DragAndDrop and CopyPaste
    {
        let eventData = event.clipboardData !== undefined ? event.clipboardData : event.dataTransfer;
        if (eventData.types.indexOf("text/plain") >= 0) {
            console.log("ImportHandler: got text. Trying to interpret as WKT.");
            let wkt = new ol.format.WKT();

            //let content = event.dataTransfer.getData("text/plain");
            let content = eventData.getData("text/plain");
            console.log(content);

            let features = wkt.readFeatures(content, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            });
            this._theKarte.getLayerActive().getSource().addFeatures(features);
        }
    }

    //Handle files by extension
    if (event.dataTransfer !== undefined && event.dataTransfer.types.indexOf("Files") >= 0) {
        const files = event.dataTransfer.files;

        //Check how multiple files are handled.
        for (let i = 0; i < files.length; i++) {
            let suffix = files[i].name.split('.').pop();

            let formatTMP = null;
            console.log("ImportHandler: got file (" + files[i].name + ").");

            switch (suffix.toLowerCase()) {
                case "gpx":
                    formatTMP = new ol.format.WKT();
                    break;

                case "geojson":
                case "json":
                    formatTMP = new ol.format.GeoJSON();
                    break;

                case "kml":
                    formatTMP = new ol.format.KML({
                        defaultStyle: null,
                        extractStyles: false
                    });
                    break;

                case "wkt":
                    formatTMP = new ol.format.WKT();
                    break;

                default:
                    console.error("ImportHandler: don't know how to read file with suffix: " + suffix);
                    break;
            }
            const format = formatTMP;
            if (format === null) {
                continue;
            }

            const reader = new FileReader();
            reader.onload = function() {
                let features = format.readFeatures(reader.result, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                console.log("ImportHandler: read " + features.length + " features (using EPSG:4326). Adding to current layer.");
                this._theKarte.getLayerActive().getSource().addFeatures(features);
            }.bind(this);
            reader.onerror = function() {
                console.error("ImportHandler: error reading (" + files[i].name + "): " + reader.error);
            };
            reader.readAsText(files[i]);
        }
    }
};
