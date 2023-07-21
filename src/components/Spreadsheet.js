import * as React from 'react';
import 'isomorphic-fetch';
import { Utility } from '../utility';

import '@grapecity/spread-sheets-resources-zh';
import '@grapecity/spread-sheets-designer-resources-cn';
import * as GC from '@grapecity/spread-sheets';
import { Designer } from '@grapecity/spread-sheets-designer-react';
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css"
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css"
import { config } from '../config.js'

//ExcelIO
export class Spreadsheet extends React.Component {
    docName;
    spread;
    serverInstanceId;
    webSocket;
    designer;

    constructor() {
        super();

        this.docName = null;

        this.getDesigner = this.getDesigner.bind(this);
        this.onCommandExecute = this.onCommandExecute.bind(this);
        this.importExcel = this.importExcel.bind(this);
        // this.bindSJSEvents = this.bindSJSEvents.bind(this);
        this.openDocument = this.openDocument.bind(this);
        this.connectDocument = this.connectDocument.bind(this);
        this.onmessage = this.onmessage.bind(this);

    }

    render() {
        return (
            <Designer styleInfo={{ width: "100%", height: '90vh' }} designerInitialized={designer => { this.getDesigner(designer) }} ></Designer>
          );
    }

    getDesigner(designer) {
        this.designer = designer;
        this.spread = designer.getWorkbook();
        var cm = this.spread.commandManager();

        cm.addListener('myListener', this.onCommandExecute)
      }

      onCommandExecute(args){
        console.log(args.command);
        var command = args.command;
        var ServerCommand = null;

        switch(command.cmd){
            case Utility.ServerCommands.EditCell:
                ServerCommand = {
                    sheetName: command.sheetName,
                    row: command.row,
                    column: command.col,
                    newValue: command.newValue
                }
                break;
            case Utility.ServerCommands.ResizeRow:
                ServerCommand = {
                    sheetName: command.sheetName,
                    rows: command.rows,
                    size: command.size
                };
                break;
            case Utility.ServerCommands.ResizeColumn:
                ServerCommand = {
                    sheetName: command.sheetName,
                    columns: command.columns,
                    size: command.size
                };
                break;
            case 'Designer.' + Utility.ServerCommands.SetFontFamily:
            case 'Designer.' + Utility.ServerCommands.SetFontSize:
            case 'Designer.' + Utility.ServerCommands.SetBackColor:
            case 'Designer.' + Utility.ServerCommands.SetForeColor:
            case 'Designer.' + Utility.ServerCommands.SetFontWeight:
            case 'Designer.' + Utility.ServerCommands.SetFontStyle:
            case 'Designer.' + Utility.ServerCommands.SetUnderline:
            case 'Designer.' + Utility.ServerCommands.SetDoubleUnderline:
                if(command.value && command.value.indexOf('undefined') === -1){
                    ServerCommand = {
                        sheetName: command.sheetName,
                        selections: command.selections,
                        value: command.value
                    }
                }
                break;
            case Utility.ServerCommands.MoveFloatingObjects:
                ServerCommand = {
                    sheetName: command.sheetName,
                    floatingObjects: command.floatingObjects,
                    offsetX: command.offsetX,
                    offsetY: command.offsetY
                };
                break;
            case Utility.ServerCommands.ResizeFloatingObjects:
                ServerCommand = {
                    sheetName: command.sheetName,
                    floatingObjects: command.floatingObjects,
                    offsetX: command.offsetX,
                    offsetY: command.offsetY,
                    offsetWidth: command.offsetWidth,
                    offsetHeight: command.offsetHeight
                };
                break;  
            case Utility.ServerCommands.InsertColumns:
            case Utility.ServerCommands.InsertRows:
                ServerCommand = {
                    sheetName: command.sheetName,
                    selections: command.selections
                };
                break;
            default:
        }
        
        if(ServerCommand != null){

            var cmd = command.cmd;
            var dotIndex = cmd.lastIndexOf('.');
            if(dotIndex !== -1){
                cmd = cmd.substring(dotIndex + 1);
            }
            ServerCommand.cmd = cmd;
            ServerCommand.docID = this.docName;
            
            Utility.ExecuteCommandAtServer(ServerCommand);

            command.docID = ServerCommand.docID;
            this.webSocket.send(JSON.stringify(command))
        }
      }


    componentDidMount() {

        this.docName = this.props.match.params.docName;

        this.openDocument(this.docName);

        this.connectDocument(this.docName);
    }

    /**
     * Upload an excel file at client side, open the file at server side then transport the ssjson to client
     * @param e
     */
    openDocument(docName) {
        Utility.openDocument(docName).then(() => {
            Utility.ToJson(docName).then(json => {
                this.spread.fromJSON(json);
                // this.bindSJSEvents();
            });
        });
    }

    connectDocument(docName) {
        if(this.webSocket != null){
            return;
        }

        var self = this;
        var ws = new WebSocket(Utility.webSocketUrl);
        ws.onopen = function () {
            var data = {
                cmd: "connect",
                docID: docName
            }
            ws.send(JSON.stringify(data));
        }
    

        ws.onmessage = this.onmessage;

        this.webSocket= ws;
    }

    onmessage(message){
        var command = JSON.parse(message.data);
        command._styles = null;
            
        var cm = this.spread.commandManager();
        cm.removeListener('myListener');

        this.spread.commandManager().execute(command);

        cm.addListener('myListener', this.onCommandExecute);
    }
    
    // disconnectDocument() {
    //     if (this.ws != null) {
    //         this.ws.close();
    //     }
    // }

    // bindSJSEvents(){
    //     var self = this;
    //     this.spread.sheets.forEach(sheet => {
    //         sheet.bind(GC.Spread.Sheets.Events.ValueChanged, function (e, info) {
    //             var setValueAction = {
    //                 name: Utility.Actions.SetValue,
    //                 docID: self.docName,
    //                 sheetName: info.sheetName,
    //                 row: info.row,
    //                 column: info.col,
    //                 value: info.newValue
    //             };
    //             Utility.ExecuteActionAtServer(setValueAction);
    //             self.webSocket.send(JSON.stringify(setValueAction))
    //         });

    //         sheet.bind(GC.Spread.Sheets.Events.SlicerChanged, function (e, info) {
                
    //         });
    //     });
    // }

    
    /**
     * Upload an excel file at client side, open the file at server side then transport the ssjson to client
     * @param e
     */
    importExcel(e) {
        var selectedFile = e.target.files[0];
        if (!selectedFile) {
            this.selectedFileName = null;
            return;
        }

        this.selectedFileName = selectedFile.name;
    
        Utility.OpenExcel(selectedFile).then(id => {
            this.serverInstanceId = id;
            Utility.ToJson(id).then(json => {
                this.spread.fromJSON(json);
                this.bindSJSEvents();
            });
        });
    }

}


