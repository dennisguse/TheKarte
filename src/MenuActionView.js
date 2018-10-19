/**
A menu item that zooms to the extend the active VectorLayer.

@class MenuActionViewExtent
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionViewExtent(theKarte) {
    MenuActionMode.call(this, theKarte);
}
MenuActionViewExtent.prototype = Object.create(MenuActionOnce.prototype);
MenuActionViewExtent.prototype.constructor = MenuActionViewExtent;
MenuActionViewExtent.prototype.start = function() {
    this.getMap().getView().fit(this._theKarte.getLayerActive().getSource().getExtent());
};

/**
A menu item that changes the background tile.

@class MenuActionViewTile
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {ol.source.Tile} olSourceTile The tile to be used.
*/
function MenuActionViewTile(theKarte, olSourceTile) {
    MenuActionMode.call(this, theKarte);
    this._olSourceTile = olSourceTile;
}
MenuActionViewTile.prototype = Object.create(MenuActionOnce.prototype);
MenuActionViewTile.prototype.constructor = MenuActionViewTile;
MenuActionViewTile.prototype.start = function() {
    this._theKarte.setTileSource(this._olSourceTile);
};
MenuActionViewTile.prototype.toString = function() {
    return this.constructor.name + "(urls: " + this._olSourceTile.getUrls() + ")";
}

/**
A menu item that changes the render mode of all VectorLayer.

NOTE: Re-constructs all VectorLayers.

@class MenuActionViewPerformance
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {boolean} shouldBeFast Should OpenLayers fast rendering ('image') or precise rendering ('vector') be used?

BUG Overwrites settings required for MenuActionViewClippingLayer.
*/
function MenuActionViewPerformance(theKarte, shouldBeFast) {
    MenuActionMode.call(this, theKarte);
    this._shouldBeFast = shouldBeFast;
}
MenuActionViewPerformance.prototype = Object.create(MenuActionOnce.prototype);
MenuActionViewPerformance.prototype.constructor = MenuActionViewPerformance;
MenuActionViewPerformance.prototype.start = function() {
    var collectionLayers = this.getMap().getLayerGroup().getLayers();

    for (let i = 0; i < collectionLayers.getLength(); i++) {
        let layer = collectionLayers.item(i);

        if (layer instanceof ol.layer.Vector) {
            let layerNew = new ol.layer.Vector({
                source: layer.getSource(),
                style: layer.getStyle(),
                renderMode: this._shouldBeFast ? "image" : "vector" //TODO should use ol.source.VectorRenderType.VECTOR
            });

            this._theKarte.layerReplace(layerNew, i);
        }
    }
};
MenuActionViewPerformance.prototype.toString = function() {
    return this.constructor.name + "(shouldBeFast: " + this._shouldBeFast + ")";
};

/**
A menu item that set the current layer to be either clipping (by geometry) or not.

NOTE: Re-constructs the current VectorLayer: sets renderMode:"image" as well as precompose and postcompose handlers.

@class MenuActionViewClippingLayer
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {boolean} shouldbeClipping Should the current active layer be clipping.

BUG Overwrites settings set by MenuActionViewPerformance and does not restore them.
*/
function MenuActionViewClippingLayer(theKarte, shouldbeClipping) {
    MenuActionMode.call(this, theKarte);
    this._shouldbeClipping = shouldbeClipping;
}
MenuActionViewClippingLayer.prototype = Object.create(MenuActionOnce.prototype);
MenuActionViewClippingLayer.prototype.constructor = MenuActionViewClippingLayer;
MenuActionViewClippingLayer.prototype.start = function() {
    var layer = this._theKarte.getLayerActive();

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
};
MenuActionViewClippingLayer.prototype.toString = function() {
    return this.constructor.name + "(shouldbeClipping: " + this._shouldbeClipping + ")";
};

/**
A menu item that toggles the clustering of points.

@class MenuActionViewClusterToggle
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {int} clusterDistance The distance between features before they get clustered.
*/
function MenuActionViewClusterToggle(theKarte, clusterDistance) {
    MenuActionMode.call(this, theKarte);

    this._clusterDistance = clusterDistance;
}
MenuActionViewClusterToggle.prototype = Object.create(MenuActionOnce.prototype);
MenuActionViewClusterToggle.prototype.constructor = MenuActionViewClusterToggle;
MenuActionViewClusterToggle.prototype.start = function() {
    var currentSource = this._theKarte.getLayerActive().getSource();
    if (currentSource instanceof ol.source.Vector && !(currentSource instanceof ol.source.Cluster)) {
        if (currentSource.getFeatures().filter(feature => {
                !(feature instanceof ol.geom.Point)
            }).length === 0) {
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
};
