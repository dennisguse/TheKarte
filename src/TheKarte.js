/**
@class TheKarte
@constructor
The main element of TheKarte.
Handles the setup and configuration of all UI components.

In addition, some helper functions are defined.

@param {StyleCreator} styleCreator The StyleCreator.
@param {StyleColorCreator} styleColorCreator The StyleColorCreator.
*/
function TheKarte(styleCreator, styleColorCreator) {
    this._keyboardMenu = null;

    this._styleCreator = styleCreator;
    this._styleColorCreator = styleColorCreator;

    this._userFeedbackCallback = null;


    //Setup Openlayer
    this._openlayersMap = new ol.Map({
        layers: [
            new ol.layer.Tile({
                preload: Infinity
            }),
        ],
        controls: [new ol.control.ScaleLine()],
        interactions: ol.interaction.defaults({
            doubleClickZoom: true,
            altShiftDragRotate: false
        }),
        view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 2
        })
    });

    //Add default layer
    this._layerActiveIndex = 0;
    this.layerAdd();
}
TheKarte.prototype.constructor = TheKarte;

/**
Setups TheKarte.
Adds event listeners for keyboard and drag and drop.

@param {KeyboardMenu} keyboardMenu The KeyboardMenu.
@param {ImportHandler} dragAndimportHandler The importHandler.
@param {Function} userFeedbackCallback Callback to give provide user feedback.
@param {Element} parentElement The HTML element in which the map should be shown.
@param {Element} keyEventEmitter The HTML element that gets the key events.
@param {Element} pasteEventEmitter The HTML element that gets the paste events.
*/
TheKarte.prototype.setup = function(keyboardMenu, importHandler, userFeedbackCallback, parentElement, keyEventEmitter, pasteEventEmitter) {
    this._openlayersMap.setTarget(parentElement);

    this._keyboardMenu = keyboardMenu;
    this._keyboardMenu.setUserFeedbackCallback(this.sendUserFeedback.bind(this));
    keyEventEmitter.onkeyup = this._keyboardMenu.handleKeypress.bind(this._keyboardMenu);

    importHandler.setup(parentElement, pasteEventEmitter);

    this._userFeedbackCallback = userFeedbackCallback;

    return this._ui;
};

/**
Provides user feedback about the success of current action.
@param {boolean} isOk Report success or failure?
*/
TheKarte.prototype.sendUserFeedback = function(isOk) {
    if (this._userFeedbackCallback == null) {
        console.error(this.constructor.name + ".sendUserFeedbacK: callback not provided.");
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
    const exportString = new ol.format.KML().writeFeatures(
        Array.from(features), {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }
    );

    const fileNameToSaveAs = "TheKarte-" + new Date().toJSON() + ".kml";

    TheKarteHelper_ExportString(fileNameToSaveAs, exportString);
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

    let features = [];

    const layerList = this.getMap().getLayers().getArray();
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
    const layer = this.getMap().getLayers().item(idx);
    return layer instanceof ol.layer.Vector ? layer : null;
};

/**
@return {ol.layer.Vector} The current active VectorLayer (i.e., the one that would be edited).
*/
TheKarte.prototype.getLayerActive = function() {
    const layer = this.getMap().getLayers().item(this._layerActiveIndex);
    return layer instanceof ol.layer.Vector ? layer : null;
};

/**
@return {StyleContainer|null} The {@link StyleContainer} of current active VectorLayer (i.e., the one that would be edited).
*/
TheKarte.prototype.getLayerActiveStyleContainer = function() {
    const layer = this.getLayerActive();
    if (layer === null) {
        return null;
    }
    return layer.get('theKarte_styleContainer');
};

/**
Add a new VectorLayer and mark it as active.
RenderMode is taken from the previous active layer.
*/
TheKarte.prototype.layerAdd = function() {
    const styleContainer = new StyleContainer(this._styleCreator, this._styleColorCreator.nextColor());

    const layer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        renderMode: this.getLayerActive() !== null ? this.getLayerActive().getRenderMode() : undefined,

        theKarte_styleContainer: styleContainer,
        style: styleContainer.getStyleFunction()
    });

    this._openlayersMap.addLayer(layer);
    this._layerActiveIndex += 1;
};

