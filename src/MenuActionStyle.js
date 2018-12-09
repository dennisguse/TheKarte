/**
A menu item that changes the scale (relative) for image styles of the currently active layer.

@class MenuActionViewStyleImageScale
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {int} scaleDiff The adjustment factor: scale * (1 + scaleDiff).
*/
function MenuActionViewStyleImageScale(theKarte, scaleDiff) {
    MenuActionMode.call(this, theKarte);

    this._scaleDiff = scaleDiff;
}
MenuActionViewStyleImageScale.prototype = Object.create(MenuActionOnce.prototype);
MenuActionViewStyleImageScale.prototype.constructor = MenuActionViewStyleImageScale;
MenuActionViewStyleImageScale.prototype.start = function() {
    const scaleCurrent = this._theKarte.getLayerActiveStyleContainer().getImageScale();

    this._theKarte.getLayerActiveStyleContainer().setImageScale(scaleCurrent * (1 + this._scaleDiff));
    this._theKarte.getLayerActive().changed();
};
MenuActionViewStyleImageScale.prototype.toString = function() {
    return this.constructor.name + "(scaleDiff: " + this._scaleDiff + ")";
};
MenuActionViewStyleImageScale.prototype.getDescription = function() {
    return "Change the size of the images representing features (if loaded).";
};
