import React, { Component } from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import './app.css';

import ShopList from '../shop-list';
import AppHeader from '../app-header';
import Login from '../pages/login-page';
import ProtectedRoute from '../general/protected-route';

axios.get('/api/shops/')
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
  })

export default class App extends Component {
  state = {
    user: {},
    token: '',
    shops: [
      { id: 1, name: 'Where', description: 'Where is the money, Lebowski', address: 'Liverpool, Penny Lane 32a' },
      { id: 2, name: 'is', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium temporibus possimus optio quaerat dignissimos molestiae ullam modi quos id officiis repellendus, vel ducimus sint minima cupiditate eaque? Corrupti, mollitia exercitationem!', address: 'Liverpool, Penny Lane 32a', isClosed: true },
      { id: 3, name: 'the' },
      { id: 4, name: 'money' },
      { id: 5, name: 'Lebowski' },
    ],
  };

  saveUser = (user) => {
    this.setState({ user });
    localStorage.setItem('user', JSON.stringify(user));
  };

  saveToken = (token) => {
    this.setState({ token });
    localStorage.setItem('token', token);
  };

  getStoredAuth = () => {
    this.setState({ user: JSON.parse(localStorage.getItem('user')) });
    this.setState({ token: localStorage.getItem('token') });
  };

  componentDidMount = () => {
    console.log('app rops:', this.props);
    console.log('user:', JSON.parse(localStorage.getItem('user')));
    console.log('token:', localStorage.getItem('token'));
    this.getStoredAuth();
  };

  resetAuth = () => {
    this.setState({ user: {} });
    this.setState({ token: '' });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  isAuthed = () => {
    return this.state.token ? true : false;
  };

  render() {
    return (
      <div className="foo-shops-app">
        <Router>
          <AppHeader
            isAuthed={this.isAuthed()}
            resetAuth={this.resetAuth}
          />
          {/* <Route
            path="/login"
            render={() => (
              <Login saveUser={this.saveUser} saveToken={this.saveToken} />
            )} /> */}
          <ProtectedRoute
            path="/login"
            component={Login}
            isAuthed={this.isAuthed()}
            saveUser={this.saveUser}
            saveToken={this.saveToken}
          />
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                <h1>Foo Shops Welcome page</h1>
                <ShopList shops={this.state.shops} />
              </React.Fragment>
            )}
          />
        </Router>
      </div>
    );
  };
}
