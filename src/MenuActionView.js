/**
A menu item that zooms to the extend the active VectorLayer.

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionViewExtent extends MenuActionOnce {
    constructor(theKarte) {
        super(theKarte);
    }
    start() {
        this.getMap().getView().fit(this._theKarte.getLayerActive().getSource().getExtent());
    }
    getDescription() {
        return "Zoom to show all features of the active layer.";
    }
}

/**
A menu item that changes the background tile.

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionViewTile extends MenuActionOnce {
    /**
    @param {ol.source.Tile} olSourceTile The tile to be used.
    */
    constructor(theKarte, olSourceTile) {
        super(theKarte);
        this._olSourceTile = olSourceTile;
    }
    start() {
        this._theKarte.setTileSource(this._olSourceTile);
    }
    toString() {
        return this.constructor.name + "(urls: " + this._olSourceTile.getUrls() + ")";
    }
    getDescription() {
        return "";
    }
}

/**
A menu item that changes the render mode of all VectorLayer.

NOTE: Re-constructs all VectorLayers.

@augments MenuActionAbstract
@augments MenuActionOnce

TODO BUG Overwrites settings required for MenuActionViewClippingLayer.
*/
class MenuActionViewPerformance extends MenuActionOnce {
    /**
    @param {boolean} shouldBeFast Should OpenLayers fast rendering ('image') or precise rendering ('vector') be used?
    */
    constructor(theKarte, shouldBeFast) {
        super(theKarte);
        this._shouldBeFast = shouldBeFast;
    }
    start() {
        const collectionLayers = this.getMap().getLayerGroup().getLayers();

        for (let i = 0; i < collectionLayers.getLength(); i++) {
            let layer = collectionLayers.item(i);

            if (layer instanceof ol.layer.Vector || layer instanceof ol.layer.VectorImage) {
                let layerNew;
                if (this._shouldBeFast) {
                    layerNew = new ol.layer.VectorImage({
                        source: layer.getSource(),
                        style: layer.getStyle(),
                    });
                } else {
                    layerNew = new ol.layer.Vector({
                        source: layer.getSource(),
                        style: layer.getStyle(),
                    });
                }
                this._theKarte.layerReplace(layerNew, i);
            }
        }
    }
    toString() {
        return this.constructor.name + "(shouldBeFast: " + this._shouldBeFast + ")";
    }
    getDescription() {
        return "Switch the renderMode between immediately (slow but accurate) and delayed (fast but inaccurate).";
    }
}

/**
A menu item that set the current layer to be either clipping (by geometry) or not.

NOTE: Re-constructs the current VectorLayer: sets renderMode:"image" as well as precompose and postcompose handlers.

@augments MenuActionAbstract
@augments MenuActionOnce

BUG Overwrites settings set by MenuActionViewPerformance and does not restore them.
*/
class MenuActionViewClippingLayer extends MenuActionOnce {
    /**
    @param {boolean} shouldbeClipping Should the current active layer be clipping.
    */
    constructor(theKarte, shouldbeClipping) {
        super(theKarte);
        this._shouldbeClipping = shouldbeClipping;
    }
    start() {
        const layer = this._theKarte.getLayerActive();

        let layerNew = new ol.layer.Vector({
            source: layer.getSource(),
            style: layer.get('theKarte_styleContainer').getStyleFunction(),
            renderMode: this._shouldbeClipping ? "image" : "vector" //TODO should use ol.source.VectorRenderType.VECTOR
        });

        if (this._shouldbeClipping) {
            layerNew.on('precompose', function(e) {
                e.context.globalCompositeOperation = 'destination-in';
            });
            layerNew.on('postcompose', function(e) {
                e.context.globalCompositeOperation = 'source-over';
            });
            layerNew.setStyle(new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'black'
                })
            }));
        }
        this._theKarte.layerReplace(layerNew);
    }
    toString() {
        return this.constructor.name + "(shouldbeClipping: " + this._shouldbeClipping + ")";
    }
    getDescription() {
        return "Use the active layer as a clipping for the base map (i.e., background tiles).";
    }
}

/**
A menu item that toggles the clustering of points.

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionViewClusterToggle extends MenuActionOnce {
    /**
    @param {int} clusterDistance The distance between features before they get clustered.
    */
    constructor(theKarte, clusterDistance) {
        super(theKarte);

        this._clusterDistance = clusterDistance;
    }
    start() {
        let currentSource = this._theKarte.getLayerActive().getSource();
        if (currentSource instanceof ol.source.Vector && !(currentSource instanceof ol.source.Cluster)) {
            if (currentSource.getFeatures().filter(feature =>
                    !(feature instanceof ol.geom.Point)
                ).length === 0) {
                console.warn(this.constructor.name, ": view can only be clustered if _only_ points are on the layer");
                this._theKarte.sendUserFeedback(false);
                return;
            }
            this._theKarte.getLayerActive().setSource(
                new ol.source.Cluster({
                    source: currentSource,
                    distance: this._clusterDistance
                })
            );
            return;
        }

        if (currentSource instanceof ol.source.Cluster) {
            this._theKarte.getLayerActive().setSource(currentSource.getSource());
        }
    }
    getDescription() {
        return "Toggle the point clustering of the active layer.";
    }
}
