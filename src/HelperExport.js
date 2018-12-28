/**
Triggers a download directly from the browser.

@param {string} filename The filename to be used.
@param {Object|string} data The data to downloaded.
*/
function TheKarteHelper_Export(filename, data) {
    let textFileAsBlob = new Blob([data], {
        type: 'text/plain'
    });
    let downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.click();
}
