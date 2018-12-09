/**
Factory for {@link ol.style.Style}s.

@class
@constructor
*/
function StyleCreator() {}
StyleCreator.prototype.constructor = StyleCreator;

/**
Creates a style to render this feature.
If imageURL is set, an image style is created otherwise a render style.

@param {ColorRGB} colorRGB
@param {feature} feature The feature to be represented.
@param {int} clusterSize The number of features to be represented.
@param {string} imageURL The image url to be used.
@param {float} scale The scaling factor.
*/
StyleCreator.prototype.createStyle = function(colorRGB, feature, clusterSize, imageURL, scale) {
    if (imageURL !== undefined && imageURL !== null) {
        return this._createStyleImage(imageURL, scale);
    }

    return this._createStyleRender(colorRGB, feature, clusterSize);
};

/**
Creates rendering style.

@param {ColorRGB} colorRGB
@param {feature} feature The feature to be represented.
@param {int} clusterSize The number of features to be represented.
*/
StyleCreator.prototype._createStyleRender = function(colorRGB, feature, clusterSize) {
    var colorFill = colorRGB.createRGBAString(0.5);
    var colorBorder = colorRGB.createRGBAString(1);

    let style = null;
    switch (feature.getGeometry().getType()) {
        case "Point":
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    stroke: new ol.style.Stroke({
                        color: colorBorder,
                        width: 1
                    }),
                    fill: new ol.style.Fill({
                        color: colorFill
                    }),
                    radius: 5
                })
            });
            break;

        default:
            style = new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: colorBorder,
                    width: 3
                }),
                fill: new ol.style.Fill({
                    color: colorFill
                })
            });
    }

    if (clusterSize > 1) {
        style.setText(new ol.style.Text({
            text: clusterSize + "",
            fill: new ol.style.Fill({
                color: "#ffffff"
            })
        }));
    }

    return style;
};

/**
Creates an image-based style.

@param {string} imageURL The image url to be used.
@param {float} scale The scaling factor.
*/
StyleCreator.prototype._createStyleImage = function(imageURL, scale) {
    return new ol.style.Style({
        image: new ol.style.Icon({
            src: imageURL,
            scale: scale
        })
    });
};
