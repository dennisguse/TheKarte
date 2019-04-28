/**
A menu item to draw new features into the active VectorLayer.

@augments MenuActionAbstract
@augments MenuActionMode
*/
class MenuActionFeatureAdd extends MenuActionMode {
    /**
    @param {string} featureType The openlayer feature to draw.
    */
    constructor(theKarte, featureType) {
        super(theKarte);

        //FIXME Check featureType is valid

        this._interaction = null;
        this._featureType = featureType;
    }
    start() {
        this._interaction = new ol.interaction.Draw({
            source: this._theKarte.getLayerActive().getSource(),
            type: this._featureType
        });

        this.getMap().addInteraction(this._interaction);
    }
    stop() {
        this.getMap().removeInteraction(this._interaction);
        this._interaction = null;
    }
    toString() {
        return this.constructor.name + "(" + this._featureType + ")";
    }
    getDescription() {
        return "Add new features to current active layer.";
    }
}

/**
A menu item to modify existing features in the active VectorLayer.

@augments MenuActionAbstract
@augments MenuActionMode
*/
class MenuActionFeatureModify extends MenuActionMode {
    constructor(theKarte) {
        super(theKarte);

        this._interaction = null;
    }
    start() {
        this._interaction = new ol.interaction.Modify({
            source: this._theKarte.getLayerActive().getSource()
        });

        this.getMap().addInteraction(this._interaction);
    }
    stop() {
        this.getMap().removeInteraction(this._interaction);
        this._interaction = null;
    }
    getDescription() {
        return "Modify existing features (e.g., move).";
    }
}

/**
A menu item to delete features from the active VectorLayer.

@augments MenuActionAbstract
@augments MenuActionMode
*/
class MenuActionFeatureDelete extends MenuActionMode {
    constructor(theKarte) {
        super(theKarte);

        this._interaction = null;
    }
    start() {
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
    }
    stop() {
        this.getMap().removeInteraction(this._interaction);
        this._interaction = null;
        this.getMap().removeInteraction(this._interactionHighlight);
    }
    _featureDelete(selectEvent) {
        this._theKarte.getLayerActive().getSource().removeFeature(selectEvent.element);
        this._interaction.getFeatures().clear();
    }
    getDescription() {
        return "Delete existing features.";
    }
}


/**
A menu item to select and export features of the current layer using another layer.
Requires entering the index of the layer used as a filter.

@augments MenuActionAbstract
@augments MenuActionMode
*/
class MenuActionFeatureFilter extends MenuActionMode {
    /**
    @param {boolean} isInside Should the features be inside or outside?
    */
    constructor(theKarte, isInside) {
        super(theKarte);

        this._isInside = isInside;
        this._input = 0;
    }
    start() {
        //NOPE
    }
    handleKeyboardEvent(event) {
        let digit = event.keyCode - 48;
        if (0 <= digit && digit <= 9) {
            this._input = this._input * 10 + digit;
        }
    }
    stop() {
        console.log(this.constructor.name + ": filtering layer " + this._theKarte.getLayerActiveIndex() + " using layer " + this._input);
        const filteredFeatures = this._theKarte.featuresFilterByLayer(this._theKarte.getLayerActiveIndex(), this._input, this._isInside);
        this._theKarte.exportFeatures(filteredFeatures);
    }
    abort() {
        this._input = 0;
    }
    toString() {
        return this.constructor.name + "(inside: " + this._isInside + ")";
    }
    getDescription() {
        return "Export all features of the active layer that are inside/outside the features (e.g., polygons) of another layer." +
            "Enter its the index number (starting by 1) and press the execute key.";
    }
}
