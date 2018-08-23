/**
A menu item that triggers printing the menu structure to the console and into a new window.

@class MenuActionFeatureDelete
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
        this._window.document.write("<pre>" + this._theKarte.menuToString() + "</pre>");

        this._window.onunload = function(event) {this._window = null;}.bind(this);
    }
};
