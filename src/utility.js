import 'isomorphic-fetch';

export class Utility {

static serverUrl = 'http://localhost:8090/api/gcexcel/';
static webSocketUrl = 'ws://localhost:8090/spreadjs';

static ServerCommands = {
    EditCell : 'editCell',
    ResizeRow: 'resizeRow',
    ResizeColumn: 'resizeColumn',
    SetFontFamily: 'setFontFamily',
    SetFontSize: 'setFontSize',
    SetBackColor: 'setBackColor',
    SetForeColor: 'setForeColor',
    MoveFloatingObjects: 'moveFloatingObjects',
    ResizeFloatingObjects:'resizeFloatingObjects',
    InsertColumns: 'gc.spread.contextMenu.insertColumns',
    InsertRows: 'gc.spread.contextMenu.insertRows',
    SetFontWeight:'setFontWeight',
    SetFontStyle:'setFontStyle',
    SetUnderline:'setUnderline',
    SetDoubleUnderline:'setDoubleUnderline'
}

static getDocList() {
    var requestUrl = Utility.serverUrl + 'docs';
    return fetch(requestUrl, {
        method: 'GET',
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        }
    });
}

static openDocument(name) {
    var requestUrl = Utility.serverUrl + 'xlsx/' + name;
    return fetch(requestUrl, {
        method: 'POST',
    }).then(function (response) {
        if (response.ok) {
            return response.text();
        }
    });
}

static OpenExcel(xlsxStream) {
    var requestUrl = Utility.serverUrl + 'xlsx';
    return fetch(requestUrl, {
        headers:{
            'Access-Control-Allow-Origin': '*'
        },
        method: 'POST',
        body: xlsxStream
    }).then(function (response) {
        if (response.ok) {
            return response.text();
        }
    });
}

static ToJson(id) {
    var requestUrl = Utility.serverUrl + id + '/json';
    return fetch(requestUrl, {
        method: 'GET',
    }).then(response => response.json())
        .then(data => {
            return data;
        });
}

static ViewExcel(id) {
    var requestUrl = Utility.serverUrl + id + '/xlsx';
    window.open(requestUrl, "_blank");
}

static ViewPdf(id) {
    var requestUrl = Utility.serverUrl + id + '/pdf';
    window.open(requestUrl, "_blank");
}

static ViewJson(id) {
    var requestUrl = Utility.serverUrl + id + '/json';
    window.open(requestUrl, "_blank");
}

static ViewImage(id) {
    var requestUrl = Utility.serverUrl + id + '/image';
    window.open(requestUrl, "_blank");
}

static DownloadXlsx(id) {
    var requestUrl = Utility.serverUrl + id + '/xlsx';
    // window.location.href = requestUrl;
    fetch(requestUrl, {
        method: 'Get'
    }).then(function (response) {
        var blob = response.blob();
        return blob;
    }).then(blob => {
        Utility.DownloadFile(blob, id, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
}

static DownloadPdf(name){
    var requestUrl = Utility.serverUrl + name + '/pdf';
    // window.location.href = requestUrl;
    fetch(requestUrl, {
        method: 'Get'
    }).then(function (response) {
        var blob = response.blob();
        return blob;
    }).then(blob => {
        Utility.DownloadFile(blob, name, 'application/pdf');
    });
}


 static CovertJsonToXlsx(ssjon, fileName) {
        var requestUrl = Utility.serverUrl + 'jsonToXlsx';
        fetch(requestUrl, {
            method: 'POST',
            body: ssjon
        }).then(function (response) {
            var blob = response.blob();
            return blob;
        }).then(blob => {
            if (!fileName) {
                fileName = 'GcExcel-exported.xlsx';
            }
            Utility.DownloadFile(blob, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        });
    }

 static DownloadFile(data, filename, mime) {
        var blob = new Blob([data], { type: mime || 'application/octet-stream' });
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            // IE workaround for "HTML7007: One or more blob URLs were 
            // revoked by closing the blob for which they were created. 
            // These URLs will no longer resolve as the data backing 
            // the URL has been freed."
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            var blobURL = window.URL.createObjectURL(blob);
            var tempLink = document.createElement('a');
            tempLink.href = blobURL;
            tempLink.setAttribute('download', filename);
            tempLink.setAttribute('target', '_blank');
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        }
    }

    static ExecuteCommandAtServer(command){
        var requestUrl = Utility.serverUrl + command.cmd;

        return fetch(requestUrl, {
            headers: {
                'Accept': "application/json, text/plain, */*",
                'Content-Type': "application/json;charset=utf-8"
            },
            method: 'POST',
            body: JSON.stringify(command)
        });
    }
}