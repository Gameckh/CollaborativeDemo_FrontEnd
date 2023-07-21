# Collaborative spreadsheets demo app

## Background Info

Collaborative editing of spreadsheets is one of the more advanced application scenarios in spreadsheet technology, and it has attracted numerous inquiries during the pandemic. The purpose of developing this demo is to provide a straightforward illustration of the implementation strategy for collaborative spreadsheets.

The demo merely exemplifies the capture of collaborative actions, command synchronization, and finely-grained data interaction. Genuine collaborative applications are significantly more intricate, necessitating solutions for complex issues such as permission control, data conflicts, and version management. Concurrently, it is also essential to address the bottleneck issue of concurrent performance (as collaborative applications are typically high-consistency applications, optimizing concurrent performance becomes a captivating topic of discussion).

This tutorial will utilize a straightforward framework to elucidate the roles of SpreadJS and GCExcel in the entire collaborative editing scenario. The front-end relies on React, the back-end is based on SpringBoot, and data interaction is facilitated via WebSocket.

This project pertains to the front-end segment. For the back-end segment, please refer to:
[CollaborativeDemo_BackEnd](https://github.com/Gameckh/CollaborativeDemo_BackEnd)

## Environment Setup

1. **Creating Front-End Project**

    Introducing SpreadJS dependencies: Beginning with @grapecity/spread.

    [package.json](https://github.com/Gameckh/CollaborativeDemo_FrontEnd/blob/master/package.json)
    ```json
    "devDependencies": {
      "ajv": "^6.9.1",
      "cross-env": "^5.2.0",
      "typescript": "^3.7.5",
      "eslint": "^6.8.0",
      "eslint-config-react-app": "^5.2.0",
      "eslint-plugin-flowtype": "^4.6.0",
      "eslint-plugin-import": "^2.20.1",
      "eslint-plugin-jsx-a11y": "^6.2.3",
      "eslint-plugin-react": "^7.18.3",
      "@grapecity/spread-excelio": "14.0.0",
      "@grapecity/spread-sheets": "14.0.0",
      "@grapecity/spread-sheets-barcode": "14.0.0",
      "@grapecity/spread-sheets-charts": "14.0.0",
      "@grapecity/spread-sheets-languagepackages": "14.0.0",
      "@grapecity/spread-sheets-pdf": "14.0.0",
      "@grapecity/spread-sheets-print": "14.0.0",
      "@grapecity/spread-sheets-react": "14.0.0",
      "@grapecity/spread-sheets-resources-zh": "14.0.0",
      "@grapecity/spread-sheets-shapes": "14.0.0",
      "@grapecity/spread-sheets-pivots": "14.0.0",
      "@grapecity/spread-sheets-designer": "14.0.0",
      "@grapecity/spread-sheets-designer-react": "14.0.0",
      "@grapecity/spread-sheets-designer-resources-cn": "14.0.0"
    }
    ```
    
    Integrating the 'Online Spreadsheet Editor' Component Version

    [Spreadsheet.js](https://github.com/Gameckh/CollaborativeDemo_FrontEnd/blob/master/src/components/Spreadsheet.js)
    ```javascript
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
    ```
    With this, the front-end preparation is duly completed.

2. **Back-End Environment Setup**

    For the back-end preparations, the initial step involves installing Gradle as the package manager. Of course, other tools can be used as substitutes here, such as Maven, or the native method of introducing required jar packages.

    Subsequently, create a SpringBoot project in conjunction with setting up Gradle to reference GCExcel and the WebSocket required for later collaboration.
    
    [build.gradle](https://github.com/Gameckh/CollaborativeDemo_BackEnd/blob/master/build.gradle)
    ```gradle
    dependencies {
        compile("org.springframework.boot:spring-boot-starter-web")
        compile("org.apache.tomcat.embed:tomcat-embed-jasper")
        compile("javax.servlet:jstl")
        compile group: 'com.google.code.gson', name: 'gson', version: '2.8.5'
        compile fileTree(dir: 'libs', include: ['*.jar'])
        providedRuntime 'org.springframework.boot:spring-boot-starter-tomcat'

        testCompile('org.springframework.boot:spring-boot-starter-test')
        testCompile('com.jayway.jsonpath:json-path')

        compile("com.grapecity.documents:gcexcel:3.2.2")
        compile('org.springframework.boot:spring-boot-starter-websocket')
    }
    ```

## Core Code

1. **Front-End**

    Given that collaboration is the objective, the first step would be setting up a WebSocket.

    In React, using WebSocket doesn't necessitate the inclusion of other libraries, it merely requires the creation of a common component to encapsulate WebSocket:

    [Spreadsheet.js](https://github.com/Gameckh/CollaborativeDemo_FrontEnd/blob/master/src/components/Spreadsheet.js)
    ```javascript
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
    ```

    Next, we need to monitor the actions initiated by the front-end. Here, since the online spreadsheet editor has encapsulated all possible user actions, a great deal of effort is saved.

    [Spreadsheet.js](https://github.com/Gameckh/CollaborativeDemo_FrontEnd/blob/master/src/components/Spreadsheet.js)
    ```javascript
    getDesigner(designer) {
      this.designer = designer;
      this.spread = designer.getWorkbook();
      var cm = this.spread.commandManager();

      cm.addListener('myListener', this.onCommandExecute)
    }
    ```

    Determine based on the command and further encapsulate it in a simple manner.

    [Spreadsheet.js](https://github.com/Gameckh/CollaborativeDemo_FrontEnd/blob/master/src/components/Spreadsheet.js)
    ```javascript
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
    ```

    When the collaborative end receives a request through WebSocket, it synchronizes the command using the onmessage method.

    Before executing the command at the collaborative end, it is necessary to first revoke the previous listening to avoid re-sending WebSocket, which could lead to an infinite loop. After execution, the listening is added once again.

    [Spreadsheet.js](https://github.com/Gameckh/CollaborativeDemo_FrontEnd/blob/master/src/components/Spreadsheet.js)
    ```javascript
    onmessage(message){
      var command = JSON.parse(message.data);
      command._styles = null;
          
      var cm = this.spread.commandManager();
      cm.removeListener('myListener');

      this.spread.commandManager().execute(command);

      cm.addListener('myListener', this.onCommandExecute);
    }
    ```

2. **Back-End**

    Firstly, set up the corresponding WebSocket service on the back-end:

    [SpreadJSSocketHandler.java](https://github.com/Gameckh/CollaborativeDemo_BackEnd/blob/master/src/main/java/GcExcelServer/SpreadJSSocketHandler.java)
    ```Java
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message)
        throws InterruptedException, IOException {
        Map value = new Gson().fromJson(message.getPayload(), Map.class);
        String cmd = (String) value.get("cmd");
        if(cmd == null){
            return;
        }
        String docID = (String) value.get("docID");
        if ("connect".equals(cmd.toLowerCase())) {
            List<WebSocketSession> sessions = null;
            if (docSessions.containsKey(docID)) {
                sessions = docSessions.get(docID);
            } else {
                sessions = Collections.synchronizedList(new ArrayList<WebSocketSession>());
                docSessions.put(docID, sessions);
            }
            sessions.add(session);
        } else {
            List<WebSocketSession> sessions = docSessions.get(docID);
            for (WebSocketSession webSocketSession : sessions) {
                if(webSocketSession.getId() != session.getId() &&
                    webSocketSession.isOpen()) {
                    webSocketSession.sendMessage(message);
                }
            }
        }
    }
    ```

    Set the expiration time for WebSocket. Cease sending WebSocket requests to the endpoint 5 minutes after the session is closed:

    [SpreadJSSocketHandler.java](https://github.com/Gameckh/CollaborativeDemo_BackEnd/blob/master/src/main/java/GcExcelServer/SpreadJSSocketHandler.java)
    ```Java
    public SpreadJSSocketHandler(){
        // clean up the closed session every 5 minutes
        Timer timer = new Timer("cleanClosedSession");
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                Collection<List<WebSocketSession>> sessionsList = docSessions.values();
                for(List<WebSocketSession> sessions: sessionsList) {
                    ArrayList<WebSocketSession> closedSessions = new ArrayList<WebSocketSession>();
                    for(WebSocketSession session: sessions){
                        if(!session.isOpen()){
                            closedSessions.add(session);
                        }
                    }
                    sessions.removeAll(closedSessions);
                }
            }
        }, 5*60*1000,5*60*1000);
    }
    ```

    Front-end sending requests to the back-end:
    
    [Spreadsheet.js](https://github.com/Gameckh/CollaborativeDemo_FrontEnd/blob/master/src/components/Spreadsheet.js)
    ```javascript
    if(ServerCommand != null){

        var cmd = command.cmd;
        var dotIndex = cmd.lastIndexOf('.');
        if(dotIndex !== -1){
            cmd = cmd.substring(dotIndex + 1);
        }
        ServerCommand.cmd = cmd;
        ServerCommand.docID = this.docName;
        
        // Front-end sending requests to the back-end.
        Utility.ExecuteCommandAtServer(ServerCommand);

        command.docID = ServerCommand.docID;
        this.webSocket.send(JSON.stringify(command))
    }
    ```

    After receiving a request from the back-end, revise the corresponding implementation based on the request. In the demo, encapsulation was applied to improve the structure's rationale and facilitate rewriting.

    [SetFontWeightCommand.java](https://github.com/Gameckh/CollaborativeDemo_BackEnd/blob/master/src/main/java/GcExcelServer/ServerCommands/SetFontWeightCommand.java)
    ```java
    package GcExcelServer.ServerCommands;

    import com.grapecity.documents.excel.IWorksheet;
    import com.grapecity.documents.excel.Workbook;

    public class SetFontWeightCommand extends SelectionCommandBase{
      private Object value;
        public Object getValue(){
            return this.value;
        }
        public void setValue(Object value){
            this.value = value;
        }
        @Override
        public void execute(Workbook workbook) {
            IWorksheet worksheet = this.getWorksheet(workbook);
            if(worksheet == null){
                return;
            }
            for(SJSRange range: this.getSelections()){
              if("normal".equals(value)) {
                worksheet.getRange(range.getRow(),range.getCol(),range.getRowCount(), range.getColCount()).getFont().setBold(false);
              }
              if("bold".equals(value)) {
                worksheet.getRange(range.getRow(),range.getCol(),range.getRowCount(), range.getColCount()).getFont().setBold(true);
              }
                
            }
        }
    }
    ```

    Subsequently, load the same document in the GCExcel at the back-end and execute the aforementioned operations:

    [GcExcelController.java](https://github.com/Gameckh/CollaborativeDemo_BackEnd/blob/master/src/main/java/GcExcelServer/Controllers/GcExcelController.java)
    ```java
    @RequestMapping(value = "/setFontSize", method = RequestMethod.POST)
    public void setFontSize(HttpServletRequest request,
                              @RequestBody SetFontSizeCommand setFontSizeCommand,
                              HttpServletResponse response) {

        this.executeCommand(setFontSizeCommand, response);
    }

    @RequestMapping(value = "/setBackColor", method = RequestMethod.POST)
    public void setBackColor(HttpServletRequest request,
                            @RequestBody SetBackColorCommand setBackColorCommand,
                            HttpServletResponse response) {

        this.executeCommand(setBackColorCommand, response);
    }

    @RequestMapping(value = "/setForeColor", method = RequestMethod.POST)
    public void setForeColor(HttpServletRequest request,
                            @RequestBody SetForeColorCommand setForeColorCommand,
                            HttpServletResponse response) {

        this.executeCommand(setForeColorCommand, response);
    }

    @RequestMapping(value = "/moveFloatingObjects", method = RequestMethod.POST)
    public void moveFloatingObjects(HttpServletRequest request,
                              @RequestBody MoveFloatingObjectsCommand movingFloatingObjectsCommand,
                              HttpServletResponse response) {

        this.executeCommand(movingFloatingObjectsCommand, response);
    }

    @RequestMapping(value = "/resizeFloatingObjects", method = RequestMethod.POST)
    public void resizeFloatingObjects(HttpServletRequest request,
                                      @RequestBody ResizeFloatingObjectsCommand resizingFloatingObjectsCommand,
                                      HttpServletResponse response) {

        this.executeCommand(resizingFloatingObjectsCommand, response);
    }

    @RequestMapping(value = "/insertColumns", method = RequestMethod.POST)
    public void insertColumns(HttpServletRequest request,
                                      @RequestBody InsertColumnsCommand insertColumnsCommand,
                                      HttpServletResponse response) {

        this.executeCommand(insertColumnsCommand, response);
    }
    ```

    The purpose of this activity is to preserve previous results after refreshing, and in the event that the collaborative end opens the document later, it allows for missed operations to be made up for.

## Conclusion

Collaborative documents form a vastly complex domain, offering numerous topics for discussion. The content above shared this time is based on demonstration purposes, hoping to convey a fundamental implementation approach. Subsequent related topics, such as permission control, version control, command scheduling, conflict resolution, etc., will be addressed in forthcoming articles. Please stay tuned.
