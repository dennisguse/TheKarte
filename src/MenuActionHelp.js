/**
A menu item that triggers printing the menu structure to the console and into a new window.

@class MenuActionHelp
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionHelp(theKarte) {
    MenuActionMode.call(this, theKarte);
    this._window = null;
}
MenuActionHelp.prototype = Object.create(MenuActionOnce.prototype);
MenuActionHelp.prototype.constructor = MenuActionHelp;
MenuActionHelp.prototype.start = function() {
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
};
MenuActionHelp.prototype.toString = function() {
    return this.constructor.name;
};
MenuActionHelp.prototype.getDescription = function() {
    return "Show the keyboard-based menu.";
};
