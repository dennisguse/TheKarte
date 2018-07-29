/**
A menu item that adds a new VectorLayer (active).

@class MenuActionLayerAdd
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionLayerAdd(theKarte) {
    MenuActionMode.call(this, theKarte);
}
MenuActionLayerAdd.prototype = Object.create(MenuActionOnce.prototype);
MenuActionLayerAdd.prototype.constructor = MenuActionLayerAdd;
MenuActionLayerAdd.prototype.start = function() {
    this._theKarte.layerAdd();
};

/**
A menu item that allows to select the active layer (by index).

@class MenuActionLayerSelect
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionLayerSelect(theKarte) {
    MenuActionMode.call(this, theKarte);
    this._input = null;
}
MenuActionLayerSelect.prototype = Object.create(MenuActionMode.prototype);
MenuActionLayerSelect.prototype.constructor = MenuActionLayerSelect;
MenuActionLayerSelect.prototype.start = function() {
    this._input = 0;
};
MenuActionLayerSelect.prototype.handleKeyboardEvent = function(event) {
    var digit = event.keyCode - 48;
    if (0 <= digit && digit <= 9) {
        this._input = this._input * 10 + digit;
    }
};
MenuActionLayerSelect.prototype.stop = function() {
    this._theKarte.layerActivate(this._input - 1);
    console.log(this._input - 1);
};
MenuActionLayerSelect.prototype.abort = function() {
    this._input = "";
};

/**
A menu item to delete the active VectorLayer.

@class MenuActionLayerSelect
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionLayerDelete(theKarte) {
    MenuActionMode.call(this, theKarte);
}
MenuActionLayerDelete.prototype = Object.create(MenuActionOnce.prototype);
MenuActionLayerDelete.prototype.constructor = MenuActionLayerDelete;
MenuActionLayerDelete.prototype.start = function() {
    this._theKarte.layerDelete();
};
