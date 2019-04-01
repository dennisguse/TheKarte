TheKarte
===

_TheKarte_ is an interactive map application to visualize and to create geographical data.
It was designed with two design criteria in mind:

1. It works as a stand-alone application (i.e., keeping data private).
2. Everything _can be done_ with a keyboard, _is done_ with the keyboard.

_TheKarte_ uses a VI-inspired menu for interacting with the map.
Therefore, the application does not _contain_ any buttons or other UI components beside the map.

## Functionality
Functionality for data handling:
* draw features (e.g., circles, points and polygons) and delete features,
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

_Privacy:_ Please note that all geographical data only resides in your web browser (while TheKarte is executed) and nothing is send to any servers.
For background maps, see below.

## Getting started
_TheKarte_ presents a UI consisting of a map, which is presented in full screen.
As expected, a user can interact with the map using his mouse or touchscreen for panning and zooming.

### Keyboard-based menu
To access more advanced functionality the _keyboard-based menu_ needs to be used.
By default, the menu is configured for use with the _left hand_ with the fingers resting on _ASDF_.
The menu is navigated by pressing the adequate key to navigate lower into sub-folders or execute desired actions (e.g., leafs).

Special keys are:
* __'h'__: (top of the menu only) show the menu structure in an extra window as well as on the browser's _developer console_.
* __'g'__: (for actions that require a parameter) enter the parameter first and then execute the action. For example, switch to a different layer.
* __'v'__: navigate the menu upwards (incl. exiting currently executed interaction).

On example on how to use TheKarte (in brackets are the keys to pressed for the keyboard-based menu):
1. _Draw points:_
  1. Press __'a'__ and then __'s'__ to execute _MenuActionFeatureAdd(Point)_.
  2. Click on desired locations to draw points.
  3. When you are done: press __'v'__ to stop drawing while remaining in __'a'__ sub-menu.
2. _Add a new layer:_ press __'a'__ to execute _MenuActionLayerAdd_. This action is immediately executed and thus __'v'__ is not necessary.
3. _Draw circles:_
  1. Press __'f'__ to execute MenuActionFeatureAdd(Circle).
  2. Click on desired locations to draw new circles.
  3. When you are done: press __'v'__ (twice) to stop drawing and navigating to the _main menu_.
4. _Export created data as KML:_ press __'w'__, __'a'__ and then __'d'__.

The keyboard-based menu is defined in _TheKarte.html_.
Please adjust to your personal needs (for example, remove unnecessary functionality).

__Hint:__ The browser's _developer console_ shows useful information about the usage of TheKarte.

### Loading and exporting data
TheKarte loads geographical data via _drag and drop_: just drag files from your local computer onto TheKarte.

The following _file formats_ are accepted:
* _Keyhole markup language (KML)_: file suffix __'.kml'__,
* _GPS exchange format (GPX):_ file suffix __'.gpx'__,
* _GeoJSON:_ file suffix __'.json'__ or __'.geojson'__.
* _Well-known text (WKT):_ file suffix __'.wkt'__
  WKT can also be loaded by _(a)_ dragging it as _text_ and _(b)_ pasting it onto TheKarte.

Moreover, two _tools_ are included for data conversion:
* _TheKarte-2kml.html_: convert CSV-files and JSON-files to KML as well as KML to CSV.
* _TheKarte-TheKarte-geocoder-OSM-nominatim.html_: geocodes addresses via [OpenStreetMap's Nominatim](https://nominatim.openstreetmap.org/).

### Background maps
By default, some background map services (i.e., [Web Map Service (WMS)](https://en.wikipedia.org/wiki/Web_Map_Service)) are included in TheKarte.

__PRIVACY ISSUE:__ Please be aware that by using such services you _(a)_ download data from them and therefore _(b)_ these can derive, which parts of the world you are looking at (incl. zoom level).
If this is an issue, please use your own WMS (e.g., export of OpenStreetMap).

### Configuration
TheKarte can be easily configured.
This mainly considers modifying the settings to your needs or adjusting the keyboard-based menu. 
All relevant code for this resides in `TheKarte.html`.
To create a new configuration, just copy `TheKarte.html`, modify this copy, and open in your web browser.

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

__ATTENTION__: Please note that the parameters _usually_ need (depending on your browser) to be [URI-encoded](https://en.wikipedia.org/wiki/Query_string#URL_encoding) (e.g. `encodeURI()` for JavaScript).
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
* Load a local KML file (here: `Berlin.kml`).  
  URL: `file:///home/user/TheKarte/TheKarte?geoURL(kml, file:///home/user/TheKarte/data/Berlin.kml)`
  __ATTENTION:__ Access to local files and folders (i.e., `file:///`) is __usually__ not permitted from a HTML-page, as this is considered a __security risk__.  
  * [Firefox](http://firefox.com): If the HTML-page was loaded from `file:///`, then files below this path can accessed. The path needs to be absolute.  
  * [Chrome/Chromium](https://www.google.com/intl/en_ALL/chrome/): Needs to be started with a command line parameter. Due to security implications this option is omitted here.

## Technical details
TheKarte is implemented using [OpenLayers](https://openlayers.org/) and pure (aka vanilla) JavaScript.
All map-related and geographical data-related features are provided by OpenLayers.

