/**
Encapsulates and caches openlayers styles.
@class StyleContainer
@constructor

@param {StyleCreator} styleCreator
@param {ColorRGB} colorRGB
*/
function StyleContainer(styleCreator, colorRGB) {
    this._cache = new Map();

    this._styleCreator = styleCreator;
    this._colorRGB = colorRGB;

    this._image_URL = null;
    this._image_scale = 1;
}
StyleContainer.prototype = StyleContainer;
StyleContainer.prototype.constructor = StyleContainer;

/**
Use an image for points.

@param {URL} imageURL The url to the image to be used.
*/
StyleContainer.prototype.setImage = function(imageURL) {
    if (this._image_URL !== imageURL) {
        this._cache.clear();
    }
    this._image_URL = imageURL;
};

/**
Get the scaling factor for images (if used).

@returns {int} The scaling factor.
*/
StyleContainer.prototype.getImageScale = function() {
    return this._image_scale;
};

/**
Set the scaling factor for images (if used).

@param {int} scale The scaling factor.
*/
StyleContainer.prototype.setImageScale = function(scale) {
    if (this._image_scale !== scale) {
        this._cache.clear();
    }
    this._image_scale = scale;
};

/**
Returns the style for the feature to be rendered.

@param {ol.Feature} feature The feature to be rendered.
@returns {ol.style.Style}
*/
StyleContainer.prototype.getStyle = function(feature) {
    var featureKey = feature.getGeometry().getType();

    var featureCount = 1;
    if (feature.get('features') !== undefined) {
        featureCount = feature.get('features').length;
        featureKey += "_" + featureCount;
    }

    var style = this._cache.get(featureKey);
    if (style !== undefined) {
        return style;
    }

    style = this._styleCreator.createStyle(this._colorRGB, feature, featureCount, this._image_URL, this._image_scale);
    this._cache.set(featureKey, style);
    return style;
};

/**
Creates a binded function call to this.getStyle().

@returns {Function}
*/
StyleContainer.prototype.getStyleFunction = function() {
    return this.getStyle.bind(this);
};
