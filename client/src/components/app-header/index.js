import React from 'react';
import { Link } from 'react-router-dom';

import './app-header.css';

const AppHeader = ({ isAuthed, resetAuth }) => {
  const handleLogout = () => {
    resetAuth();
  };

  let loginLogoutEl = null;
  if (isAuthed) loginLogoutEl = <Link className="nav-link" onClick={handleLogout} to="/">Logout</Link>
  else loginLogoutEl = <Link className="nav-link" to="/login">Login</Link>

  const createNewEl = <Link className="nav-link" to="/new">Create new shop</Link>;

  return (
    <div className="app-header">
      <p><Link className="app-header__logo" to="/">Foo Shops</Link></p>
      <p className="app-header__nav">
        <Link className="nav-link" to="/">Home</Link>
        { isAuthed ? createNewEl : null }
        { loginLogoutEl }
      </p>
    </div>
  );
};

export default AppHeader;