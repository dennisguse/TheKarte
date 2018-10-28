/**
Triggers a download directly from the browser.

@param {string} filename The filename to be used.
@param {Object|string} data The data to downloaded.
*/
function TheKarteHelperDownload(filename, data) {
    var textFileAsBlob = new Blob([data], {
        type: 'text/plain'
    });
    var downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.click();
}
