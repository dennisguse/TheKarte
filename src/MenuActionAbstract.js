/**
An abstract menu item, which can trigger an action.

@abstract
@class MenuActionAbstract
@constructor

@param {TheKarte} theKarte Instance of theKarte for which this element should trigger actions.
*/
function MenuActionAbstract(theKarte) {
    this._theKarte = theKarte;
}
MenuActionAbstract.prototype.constructor = MenuActionAbstract;
/**
@return {ol.Map} Returns the map.
*/
MenuActionAbstract.prototype.getMap = function() {
    return this._theKarte.getMap();
};
/**
@returns {string} Returns the constructor name.
*/
MenuActionAbstract.prototype.toString = function() {
    return this.constructor.name;
};
/**
@abstract
@returns {string} Returns the description of the functionality.
*/
MenuActionAbstract.prototype.getDescription = function() {};

/**
An abstract menu item that finishes immmediately.

@abstract
@class MenuActionOnce
@augments MenuActionAbstract
@constructor
*/
function MenuActionOnce(theKarte) {
    MenuActionAbstract.call(this, theKarte);
}
MenuActionOnce.prototype = Object.create(MenuActionAbstract.prototype);
MenuActionOnce.prototype.constructor = MenuActionOnce;
/**
The action to be executed.
@abstract
*/
MenuActionOnce.prototype.start = function() {
    console.warn(this.constructor.name + ": should be overridden.");
};

/**
An abstract menu item that remains active until stopped or aborted.
Can handle keyboard input when active.

@abstract
@class MenuActionMode
@augments MenuActionAbstract
@constructor
*/
function MenuActionMode(theKarte) {
    MenuActionAbstract.call(this, theKarte);
}
MenuActionMode.prototype = Object.create(MenuActionAbstract.prototype);
MenuActionMode.prototype.constructor = MenuActionMode;
/**
The action to be executed.
@abstract
*/
MenuActionMode.prototype.start = function() {
    console.warn(this.constructor.name + ": should be overridden.");
};
/**
The action is finished.
@abstract
*/
MenuActionMode.prototype.stop = function() {
    console.warn(this.constructor.name + ": should be overridden.");
};
/**
The action should be aborted.
*/
MenuActionMode.prototype.abort = function() {
    this.stop();
};
/**
@params {Event} event A keyboard event to handle.
@abstract
*/
MenuActionMode.prototype.handleKeyboardEvent = function(event) {};
