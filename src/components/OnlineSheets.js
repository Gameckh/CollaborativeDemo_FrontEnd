import * as React from 'react';
import 'isomorphic-fetch';
import { Utility } from '../utility';
import GC from '@grapecity/spread-sheets';

import { Container } from 'reactstrap';

import {
    Link
  } from 'react-router-dom';

import '@grapecity/spread-sheets-charts';
import '@grapecity/spread-sheets-shapes';

//ExcelIO
export class OnlineSheets extends React.Component {
    selectedFileName;
    spread;
    serverInstanceId;

    constructor() {
        super();

        this.renderDescription = this.renderDescription.bind(this);
        this.renderDocList = this.renderDocList.bind(this);
        this.viewExcel = this.viewExcel.bind(this);
        this.viewPdf = this.viewPdf.bind(this);
        this.viewJson = this.viewJson.bind(this);
        this.viewImage = this.viewImage.bind(this);

        this.state = { docList: []};
    }

    

    render() {
        let docList =  this.renderDocList(this.state.docList);

        return <div className='spread-page'>
            {docList}
        </div>;
    }

    renderDescription() {
        
        return (
            <div>
              <Container>
                  <h1>Excel Input & Output Demo</h1>
                  <p>This example demonstrates how to use <strong>GcExcel</strong> as server-side spreadsheet model, and use <strong>SpreadJS</strong> the front-end viewer and editor.</p>
                  <ul>
                      <li><strong>GcExcel</strong> can import an excel file and export to ssjson format, then transport the ssjson to client-side.</li>
                      <li><strong>SpreadJS</strong> client-side can receive and load the ssjson from server-side.</li>
                      <li>You can view the content of the excel file through <strong>SpreadJS</strong>.</li>
                      <li>You can also make changes to the content, and send the whole document as ssjson to <strong>GcExcel</strong> server-side.</li>
                      <li><strong>GcExcel</strong> server-side loads the ssjson and saves to a new excel file, then you can download the modified excel file.</li>
                  </ul>
                  <br/>
                </Container>
            </div>
          );  
    }


    renderDocList(docList) {
        var self = this;
        return (
          <table className='table' aria-labelledby="tabelLabel">
            <thead>
              <tr>
                <th>Document</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                  docList.map(
                      function(docItem){
                        var lastDot = docItem.lastIndexOf('.');
                        var fileName = docItem.substring(0, lastDot);
                        return <tr key={docItem}>
                        <td>{docItem}</td>
                        <td className='row'> 
                            <Link to={'Spreadsheet/' + fileName} className="col-sm-1">Open</Link>
                            <Link to='#' className="col-sm-2" onClick={()=> self.viewExcel(fileName)}>Download</Link>
                            <Link to='#' className="col-sm-1.5" onClick={()=> self.viewJson(fileName)}>ViewJson</Link>
                            <Link to='#' className="col-sm-1" onClick={()=> self.viewPdf(fileName)}>ViewPdf</Link>
                            <Link to='#' className="col-sm-1" onClick={()=> self.viewImage(fileName)}>ViewImage</Link>
                        </td>
                    </tr>})
            }
            </tbody>
          </table>
        );
      }

    componentDidMount() {
        Utility.getDocList().then(value => {
            this.setState({ docList: value});
        });
    }  
    
    
    /**
     * Tranport ssjson from SpreadJS and save and download the excel file.
     * @param e
     */
   viewExcel(name) {
        Utility.ViewExcel(name);
    }

    viewPdf(name){
        Utility.ViewPdf(name);
    }

    viewJson(name){
        Utility.ViewJson(name);
    }

    viewImage(name){
        Utility.ViewImage(name);
    }
}


