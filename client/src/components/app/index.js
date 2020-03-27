import React, { Component } from 'react';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import './app.css';

import ShopList from '../shop-list';
import AppHeader from '../app-header';
import Login from '../pages/login-page';
import DetailPage from '../pages/detail-page';
import ProtectedRoute from '../general/protected-route';

export default class App extends Component {
  state = {
    user: {},
    token: '',
    shops: [],
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

  getShops = () => {
    axios.get('/api/shops/')
      .then((res) => {
        this.setState({ shops: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentWillMount = () => {
    this.getShops();
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

  handleDelete = (id) => {
    const index = this.state.shops.findIndex(el => el._id === id);
    
    axios.delete(`/api/shops/${id}`, {
      headers: {
        authorization: `Bearer ${this.state.token}`,
      },
    })
      .then(() => {
        const newArray = [...this.state.shops];
        newArray.splice(index, 1);
        this.setState({ shops: newArray });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="foo-shops-app">
        <Router>
          <AppHeader
            isAuthed={this.isAuthed()}
            resetAuth={this.resetAuth}
          />
          <ProtectedRoute
            path="/login"
            component={Login}
            isAuthed={this.isAuthed()}
            saveUser={this.saveUser}
            saveToken={this.saveToken}
          />
          <Route
            path="/shop/:id"
            render={({ match }) => {
              const shop = this.state.shops.find(el => el._id === match.params.id);
              return <DetailPage shop={shop} />;
            }}
          />
          <Route
            exact
            path="/"
            render={() => (
              <React.Fragment>
                <h1>Foo Shops Welcome page</h1>
                <ShopList
                  shops={this.state.shops}
                  handleDelete={this.handleDelete}
                />
              </React.Fragment>
            )}
          />
        </Router>
      </div>
    );
  };
}
