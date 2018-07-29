/**
A factory for creating ol.style.Styles.
Does automatic coloring via golden ration.

Code taken for color generation was taken from https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/

@class
*/
function AutomaticStyler(start) {
    this._h = start !== "undefined " ? start : 0;
}
AutomaticStyler.prototype.constructor = AutomaticStyler;
AutomaticStyler.prototype._HSVtoRGB = function(h, s, v, a) {
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
    var rgba = 'rgba(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ',' + a + ')';
    return rgba;
};
/**
@return {function} Accessor function to a map containing the styles distinguishing by geometryType.
*/
AutomaticStyler.prototype.createStyle = function() {
    this._h += 0.618033988749895; //Golden ratio conjugate
    this._h %= 1;

    var styles = {
        "Point": new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: this._HSVtoRGB(this._h, 0.99, 0.99, 0.5)
                }),
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: this._HSVtoRGB(this._h, 0.99, 0.99, 0.5),
                    width: 1
                })
            })
        }),
        null: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: this._HSVtoRGB(this._h, 0.99, 0.99, 1),
                width: 3
            }),
            fill: new ol.style.Fill({
                color: this._HSVtoRGB(this._h, 0.99, 0.99, 0.5)
            })
        })
    }

    return function(feature) {
        var currentStyle = styles[feature.getGeometry().getType()];

        return currentStyle != null ? currentStyle : styles[null];
    }
};
