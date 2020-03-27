import React, { Component } from 'react';
import {BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';

import './app.css';

import ShopList from '../shop-list';

axios.get('/api/shops/')
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  })

export default class App extends Component {
  state = {
    shops: [
      { id: 1, name: 'Where', description: 'Where is the money, Lebowski', address: 'Liverpool, Penny Lane 32a' },
      { id: 2, name: 'is', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium temporibus possimus optio quaerat dignissimos molestiae ullam modi quos id officiis repellendus, vel ducimus sint minima cupiditate eaque? Corrupti, mollitia exercitationem!', address: 'Liverpool, Penny Lane 32a', isClosed: true },
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
