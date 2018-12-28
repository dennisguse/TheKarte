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
    parentElement.addEventListener('drop', this.handleEvent.bind(this));

    pasteEventEmitter.addEventListener('paste', this.handleEvent.bind(this));
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
ImportHandler.prototype.handleEvent = function(event) {
    this.dropAllow(event);

    switch (this._mode) {
        case 'geo':
            this._handleEventGeodata(event);
            break;
        case 'style':
            this._handleEventStyle(event);
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
ImportHandler.prototype._handleEventStyle = function(event) {
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
ImportHandler.prototype._handleEventGeodata = function(event) {
    //Handle text/plain as WKT: DragAndDrop and CopyPaste
    {
        let eventData = event.clipboardData !== undefined ? event.clipboardData : event.dataTransfer;
        if (eventData.types.indexOf("text/plain") >= 0) {
            console.log("ImportHandler: got text. Trying to interpret as WKT.");

            //let content = event.dataTransfer.getData("text/plain");
            let content = eventData.getData("text/plain");
            console.log(content);

            let features = TheKarteHelperDataImport_loadGeoFromText("wkt", content);
            this._theKarte.layerActive_addFeatures(features);
        }
    }

    //Handle files by extension
    if (event.dataTransfer !== undefined && event.dataTransfer.types.indexOf("Files") >= 0) {
        const files = event.dataTransfer.files;

        //Check how multiple files are handled.
        for (let i = 0; i < files.length; i++) {
            const fileSuffix = files[i].name.split('.').pop();

            console.log("ImportHandler: got file (" + files[i].name + ").");

            const reader = new FileReader();
            reader.onload = function() {
                let features = TheKarteHelperDataImport_loadGeoFromText(fileSuffix, reader.result);

                console.log("ImportHandler: Adding to current layer.");

                this._theKarte.layerActive_addFeatures(features);
            }.bind(this);
            reader.onerror = function() {
                console.error("ImportHandler: error reading (" + files[i].name + "): " + reader.error);
            };
            reader.readAsText(files[i]);
        }
    }
};
