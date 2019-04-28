/**
Stores a color code in rgb and allows to convert to a RGBA-encoded string.
*/
class ColorRGB {
    /**
    @param {int} red Red.
    @param {int} green Green.
    @param {int} blue Blue.
    */
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    /**
    Creates the RGBA-encoded string with the opacity.

    @param {float} opactity The alpha chanel: 0 to 1.
    @returns The RGBA-encoded string.
    */
    createRGBAString(opacity) {
        return 'rgba(' + Math.round(this.red) + ',' + Math.round(this.green) + ',' + Math.round(this.blue) + ',' + opacity + ')';
    }
}
