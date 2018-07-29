TheKarte
===

TheKarte is an interactive map application to visualize and also create geographical data.
It was designed with two design criteria in mind:

1. It works as a stand-alone application.
2. Everything can be done with a keyboard is done with the keyboard.

TheKarte uses a VI-inspired menu for interacting with the map.
Therefore, the application does not _contain_ any buttons or other UI components beside the map.

_NOTE:_ Please keep in mind that this is only a proof-of-concept.

##How to use
TheKarte presents a UI consisting of a map, which is presented in full screen.
As expected, a user can interact with the map using his mouse or touchscreen for panning and zooming.

To access more advanced functionality the _keyboard-based menu_ is available.
This menu is navigated by pressing the adequate key to navigate lower and ESC to navigate upwards.

The menu structure is printed to the browser's developer console by pressing _'h'_ (top of the menu only).

Functionality for data handling:
* draw features (points and polygons),
* delete features,
* load features from files (via drag and drop)
* add and delete layers, and
* exporting data via local download

Functionality to change the view:
* change background tile,
* zoom to the extend of the current layer, and
* change rendering method if performance is not sufficient.

##Technical details
TheKarte is implemented using [OpenLayers](https://openlayers.org/) and pure (aka vanilla JavaScript).
All map-related and geodata-related features are provided by OpenLayers.