/**
Replaces a layer.
Transfers the styleContainer (by reference).

@param {ol.layer.Layer} layerNew The replacement layer.
@param {int} index The index of the layer to be replaced. 'undefined' to replace the active layer.
*/
TheKarte.prototype.layerReplace = function(layerNew, index) {
    let layerOld;
    let indexInternal = index;

    if (index !== undefined) {
        layerOld = this.getMap().getLayerGroup().getLayers().item(index);
        if (layerOld === null) {
            console.error(this.constructor.name + ".layerReplace(): layer with index " + index + " does not exist.");
            return;
        }
    } else {
        layerOld = this.getLayerActive();
        indexInternal = this.getLayerActiveIndex();
    }

    layerNew.set('theKarte_styleContainer', layerOld.get('theKarte_styleContainer'));
    this.getMap().getLayerGroup().getLayers().setAt(indexInternal, layerNew);
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
Adds features to the current active VectorLayer.
@param(Set<ol.Feature>) features The features to be added.
*/
TheKarte.prototype.layerActive_addFeatures = function(features) {
    this.getLayerActive().getSource().addFeatures(features);
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

    const layerFeatures = this.getLayerByIndex(layerFeatureIndex);
    const layerFilter = this.getLayerByIndex(layerFilterIndex);

    if (layerFeatures === null) {
        console.error(this.constructor.name + ": layer with index " + layerFeatureIndex + " does not exist.");
        return;
    }

    if (layerFilter === null) {
        console.error(this.constructor.name + ": layer with index " + layerFilterIndex + " does not exist.");
        return;
    }

    const resultInside = new Set();

    const featuresFilter = layerFilter.getSource().getFeatures();
    for (let i = 0; i < featuresFilter.length; i++) {
        let extend = featuresFilter[i].getGeometry().getExtent();
        let currentResult = layerFeatures.getSource().getFeaturesInExtent(extend);

        currentResult.forEach(feature => resultInside.add(feature));
    }

    const result = isInside ? resultInside : new Set(layerFeatures.getSource().getFeatures().filter(feature => !resultInside.has(feature)));

    return result;
};

/**
Parses URL parameters to pre-setup theKarte by executing actions of the keyboardMenu (identical as a user would).
Individual actions are seperated by '&' and should be urlEncoded if necessary.
The autopilot also provides limited support for adding data: drop(fileType,fileContent).

Exemplary URL:
* TheKarte.html?geoText(wkt,POINT(13.03367%2052.41362))
* TheKarte.html?geoURL(kml,https://openlayers.org/en/latest/examples/data/kml/2012_Earthquakes_Mag5.kml)
* TheKarte.html?geoURL(kml,https://openlayers.org/en/latest/examples/data/kml/2012_Earthquakes_Mag5.kml)&styleImageURL(https://openlayers.org/en/latest/examples/resources/logo-70x70.png)

@param {array<string>} commands The commands as a string.
*/
TheKarte.prototype.autopilot = function(commands) {
    for (let i = 0; i < commands.length; i++) {
        console.log('TheKarte.autopilot: trying to execute command ' + commands[i]);
        let command = decodeURIComponent(commands[i]);

        //noop
        if (command.length == 0) continue;

        //normal command
        if (command.length == 1) {
            this._keyboardMenu.handleKeypress(new KeyboardEvent('keyup', {
                key: command
            }));
            continue;
        }

        //command contains function call
        if (!(/^[a-zA-Z]+\(.+\)$/.test(command))) {
            console.error("TheKarte.autopilot: could not parse command " + command);
            continue;
        }

        let commandName = command.slice(0, command.indexOf('('));
        switch (commandName) {
            case "geoText":
            case "geoURL":
                {
                    if (!(/^[a-zA-Z]+\(.+,.+\)$/.test(command))) {
                        console.error("TheKarte.autopilot: could not parse geo-command " + command);
                        continue;
                    }

                    let commandStrip = command.slice(command.indexOf('(') + 1);
                    let contentType = commandStrip.slice(0, commandStrip.indexOf(','));
                    let textOrURL = commandStrip.slice(commandStrip.indexOf(',') + 1, commandStrip.length - 1);

                    let text;
                    if (commandName === "geoURL") {
                        let request = new XMLHttpRequest();
                        request.open("GET", textOrURL, false);
                        request.send(null);

                        if (request.status == 200) {
                            text = request.responseText;
                        } else {
                            console.error("TheKarte.autopilot: got HTTP-code " + request.status + " for command " + command);
                        }
                    } else {
                        text = textOrURL;
                    }


                    let features = TheKarteHelperDataImport_loadGeoFromText(contentType, text);

                    if (features == null) {
                        console.log("TheKarte.autopilot: could not parse features from command: " + command);
                        continue;
                    }
                    this.layerActive_addFeatures(features);
                }
                continue;
            case "styleImageURL":
                {
                    let commandStrip = command.slice(command.indexOf('(') + 1);
                    let url = commandStrip.slice(0, commandStrip.length - 1);

                    this.getLayerActiveStyleContainer().setImage(url);
                    this.getLayerActive().changed();
                    continue;
                }
        }

        console.error('TheKarte.autopilot: could not parse command ' + command + ' - continuing with next command.');
    }
};
