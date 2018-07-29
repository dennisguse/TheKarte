/**
A menu item to draw new features into the active VectorLayer.

@class MenuActionFeatureAdd
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {string} featureType The openlayer feature to draw.
*/
function MenuActionFeatureAdd(theKarte, featureType) {
    MenuActionMode.call(this, theKarte);

    //FIXME Check featureType is valid

    this._interaction = null;
    this._featureType = featureType;
}
MenuActionFeatureAdd.prototype = Object.create(MenuActionMode.prototype);
MenuActionFeatureAdd.prototype.constructor = MenuActionFeatureAdd;
MenuActionFeatureAdd.prototype.start = function() {
    this._interaction = new ol.interaction.Draw({
        source: this._theKarte.getLayerActive().getSource(),
        type: this._featureType
    });

    this.getMap().addInteraction(this._interaction);
};
MenuActionFeatureAdd.prototype.stop = function() {
    this.getMap().removeInteraction(this._interaction);
    this._interaction = null;
};
MenuActionFeatureAdd.prototype.toString = function() {
    return this.constructor.name + "(" + this._featureType + ")";
};

/**
A menu item to modify existing features in the active VectorLayer.

@class MenuActionFeatureAdd
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionFeatureModify(theKarte) {
    MenuActionMode.call(this, theKarte);

    this._interaction = null;
}
MenuActionFeatureModify.prototype = Object.create(MenuActionMode.prototype);
MenuActionFeatureModify.prototype.constructor = MenuActionFeatureModify;
MenuActionFeatureModify.prototype.start = function() {
    this._interaction = new ol.interaction.Modify({
        source: this._theKarte.getLayerActive().getSource()
    });

    this.getMap().addInteraction(this._interaction);
};
MenuActionFeatureModify.prototype.stop = function() {
    this.getMap().removeInteraction(this._interaction);
    this._interaction = null;
};

/**
A menu item to delete features from the active VectorLayer.

@class MenuActionFeatureDelete
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionFeatureDelete(theKarte) {
    MenuActionMode.call(this, theKarte);

    this._interaction = null;
}
MenuActionFeatureDelete.prototype = Object.create(MenuActionMode.prototype);
MenuActionFeatureDelete.prototype.constructor = MenuActionFeatureDelete;
MenuActionFeatureDelete.prototype.start = function() {
    this._interaction = new ol.interaction.Select({
        layers: [this._theKarte.getLayerActive()]
    });
    this._interaction.getFeatures().on('add', this._featureDelete.bind(this));
    this.getMap().addInteraction(this._interaction);

    this._interactionHighlight = new ol.interaction.Select({
        layers: [this._theKarte.getLayerActive()],
        condition: ol.events.condition.pointerMove
    });
    this.getMap().addInteraction(this._interactionHighlight);
};
MenuActionFeatureDelete.prototype.stop = function() {
    this.getMap().removeInteraction(this._interaction);
    this._interaction = null;
    this.getMap().removeInteraction(this._interactionHighlight);
};
MenuActionFeatureDelete.prototype._featureDelete = function(selectEvent) {
    this._theKarte.getLayerActive().getSource().removeFeature(selectEvent.element)
    this._interaction.getFeatures().clear();
};
