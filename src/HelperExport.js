/**
Triggers a download directly from the browser.

@param {string} filename The filename to be used.
@param {blob} blob The data to downloaded.
*/
function TheKarteHelper_ExportBlob(filename, blob) {
    let downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = window.URL.createObjectURL(blob);

    downloadLink.dispatchEvent(new MouseEvent(`click`, {
        bubbles: true,
        cancelable: true,
        view: window
    }));
}

/**
Triggers a download directly from the browser.

@param {string} filename The filename to be used.
@param {Object|string} data The data to downloaded (treated as text/plain).
*/
function TheKarteHelper_ExportString(filename, data) {
    let stringAsBlob = new Blob([data], {
        type: 'text/plain'
    });
    TheKarteHelper_ExportBlob(filename, stringAsBlob);
}
