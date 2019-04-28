/**
Encapsulates and caches openlayers styles.
*/
class StyleContainer {
    /**
    @param {StyleCreator} styleCreator
    @param {ColorRGB} colorRGB
    */
    constructor(styleCreator, colorRGB) {
        this._cache = new Map();

        this._styleCreator = styleCreator;
        this._colorRGB = colorRGB;

        this._image_URL = null;
        this._image_scale = 1;
    }

    /**
    Use an image for points.

    @param {URL} imageURL The url to the image to be used.
    */
    setImage(imageURL) {
        if (this._image_URL !== imageURL) {
            this._cache.clear();
        }
        this._image_URL = imageURL;
    }

    /**
    Get the scaling factor for images (if used).

    @returns {int} The scaling factor.
    */
    getImageScale() {
        return this._image_scale;
    }

    /**
    Set the scaling factor for images (if used).

    @param {int} scale The scaling factor.
    */
    setImageScale(scale) {
        if (this._image_scale !== scale) {
            this._cache.clear();
        }
        this._image_scale = scale;
    }

    /**
    Returns the style for the feature to be rendered.

    @param {ol.Feature} feature The feature to be rendered.
    @returns {ol.style.Style}
    */
    getStyle(feature) {
        let featureKey = feature.getGeometry().getType();

        let featureCount = 1;
        if (feature.get('features') !== undefined) {
            featureCount = feature.get('features').length;
            featureKey += "_" + featureCount;
        }

        let style = this._cache.get(featureKey);
        if (style !== undefined) {
            return style;
        }

        style = this._styleCreator.createStyle(this._colorRGB, feature, featureCount, this._image_URL, this._image_scale);
        this._cache.set(featureKey, style);
        return style;
    }

    /**
    Creates a binded function call to this.getStyle().

    @returns {Function}
    */
    getStyleFunction() {
        return this.getStyle.bind(this);
    }
}
