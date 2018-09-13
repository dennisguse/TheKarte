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

@class MenuActionLayerSelect
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {boolean} shouldBeFast Should OpenLayers fast rendering ('image') or precise rendering ('vector') be used?
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

            collectionLayers.setAt(i, layerNew);
        }
    }
};
MenuActionViewPerformance.prototype.toString = function() {
    return this.constructor.name + "(shouldBeFast: " + this._shouldBeFast + ")";
};

/**
A menu item that toggles the clustering of points.

@class MenuActionViewClusterToggle
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionViewClusterToggle(theKarte) {
    MenuActionMode.call(this, theKarte);
}
MenuActionViewClusterToggle.prototype = Object.create(MenuActionOnce.prototype);
MenuActionViewClusterToggle.prototype.constructor = MenuActionViewClusterToggle;
MenuActionViewClusterToggle.prototype.start = function() {
    var currentSource = this._theKarte.getLayerActive().getSource();
    if (currentSource instanceof ol.source.Vector) {
        if (currentSource.getFeatures().filter(feature => {
                !(feature instanceof ol.geom.Point)
            }).lenght != 0) {
            console.warn(this.constructor.name, "view can only be clustered if _only_ points are on the layer");
            return;
        }
        this._theKarte.getLayerActive().setSource(
            new ol.source.Cluster({
                source: currentSource,
                distance: 40
            })
        );
    } else
    if (currentSource instanceof ol.source.Cluster) {
        this._theKarte.getLayerActive().setSource(
            new ol.source.Vector({
                source: currentSource
            })
        );
    }
};
