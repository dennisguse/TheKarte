/**
A menu item to draw new features into the active VectorLayer.

@class MenuActionFeatureAdd
@augments MenuActionAbstract
@augments MenuActionMode
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
MenuActionFeatureAdd.prototype.getDescription = function() {
    return "Add new features to current active layer.";
};

/**
A menu item to modify existing features in the active VectorLayer.

@class MenuActionFeatureAdd
@augments MenuActionAbstract
@augments MenuActionMode
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
MenuActionFeatureModify.prototype.getDescription = function() {
    return "Modify existing features (e.g., move).";
};

/**
A menu item to delete features from the active VectorLayer.

@class MenuActionFeatureDelete
@augments MenuActionAbstract
@augments MenuActionMode
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
    this._theKarte.getLayerActive().getSource().removeFeature(selectEvent.element);
    this._interaction.getFeatures().clear();
};
MenuActionFeatureDelete.prototype.getDescription = function() {
    return "Delete existing features.";
};


/**
A menu item to select and export features of the current layer using another layer.
Requires entering the index of the layer used as a filter.

@class MenuActionFeatureSelect
@augments MenuActionAbstract
@augments MenuActionMode
@constructor

@param {boolean} isInside Should the features be inside or outside?
*/
function MenuActionFeatureFilter(theKarte, isInside) {
    MenuActionMode.call(this, theKarte);

    this._isInside = isInside;
    this._input = 0;
}
MenuActionFeatureFilter.prototype = Object.create(MenuActionMode.prototype);
MenuActionFeatureFilter.prototype.constructor = MenuActionFeatureFilter;
MenuActionFeatureFilter.prototype.start = function() {};
MenuActionFeatureFilter.prototype.handleKeyboardEvent = function(event) {
    let digit = event.keyCode - 48;
    if (0 <= digit && digit <= 9) {
        this._input = this._input * 10 + digit;
    }
};
MenuActionFeatureFilter.prototype.stop = function() {
    console.log(this.constructor.name + ": filtering layer " + this._theKarte.getLayerActiveIndex() + " using layer " + this._input);
    const filteredFeatures = this._theKarte.featuresFilterByLayer(this._theKarte.getLayerActiveIndex(), this._input, this._isInside);
    this._theKarte.exportFeatures(filteredFeatures);
};
MenuActionFeatureFilter.prototype.abort = function() {
    this._input = 0;
};
MenuActionFeatureFilter.prototype.toString = function() {
    return this.constructor.name + "(inside: " + this._isInside + ")";
};
MenuActionFeatureFilter.prototype.getDescription = function() {
    return "Export all features of the active layer that are inside/outside the features (e.g., polygons) of another layer." +
           "Enter its the index number (starting by 1) and press the execute key.";
};
