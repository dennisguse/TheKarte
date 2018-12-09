/**
A menu item that changes the handling of dropping text or files into TheKarte.

@class MenuActionDrop
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor

@param {DropHandler} dropHandler The dropHandler.
@param {string} mode The mode to be set at dropHandler.
*/
function MenuActionDrop(theKarte, dropHandler, mode) {
    MenuActionMode.call(this, theKarte);

    this._dropHandler = dropHandler;
    this._mode = mode;
}
MenuActionDrop.prototype = Object.create(MenuActionOnce.prototype);
MenuActionDrop.prototype.constructor = MenuActionDrop;
MenuActionDrop.prototype.start = function() {
    this._dropHandler.setMode(this._mode);
};
MenuActionDrop.prototype.toString = function() {
    return this.constructor.name + "(mode: " + this._mode + ")";
};
MenuActionDrop.prototype.getDescription = function() {
    return "Changes the mode on to process drag and dropped files.";
};
