/**
An abstract menu item, which can trigger an action.

@abstract
*/
class MenuActionAbstract {
    /**
    @param {TheKarte} theKarte Instance of theKarte for which this element should trigger actions.
    */
    constructor(theKarte) {
        this._theKarte = theKarte;
    }
    /**
    @return {ol.Map} Returns the map.
    */
    getMap() {
        return this._theKarte.getMap();
    }
    /**
    @returns {string} Returns the constructor name.
    */
    toString() {
        return this.constructor.name;
    }
    /**
    @abstract
    @returns {string} Returns the description of the functionality.
    */
    getDescription() {}
}

/**
An abstract menu item that finishes immmediately.

@abstract
@augments MenuActionAbstract
*/
class MenuActionOnce extends MenuActionAbstract {
    constructor(theKarte) {
        super(theKarte);
    }
    /**
    The action to be executed.
    @abstract
    */
    start() {
        console.warn(this.constructor.name + ": should be overridden.");
    }
}

/**
An abstract menu item that remains active until stopped or aborted.
Can handle keyboard input when active.

@augments MenuActionAbstract
*/
class MenuActionMode extends MenuActionAbstract {
    constructor(theKarte) {
        super(theKarte);
    }
    /**
    The action to be executed.
    @abstract
    */
    start() {
        console.warn(this.constructor.name + ": should be overridden.");
    }
    /**
    The action is finished.
    @abstract
    */
    stop() {
        console.warn(this.constructor.name + ": should be overridden.");
    }
    /**
    The action should be aborted.
    */
    abort() {
        this.stop();
    }
    /**
    @params {Event} event A keyboard event to handle.
    @abstract
    */
    handleKeyboardEvent(event) {}
}
