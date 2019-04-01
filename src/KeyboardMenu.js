/**
@class KeyboardMenu

Is a keyboard-based menu.
Has a tree-structure with leaves of {@link MenuActionAbstract}s.
{@link MenuActionAbstract}s are responsible for executing tasks.
Only one {@link MenuActionAbstract} can be in mode 'started' at any time.

Only regular keys can be used as shortcuts and all keys are interpreted in lower case.

@param String keyExecuteAction Excute the currently selected {@link MenuActionMode} (if possible).
@param String keyNavigateUp Navigate one step up in the menu structure.
@param {map<char, MenuActionAbstract | Map<...>>} actionMap The map containing the {@link MenuActionAbstract}s.
*/
function KeyboardMenu(keyExecuteAction, keyNavigateUp, actionMap) {
    this._keyExecuteAction = keyExecuteAction;
    this._keyNavigateUp = keyNavigateUp;
    this._actionMap = actionMap;


    this._userFeedbackCallback = function() {};
    this._stack = [];
}
KeyboardMenu.prototype.constructor = KeyboardMenu;

/**
@param {Function(boolean)}
*/
KeyboardMenu.prototype.setUserFeedbackCallback = function(userFeedbackCallback) {
    if (!(userFeedbackCallback instanceof Function)) {
        console.error(this.constructor.name + ".setUserFeedbackCallback: parameter must be a function.");
        return;
    }
    this._userFeedbackCallback = userFeedbackCallback;
};
/**
Handles the keypress and triggers actions if selected.
*/
KeyboardMenu.prototype.handleKeypress = function(event) {
    //Navigate in actionMap to current level: search for current position in menu.
    let actionMapSubset = this._actionMap;

    for (let i = 0; i < this._stack.length; i++) {
        actionMapSubset = actionMapSubset.get(this._stack[i]);
    }

    let currentKey = event.key.toLowerCase();
    //console.info(this.constructor.name + ": got key (" + currentKey + ").");

    //Navigate up in menu
    if (currentKey === this._keyNavigateUp) {
        console.log(this.constructor.name + ": navigating up.");
        this._stack.pop();
        console.log(this.constructor.name + ": " + this._formatStack());
        event.stopPropagation();
        this._userFeedbackCallback(true);

        if (actionMapSubset instanceof MenuActionMode) {
            actionMapSubset.abort();
        }

        return;
    }

    //Execute action
    if (currentKey === this._keyExecuteAction) {
        if (actionMapSubset instanceof MenuActionMode) {
            console.log(this.constructor.name + ": executing action. " + actionMapSubset.toString());
            this._userFeedbackCallback(true);

            actionMapSubset.stop();

            this._stack.pop();
            event.stopPropagation();
        } else {
            console.warn(this.constructor.name + ": no action selected; nothing will happen.");
        }
        return;
    }

    //MenuActionMode should handle the event
    if (actionMapSubset instanceof MenuActionMode) {
        this._userFeedbackCallback(true);
        actionMapSubset.handleKeyboardEvent(event);
        return;
    }

    //Could we navigate lower?
    if (!(actionMapSubset instanceof Map)) {
        this._userFeedbackCallback(false);
        return;
    }

    //Is it a command key?
    if (currentKey === null) {
        this._userFeedbackCallback(false);
        console.warn(this.constructor.name + ": (" + currentKey + ") not found in this (sub-)menu.");
        console.log(this.constructor.name + ": " + this._formatStack());
        return;
    }

    let actionMapNext = actionMapSubset.get(currentKey);
    if (actionMapNext instanceof Map || actionMapNext instanceof MenuActionAbstract) {
        this._userFeedbackCallback(true);

        if (actionMapNext instanceof MenuActionAbstract) {
            console.log(this.constructor.name + ": " + this._formatStack(currentKey) + " executing " + actionMapNext.toString());
            actionMapNext.start();
            return;
        }

        if (actionMapNext instanceof Map || actionMapNext instanceof MenuActionMode) {
            this._stack.push(currentKey);

            console.log(this.constructor.name + ": (" + currentKey + ") entering submenu.");
            console.log(this.constructor.name + ": " + this._formatStack());

            if (actionMapNext instanceof MenuActionMode) {
                console.log(this.constructor.name + ": starting " + actionMapNext.toString() + " " + actionMapNext.getDescription());
            }
        }
        return;
    }

    this._userFeedbackCallback(false);
    console.warn(this.constructor.name + ": (" + currentKey + ") no action associated; nothing will happen.");
};

/**
Formats the stack to be printed to console.
*/
KeyboardMenu.prototype._formatStack = function(suffix) {
    let stack = this._stack;

    if (suffix !== undefined) {
        stack = stack.concat(suffix);
    }

    return ["top"].concat(stack).map(x => "(" + x + ")").join(", ");
};

/**
Returns the menu structure as string.
Calls {@link MenuActionAbstract}.toString().
*/
KeyboardMenu.prototype.toString = function(actionMapSubset, prefix) {
    if (actionMapSubset === undefined) {
        let result = "Keyboard-based menu:" +
            "\n  up: (" + this._keyNavigateUp + ")" +
            "\n  execute: (" + this._keyExecuteAction + ")" +
            "\n---" +
            this.toString(this._actionMap, " ");

        return result;
    }

    if (actionMapSubset instanceof Map) {
        let result = "";

        for (let [key, value] of actionMapSubset) {
            if (value instanceof Map) {
                result += "\n" + prefix + "(" + key + ") " + this.toString(value, prefix + "  ");
            } else if (value !== null && value !== undefined) {
                let current = prefix + "(" + key + ") ";
                result += "\n" + current + value.toString();

                if (value.getDescription() != "") result += "\n" + " ".repeat(current.length) + value.getDescription();
            }
        }

        return result;
    }
};
