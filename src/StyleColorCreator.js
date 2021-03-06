/**
Creates continues distinguished colors via golden ration.

Code for color generation was taken partly from https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
*/
class StyleColorCreator {
    constructor(start) {
        this._h = start != undefined ? start : 0;
    }
    _HSVtoColorRGB(h, s, v, a) {
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        let r, g, b;
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }

        return new ColorRGB(r * 255, g * 255, b * 255);
    }

    /**
    Returns the current color.

    @param {float} opacity The opacity (alpha channel) of the color.
    @return {ColorRGB} The color.
    */
    getColor(opacity) {
        return this._HSVtoColorRGB(this._h, 0.99, 0.99, opacity === undefined ? 0.5 : opacity);
    }

    /**
    Go to next color.

    @param {float} opacity The opacity (alpha channel) of the color.
    @return {ColorRGB} The color.
    */
    nextColor(opacity) {
        this._h += 0.618033988749895; //Golden ratio conjugate
        this._h %= 1;

        return this.getColor(opacity);
    }
}
