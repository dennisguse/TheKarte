/**
A menu item that changes the handling of dropping text or files into TheKarte.

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionDrop extends MenuActionOnce {
    /**
    @param {DropHandler} dropHandler The dropHandler.
    @param {string} mode The mode to be set at dropHandler.
    */
    constructor(theKarte, dropHandler, mode) {
        super(theKarte);

        this._dropHandler = dropHandler;
        this._mode = mode;
    }
    start() {
        this._dropHandler.setMode(this._mode);
    }
    toString() {
        return this.constructor.name + "(mode: " + this._mode + ")";
    }
    getDescription() {
        return "Changes the mode on to process drag and dropped files.";
    }
}
