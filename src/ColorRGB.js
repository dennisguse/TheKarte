/**
Stores a color code in rgb and allows to convert to a RGBA-encoded string.

@class
@param {int} red Red.
@param {int} green Green.
@param {int} blue Blue.
*/
function ColorRGB(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
}
ColorRGB.prototype.constructor = ColorRGB;

/**
Creates the RGBA-encoded string with the opacity.

@param {float} opactity The alpha chanel: 0 to 1.
@returns The RGBA-encoded string.
*/
ColorRGB.prototype.createRGBAString = function(opacity) {
    return 'rgba(' + Math.round(this.red) + ',' + Math.round(this.green) + ',' + Math.round(this.blue) + ',' + opacity + ')';
};
