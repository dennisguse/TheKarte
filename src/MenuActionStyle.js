/**
A menu item that changes the scale (relative) for image styles of the currently active layer.

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionViewStyleImageScale extends MenuActionOnce {
    /**
    @param {int} scaleDiff The adjustment factor: scale * (1 + scaleDiff).
    */
    constructor(theKarte, scaleDiff) {
        super(theKarte);

        this._scaleDiff = scaleDiff;
    }
    start() {
        const scaleCurrent = this._theKarte.getLayerActiveStyleContainer().getImageScale();

        this._theKarte.getLayerActiveStyleContainer().setImageScale(scaleCurrent * (1 + this._scaleDiff));
        this._theKarte.getLayerActive().changed();
    }
    toString() {
        return this.constructor.name + "(scaleDiff: " + this._scaleDiff + ")";
    }
    getDescription() {
        return "Change the size of the images representing features (if loaded).";
    }
}
