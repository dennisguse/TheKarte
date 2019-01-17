TheKarte
===

_TheKarte_ is an interactive map application to visualize and also create geographical data.
It was designed with two design criteria in mind:

1. It works as a stand-alone application.
2. Everything can be done with a keyboard is done with the keyboard.

_TheKarte_ uses a VI-inspired menu for interacting with the map.
Therefore, the application does not _contain_ any buttons or other UI components beside the map.

## Getting started
_TheKarte_ presents a UI consisting of a map, which is presented in full screen.
As expected, a user can interact with the map using his mouse or touchscreen for panning and zooming.

Geographical data and image can be loaded via drag and drop.
Created and loaded geographical data can be exported (downloaded) to the local device.

To access more advanced functionality the _keyboard-based menu_ is available.
This menu is navigated by pressing the adequate key to navigate lower and __v__ to navigate upwards.

The menu is shown by pressing __'h'__ (top of the menu only) in an extra window.

## Functionality
Functionality for data handling:
* draw features (circles, points and polygons),
* delete features,
* add and delete layers, and
* select features using other features (e.g., a subset of points within a polygon).

Loading and exporting data:
* load features from files (via drag and drop),
* exporting data via local download.

Functionality for styling:
* (default) every layer is assigned a distinctive color,
* use image (one per layer) to represent points (via drag and drop), and
* clip lower layers (hide background map).

Functionality to change the view:
* change the background tile,
* zoom to the extend of the current layer, and
* change rendering method if performance is not sufficient.

## Autopilot
TheKarte features has an autopilot feature (i.e., allowing to load data and interact with it automatically).
This scripting feature enables to pre-setup TheKarte if desired.

To use the autopilot, a URL containing the commands must be provided as [location.search](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search).
Commands are separated by the variable separator `&` and are executed in order from left to right.

Supported commands:
* all __configured__ keyboard-based menu commands (spelling must be identical to configuration)
* `geoText(dataType, TEXT)`
* `geoURL(dataType, URL)`
* `styleImageURL(URL)`
* `screenshot(filename)`

__ATTENTION__: Please note that the parameters need to be [URI-encoded](https://en.wikipedia.org/wiki/Query_string#URL_encoding) (e.g. `encodeURI()` for JavaScript).
For example, white spaces need to be encoded as `%20` in a URL. This is relevant especially while using [WKT(https://en.wikipedia.org/wiki/Well-known_text) (e.g., `POINT(1 1)` becomes `POINT(1%201)`).

Some autopilot demos:
* Draw a point for Berlin (Germany) on the first layer, add a second layer and Paris (France).
  Berlin is shown in blue and Paris in green as they reside on different layers.  
  URL: `TheKarte.html?geoText(wkt,POINT(13.03367%2052.41362))&a&a&geoText(wkt,POINT(2.3522219%2048.856614))`
* Loading a KML file (contain points) and render these using the OpenLayers logo.  
  URL: `TheKarte.html?geoURL(kml,https://openlayers.org/en/latest/examples/data/kml/2012_Earthquakes_Mag5.kml)&styleImageURL(https://openlayers.org/en/latest/examples/resources/logo-70x70.png)`
* Creates a screenshot and exports it as _TheKarte-screenshot.png_ to the local device (usually the download-folder).
  URL:
  `TheKarte.html?screenshot(TheKarte-screenshot.png)`

## Configuration
TheKarte can be easily configured.
This mainly considers modifying the settings to your needs or adjusting the keyboard-based menu.
All relevant code for this resides in `TheKarte.html`.
To create a new configuration, just copy `TheKarte.html`, modify this copy, and open in your web browser.

## Technical details
TheKarte is implemented using [OpenLayers](https://openlayers.org/) and pure (aka vanilla) JavaScript.
All map-related and geographical data-related features are provided by OpenLayers.

## Privacy
Please note that all geographical data only resides in your web browser (while TheKarte is executed) and _nothing_ is send to any servers.
The only exception is that, depending on your configuration, the tiles (the actual map) are downloaded from third-party servers.
In this case, the area you are working on is disclosed to the operator of these servers.
