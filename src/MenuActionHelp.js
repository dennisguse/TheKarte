/**
A menu item that triggers printing the menu structure to the console and into a new window.

@augments MenuActionAbstract
@augments MenuActionOnce
*/
class MenuActionHelp extends MenuActionMode {
    constructor(theKarte) {
        super(theKarte);
        this._window = null;
    }
    start() {
        console.log(this._theKarte.menuToString());

        if (this._window === null) {
            this._window = window.open("", "TheKarte-help", "modal=yes,alwaysRaised=yes");
            if (this._window === null) {
                console.warn("MenuActionHelp: cannot open help window. Are popups blocked?");

                return;
            }
            this._window.document.write("<pre>" + this._theKarte.menuToString() + "</pre>");

            this._window.onunload = function(event) {
                this._window = null;
            }.bind(this);

            return;
        }

        this._window.close();
    }
    toString() {
        return this.constructor.name;
    }
    getDescription() {
        return "Show the keyboard-based menu.";
    }
}
