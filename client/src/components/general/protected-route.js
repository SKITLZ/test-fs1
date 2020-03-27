import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!rest.isAuthed) return <Component {...rest} history={props.history} />;
        return <Redirect to={{ pathname: "/", }} />
      }}
    />
  );
};

export default ProtectedRoute;