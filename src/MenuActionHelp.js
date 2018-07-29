/**
A menu item that triggers printing the menu structure to the console.

@class MenuActionFeatureDelete
@augments MenuActionAbstract
@augments MenuActionOnce
@constructor
*/
function MenuActionHelp(theKarte) {
    MenuActionMode.call(this, theKarte);
}
MenuActionHelp.prototype = Object.create(MenuActionOnce.prototype);
MenuActionHelp.prototype.constructor = MenuActionHelp;
MenuActionHelp.prototype.start = function() {
    this._theKarte.printMenu();
};
