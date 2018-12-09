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

## Configuration
TheKarte can be easily configured.
This mainly considers modifying the settings to your needs or adjusting the keyboard-based menu.
All relevant code for this resides in `TheKarte.html`.
To create a new configuration, just copy `TheKarte.html`, modify this copy, and open in your web browser.

## Technical details
TheKarte is implemented using [OpenLayers](https://openlayers.org/) and pure (aka vanilla JavaScript).
All map-related and geographical data-related features are provided by OpenLayers.

## Privacy
Please note that all geographical data only resides in your web browser (while TheKarte is executed) and _nothing_ is send to any servers.
The only exception is that, depending on your configuration, the tiles (the actual map) are downloaded from third-party servers.
In this case, the area you are working on is disclosed to the operator of these servers.
