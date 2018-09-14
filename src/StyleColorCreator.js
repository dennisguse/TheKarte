/**
Creates continues distinguished colors via golden ration.

Code for color generation was taken partly from https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/

@class
@constructor
*/
function StyleColorCreator(start) {
    this._h = start != undefined ? start : 0;
}
StyleColorCreator.prototype.constructor = StyleColorCreator;
StyleColorCreator.prototype._HSVtoColorRGB = function(h, s, v, a) {
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var r, g, b;
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }

    return new ColorRGB(r * 255, g * 255, b * 255);
};

/**
Returns the current color.

@param {float} opacity The opacity (alpha channel) of the color.
@return {ColorRGB} The color.
*/
StyleColorCreator.prototype.getColor = function(opacity) {
    return this._HSVtoColorRGB(this._h, 0.99, 0.99, opacity === undefined ? 0.5 : opacity);
};

/**
Go to next color.

@param {float} opacity The opacity (alpha channel) of the color.
@return {ColorRGB} The color.
*/
StyleColorCreator.prototype.nextColor = function(opacity) {
    this._h += 0.618033988749895; //Golden ratio conjugate
    this._h %= 1;

    return this.getColor(opacity);
};
