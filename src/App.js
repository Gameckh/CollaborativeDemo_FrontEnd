import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { OnlineSheets } from './components/OnlineSheets';
import { Spreadsheet } from './components/Spreadsheet';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/OnlineSheets' component={ OnlineSheets } />
        <Route path='/Spreadsheet/:docName' component = {Spreadsheet}/>
      </Layout>
    );
  }
}
