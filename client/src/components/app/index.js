import React, { Component } from 'react';
import {BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import './app.css';

import ShopList from '../shop-list';

axios.get('/api/products/')
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  })

export default class App extends Component {
  state = {
    shops: [
      { id: 1, name: 'Where' },
      { id: 2, name: 'is' },
      { id: 3, name: 'the' },
      { id: 4, name: 'money' },
      { id: 5, name: 'Lebowski' },
    ],
  };

  render() {
    return (
      <div className="foo-shops-app">
        <Router>
          <h1>Where is the shop, Lebowski</h1>
          <ShopList shops={this.state.shops} />
        </Router>
      </div>
    );
  };

}