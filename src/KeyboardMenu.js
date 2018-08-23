/*
@class KeyboardMenu

Is a keyboard-based menu.
Has a tree-structure with leaves of {@link MenuActionAbstract}s.
{@link MenuActionAbstract}s are responsible for executing tasks.
Only one {@link MenuActionAbstract} can be in mode 'started' at any time.

Only regular keys can be used as shortcuts and all keys are interpreted in lower case.
*/
function KeyboardMenu(actionMap) {
    this._actionMap = actionMap;
    this._stack = [];
}
KeyboardMenu.prototype.constructor = KeyboardMenu;

/**
Handles the keypress and triggers actions if selected.
*/
KeyboardMenu.prototype.handleKeypress = function(event) {
    //Navigate in actionMap to current level: search for current position in menu.
    var actionMapSubset = this._actionMap;

    for (let i = 0; i < this._stack.length; i++) {
        actionMapSubset = actionMapSubset.get(this._stack[i]);
    }

    //ENTER or ESC - leave current (sub)-menu
    if (event.code == "Escape" || event.key == "Enter") {
        if (actionMapSubset instanceof MenuActionMode) {
            if (event.code == "Enter") actionMapSubset.stop();
            else actionMapSubset.abort();
        }

        this._stack.pop();
        event.stopPropagation();
        return;
    }

    //MenuActionMode should handle the event
    if (actionMapSubset instanceof MenuActionMode) {
        actionMapSubset.handleKeyboardEvent(event);
        return;
    }

    //Could we navigate lower?
    if (!(actionMapSubset instanceof Map)) {
        return;
    }

    //Is it a regular key?
    var currentKey = event.key.toLowerCase();
    if (currentKey === null) {
        console.warn(this.constructor.name + ": key " + currentKey + " not found in this (sub-)menu.");
        return;
    }

    var actionMapNext = actionMapSubset.get(currentKey);
    if (actionMapNext instanceof Map || actionMapNext instanceof MenuActionAbstract) {
        if (actionMapNext instanceof MenuActionAbstract) {
            console.log(this.constructor.name + ": executing " + actionMapNext.toString());
            actionMapNext.start();
        }

        if (actionMapNext instanceof Map || actionMapNext instanceof MenuActionMode) {
            this._stack.push(currentKey);
        }
    }
};

/**
Returns the menu structure as string.
Calls {@link MenuActionAbstract}.toString().
*/
KeyboardMenu.prototype.toString = function(actionMapSubset, prefix) {
    if (actionMapSubset === undefined)
        return "Keyboard-based menu:" + this.toString(this._actionMap, "  ");

    if (actionMapSubset instanceof Map) {
        let returnValue = "";

        let keys = Array.from(actionMapSubset.keys()).sort();

        for (let i = 0; i < keys.length; i++) {
            let current = actionMapSubset.get(keys[i]);
            if (current instanceof Map) {
                returnValue += "\n" + prefix + keys[i] + ": " + this.toString(current, prefix + "  ");
            } else if (current !== null && current !== undefined) {
                returnValue += "\n" + prefix + keys[i] + ": " + current.toString();
            }
        }
        return returnValue;
    }
};
