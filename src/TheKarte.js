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
            new ol.layer.Tile({
                preload : Infinity
            }),
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
    this._userFeedbackCallback = null;
}
TheKarte.prototype.constructor = TheKarte;

/**
Setups TheKarte.
Adds event listeners for keyboard and drag and drop.

@param {KeyboardMenu} keyboardMenu The KeyboardMenu.
@param {DropHandler} dragAndDropHandler The DropHandler.
@param {Function} userFeedbackCallback Callback to give provide user feedback.
@param {Element} parentElement The HTML element in which the map should be shown.
@param {Element} keyEventEmitter The HTML element that gets the key events.
*/
TheKarte.prototype.setup = function(keyboardMenu, dropHandler, userFeedbackCallback, parentElement, keyEventEmitter) {
    this._openlayersMap.setTarget(parentElement);

    this._keyboardMenu = keyboardMenu;
    this._keyboardMenu.setUserFeedbackCallback(this.sendUserFeedback.bind(this));
    keyEventEmitter.onkeyup = this._keyboardMenu.handleKeypress.bind(this._keyboardMenu);

    dropHandler.setup(parentElement);

    this._userFeedbackCallback = userFeedbackCallback;


    this.setTileSource(new ol.source.OSM());


    return this._ui;
};

/**
Provides user feedback about the success of current action.
@param {boolean} isOk Report success or failure?
*/
TheKarte.prototype.sendUserFeedback = function(isOk) {
    if (this._userFeedbackCallback == null) {
        console.error("TheKarte.sendUserFeedbacK: callback not provided.");
        return;
    }
    this._userFeedbackCallback(isOk);
};

TheKarte.prototype.menuToString = function() {
    return this._keyboardMenu.toString();
};

/**
Exports the {@link ol.Feature}s as KML via local download.

@param {Set<ol.Feature>} features The features to be exported.
*/
TheKarte.prototype.exportFeatures = function(features) {
    if (features === undefined || features === null || features.size === 0) {
        console.error(this.constructor.name + ".exportFeatures(): no features to export. Will do nothing.");
        return;
    }
    var exportString = new ol.format.KML().writeFeatures(
        Array.from(features), {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }
    );

    var textFileAsBlob = new Blob([exportString], {
        type: 'text/plain'
    });
    var fileNameToSaveAs = "TheKarte-" + new Date().toJSON() + ".kml";
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.click();
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
@return {int} The index of the active layer.
*/
TheKarte.prototype.getLayerActiveIndex = function() {
    return this._layerActiveIndex;
};

/**
@param {int} idx The index of the layer to be returned.

@return {ol.layer.Vector} The current active VectorLayer (i.e., the one that would be edited).
*/
TheKarte.prototype.getLayerByIndex = function(idx) {
    var layer = this.getMap().getLayers().item(idx);
    return layer instanceof ol.layer.Vector ? layer : null;
};

/**
@return {ol.layer.Vector} The current active VectorLayer (i.e., the one that would be edited).
*/
TheKarte.prototype.getLayerActive = function() {
    var layer = this.getMap().getLayers().item(this._layerActiveIndex);
    return layer instanceof ol.layer.Vector ? layer : null;
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
        renderMode: this.getLayerActive() !== null ? this.getLayerActive().getRenderMode() : undefined
    });
    this._openlayersMap.addLayer(layer);
    this._layerActiveIndex += 1;
};

/**

@param {int} index The VectorLayer to set as active (1..n).
*/
TheKarte.prototype.layerActivate = function(index) {
    if (1 <= index && index < this.getMap().getLayerGroup().getLayers().getLength()) { //Assume tile layer to be first.
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

    this._layerActiveIndex = Math.min(this._layerActiveIndex, this.getMap().getLayers().getLength() - 1);

    if (this._layerActiveIndex == 0) {
        this.layerAdd();
    }
};

/**
Filter features of one layer by the features (usually polygons) in another layer.

@param {int} layerFeatureIndex The index of the layer to be filtered.
@param {int} layerFilterIndex The index of the layer, which is used as filter.
@param {boolean} isInside Should the features be inside or outside?

@return {Set<ol.Feature>}
*/
TheKarte.prototype.featuresFilterByLayer = function(layerFeatureIndex, layerFilterIndex, isInside) {
    if (layerFeatureIndex === layerFilterIndex) {
        console.warn(this.constructor.name + ": active layer would filter itself.");
        return new Set();
    }

    var layerFeatures = this.getLayerByIndex(layerFeatureIndex);
    var layerFilter = this.getLayerByIndex(layerFilterIndex);

    if (layerFeatures === null) {
        console.error(this.constructor.name + ": layer with index " + layerFeatureIndex + " does not exist.");
        return;
    }

    if (layerFilter === null) {
        console.error(this.constructor.name + ": layer with index " + layerFilterIndex + " does not exist.");
        return;
    }

    var resultInside = new Set();

    var featuresFilter = layerFilter.getSource().getFeatures();
    for(let i = 0; i < featuresFilter.length; i++) {
        let extend = featuresFilter[i].getGeometry().getExtent();
        let currentResult = layerFeatures.getSource().getFeaturesInExtent(extend);

        currentResult.forEach(feature => resultInside.add(feature));
    }

    var result = isInside ? resultInside : new Set(layerFeatures.getSource().getFeatures().filter(feature => !resultInside.has(feature)));

    return result;
};
