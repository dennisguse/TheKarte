/*
@class TheKarte

The main element of TheKarte.
Handles the setup and configuration of all UI components.
Also create the {@link KeyboardMeu}.

In addition, some helper functions are defined.
*/
function TheKarte() {
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

    //Setup keyboard menu
    this._keyboardMenu = new KeyboardMenu(
        new Map([
            //show menu structure
            ['h', new MenuActionHelp(this)],

            //Settings mode
            ['s', new Map([
                ['f', new MenuActionViewPerformance(this, true)],
                ['p', new MenuActionViewPerformance(this, false)]
            ])],

            //Export mode
            ['e', new Map([
                ['a', new Map([
                    ['g', new MenuActionExportGeoJSON(this, true)],
                    ['k', new MenuActionExportKML(this, true)]
                ])],
                ['c', new Map([
                    ['g', new MenuActionExportGeoJSON(this, false)],
                    ['k', new MenuActionExportKML(this, false)]
                ])],
            ])],

            //Select active layer
            ['l', new MenuActionLayerSelect(this)],

            //Insert mode
            ['i', new Map([
                ['l', new MenuActionLayerAdd(this)],
                //['d', new MenuActionFeatureDND(this)],
                ['s', new MenuActionFeatureAdd(this, 'Point')],
                ['p', new MenuActionFeatureAdd(this, 'Polygon')],
                ['c', new MenuActionFeatureAdd(this, 'Circle')]
            ])],

            ['m', new MenuActionFeatureModify(this)],

            //Delete mode
            ['d', new Map([
                ['l', new MenuActionLayerDelete(this)],
                ['f', new MenuActionFeatureDelete(this)]
            ])],

            //View mode
            ['v', new Map([
                ['e', new MenuActionViewExtent(this)],
                ['t', new Map([
                    //Change tile layer
                    ['o', new MenuActionViewTile(this, new ol.source.OSM())],
                    ['a', new MenuActionViewTile(this, new ol.source.XYZ({
                        attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                    }))],
                    ['g', new MenuActionViewTile(this, new ol.source.TileImage({
                        url: 'http://maps.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i375060738!3m9!2spl!3sUS!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0'
                    }))]
                ])],
                ['c', new MenuActionViewClusterToggle(this)]
            ])]
        ])
    );
}
TheKarte.prototype.constructor = TheKarte;

/**
Setups TheKarte.
Adds event listeners for keyboard and drag and drop.

@param {Element} parentElement The HTML element in which the map should be shown.
@param {Element} keyEventEmitter The HTML element that gets the key events.
*/
TheKarte.prototype.setup = function(parentElement, keyEventEmitter) {
    this._openlayersMap.setTarget(parentElement);

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
        let wkt = new ol.format.WKT();

        let content = event.dataTransfer.getData("text/plain");
        console.log(content);

        let features = wkt.readFeatures(content, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
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

            let reader = new FileReader();
            reader.onload = function() {
                let features = format.readFeatures(reader.result, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                this.getLayerActive().getSource().addFeatures(features);
            }.bind(this);
            reader.onerror = function() {
                console.error("Error during reading: " + reader.error);
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
