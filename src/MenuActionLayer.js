/**
A menu item that adds a new VectorLayer (active).

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionLayerAdd extends MenuActionOnce {
    constructor(theKarte) {
        super(theKarte);
    }
    start() {
        this._theKarte.layerAdd();
    }
    getDescription() {
        return "Add a new (empty) layer and select it.";
    }
}

/**
A menu item that allows to select the active layer (by index).

@augments MenuActionAbstract
@augments MenuActionMode
*/
class MenuActionLayerSelect extends MenuActionMode {
    constructor(theKarte) {
        super(theKarte);
        this._input = null;
    }
    start() {
        this._input = 0;
    }
    handleKeyboardEvent(event) {
        let digit = event.keyCode - 48;
        if (0 <= digit && digit <= 9) {
            this._input = this._input * 10 + digit;
        }
    }
    stop() {
        this._theKarte.layerActivate(this._input);
    }
    abort() {
        this._input = 0;
    }
    getDescription() {
        return "Select the active layer by index. Enter the index number (starting by 1) and press the execute key.";
    }
    getHandledKeyboardEvents() {
        return this._input === 0 ? null : this._input;
    }
}

/**
A menu item to delete the active VectorLayer.

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionLayerDelete extends MenuActionOnce {
    constructor(theKarte) {
        super(theKarte);
    }
    start() {
        this._theKarte.layerDelete();
    }
    getDescription() {
        return "Delete the active layer.";
    }
}
