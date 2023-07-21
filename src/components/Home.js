import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Container } from 'reactstrap';

export class Home extends Component {
  static displayName = Home.name;

 render() {
    return <div>
        <Container>
            <p>Welcome to GcExcel Server demo.  This sample shows how to progam with GcExcel in Spring Boot at server-side, and use React + SpreadJS at client-side.</p>
            <ul>
                <li><a href='https://www.grapecity.com/en/documents-api-Excel'>GcExcel</a> is an Excel Spreadsheet Programming API to speed up the spreadsheet management and processing tasks. API supports to build cross-platform applications having the ability to generate, modify, convert, render and print spreadsheets. Moreover, It does not rely on Microsoft Excel or any Microsoft Office Interop components to be installed.</li>
                <li><a href='https://www.grapecity.com/en/spreadsheets'>SpreadJS</a> is the spreadsheet component of the SpreadJS product family. This enterprise-grade JavaScript spreadsheet displays and manages data much like Microsoft Excel. Popular features include a formula engine, sorting, filtering, input controls, sparklines, and native Excel input/output.</li>
            </ul>
            <p>You will explore some typical seneros about how to use GcExcel together with SpreadJS:</p>
            <ul>            
                <li>In <Link to={'/OnlineSheets'}>Online Sheets Demo</Link>, you will learn how to upload an Excel file from client and open the file using GcExcel at server side, then view the result through SpreadJS at client side.</li>
                <li>In <Link to={'/ExcelTemplateDemo'}>Excel Template Demo</Link>, you will learn how to open an Excel template at server side with GcExcel, then view or fill content for the template through SpreadJS at client side.</li>
                <li>In <Link to={'/ProgrammingDemo'}>Programming API Demo</Link>, You will learn how to program with GcExcel all yourself at server side, then view the result through SpreadJS at client side.</li>
            </ul>
            <p>You can find more resources about <strong>GcExcel</strong> at:</p>
            <ul>
                <li><a href='http://demos.componentone.com/gcdocs/gcExcel/'>Online Demo Site</a></li>
                <li><a href='https://www.grapecity.com/en/documents-api-Excel'>Product Home Site</a></li>
                <li><a href='https://nuget.org/packages/GrapeCity.Documents.Excel'>GcExcel Nuget Package Site</a></li>
                <li><a href='https://www.grapecity.com/en/spreadsheets'>SpreadJS Home Site</a></li>
            </ul>
        </Container>
    </div>;
}
}
