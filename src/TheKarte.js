/**
@class TheKarte
@constructor
The main element of TheKarte.
Handles the setup and configuration of all UI components.

In addition, some helper functions are defined.
*/
function TheKarte(keyboardMenu) {
    //Setup Openlayer
    this._openlayersMap = new ol.Map({
        layers: [
            new ol.layer.Tile(),
        ],
        controls: [new ol.control.ScaleLine()],
        interactions: ol.interaction.defaults({
            doubleClickZoom: false,
            altShiftDragRotate: false
        }),
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 2
        })
    });

    this._styler = new AutomaticStyler(0);

    //Add default layer
    this._layerActiveIndex = 0;
    this.layerAdd();

    this._keyboardMenu = null;
}
TheKarte.prototype.constructor = TheKarte;

/**
Setups TheKarte.
Adds event listeners for keyboard and drag and drop.

@param {KeyboardMenu} keyboardMenu The KeyboardMenu.
@param {Element} parentElement The HTML element in which the map should be shown.
@param {Element} keyEventEmitter The HTML element that gets the key events.
*/
TheKarte.prototype.setup = function(keyboardMenu, parentElement, keyEventEmitter) {
    this._openlayersMap.setTarget(parentElement);

    this._keyboardMenu = keyboardMenu;
    keyEventEmitter.onkeyup = this._keyboardMenu.handleKeypress.bind(this._keyboardMenu);

    parentElement.addEventListener('dragover', this._dragAndDropAllow.bind(this));
    parentElement.addEventListener('drop', this._dragAndDropHandle.bind(this));

    this.setTileSource(new ol.source.OSM());

    return this._ui;
};

/**
Print the keyboard-based menu to the console.
*/
TheKarte.prototype.printMenu = function() {
    console.log(this._keyboardMenu.toString());
}

//DragAndDrop support
TheKarte.prototype._dragAndDropAllow = function(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
};

TheKarte.prototype._dragAndDropHandle = function(event) {
    this._dragAndDropAllow(event);

    //Handle text/plain as WKT
    if (event.dataTransfer.types.indexOf("text/plain") >= 0) {
        console.log("DragAndDrop: got text. Trying to interpret as WKT.");
        let wkt = new ol.format.WKT();

        let content = event.dataTransfer.getData("text/plain");
        console.log(content);

        let features = wkt.readFeatures(content, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326'
        });
        this.getLayerActive().getSource().addFeatures(features);
    }

    //Handle files by extension
    if (event.dataTransfer.types.indexOf("Files") >= 0) {
        var files = event.dataTransfer.files;

        //Check how multiple files are handled.
        for (let i = 0; i < files.length; i++) {
            let suffix = files[i].name.split('.').pop();

            var format = null;
            console.log("DragAndDrop: got file (" + suffix +"). Using EPSG:4326.");

            switch (suffix.toLowerCase()) {
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
                    console.error("DragAndDrop: don't know how to read file with suffix: " + suffix);
                    continue;
                    break;
            }
            if (format === null) {
                continue;
            }

            let reader = new FileReader();
            reader.onload = function() {
                let features = format.readFeatures(reader.result, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:4326'
                });
                console.log("DragAndDrop: read " + features.length + " features. Adding to current layer.");
                this.getLayerActive().getSource().addFeatures(features);
            }.bind(this);
            reader.onerror = function() {
                console.error("DragAndDrop: error reading (" + files[i].name + "): " + reader.error);
            };
            reader.readAsText(files[i]);
        }
    }
};
/**
@returns {ol.Map} The map that is used by TheKarte.
*/
TheKarte.prototype.getMap = function() {
    return this._openlayersMap;
};

/**
@param {ol.source.TileImage | ol.source.OSM} olSourceTile The tile source to be used.
*/
TheKarte.prototype.setTileSource = function(olSourceTile) {
    this.getLayerTile().setSource(olSourceTile);
};

/**
@param {boolean} all Should all features or only from the active VectorLayer be returned.
@returns {array<ol.Feature>} All features that are at the moment part of the map.
*/
TheKarte.prototype.getFeatures = function(all) {
    if (!all) return this.getLayerActive().getSource().getFeatures();

    var features = [];

    var layerList = this.getMap().getLayers().getArray();
    for (let i = 0; i < layerList.length; i++) {
        if (layerList[i] instanceof ol.layer.Vector) {
            features = features.concat(layerList[i].getSource().getFeatures());
        }
    }
    return features;
};

/**
@returns {ol.layer.Tile} The tile of the map - there should only be one.
*/
TheKarte.prototype.getLayerTile = function() {
    return this.getMap().getLayerGroup().getLayersArray().find(layer => {
        return layer instanceof ol.layer.Tile;
    });
};

/**
@return {ol.layer.Vector} The current active VectorLayer (i.e., the one that would be edited).
*/
TheKarte.prototype.getLayerActive = function() {
    var layer = this.getMap().getLayers().item(this._layerActiveIndex);
    return layer instanceof ol.layer.Vector ? layer : undefined;
};

/**
Add a new VectorLayer and mark it as active.
this._styler is used to create a new style for this layer.
RenderMode is taken from the previous active layer.
*/
TheKarte.prototype.layerAdd = function() {
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: this._styler.createStyle(),
        renderMode: this.getLayerActive() !== undefined ? this.getLayerActive().getRenderMode() : undefined
    });
    this._openlayersMap.addLayer(layer);
    this._layerActiveIndex += 1;
};

/**

@param {int} index The VectorLayer to set as active (1..n).
*/
TheKarte.prototype.layerActivate = function(index) {
    if (1 <= index && index < this.getMap().getLayerGroup().getLength()) { //Assume tile layer to be first.
        this._layerActiveIndex = index;

        return;
    }
};
/**
Delete the current active VectorLayer.
If none is left afterwards, a new VectorLayer is added.
*/
TheKarte.prototype.layerDelete = function() {
    this.getMap().removeLayer(this.getLayerActive());

    this._layerActiveIndex = Math.min(this._layerActiveIndex, this._layers.length - 1);

    if (this._layerActiveIndex == 0) {
        this.layerAdd();
    }
};
