import React, { Component } from 'react';
import axios from 'axios';

import './login-page.css';

export default class LoginPage extends Component {
  state = {
    name: '',
    email: 'test@test.test',
    password: '123456',
  };

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const credentials = {
      email: this.state.email,
      password: this.state.password,
    }

    axios.post('/api/auth/', credentials)
      .then((res) => {
        this.props.saveToken(res.data.token);
        this.props.saveUser(res.data.user);
        this.props.history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="login-page">
        <h1 className="text-center">Log in</h1>
        <form name="auth-form" onSubmit={this.handleSubmit}>
          <label className="form-group w-100">
            Email
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="youremail@example.com"
              required
              value={this.state.email}
              onChange={this.handleChange} />
          </label>
          <label className="form-group w-100">
            Password
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="password"
              minLength="6"
              required
              value={this.state.password}
              onChange={this.handleChange} />
          </label>
          <button className="btn btn-primary" type="submit">Log in</button>
        </form>
      </div>
    )
  };
}
