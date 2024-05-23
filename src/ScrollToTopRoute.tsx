import React from "react";
import { Redirect, Route, withRouter } from "react-router-dom";
import "./App.css";
import AuthService from "./common/Auth.service";

class ScrollToTopRoute extends React.Component<any, any> {
  componentDidUpdate(prevProps: any) {
    // if (this.props.path === this.props.location.pathname && this.props.location.pathname !== prevProps.location.pathname) {
    window.scrollTo(0, 0);
    // }
  }

  render() {
    var isAuthenticated = AuthService.isLoggedIn();
    if (!isAuthenticated) {
      return (
        <Redirect
          to={{ pathname: "/login", state: { from: this.props.location } }}
        />
      );
    }
    const { ...rest } = this.props;
    return <Route {...rest} />;
  }
}

export default withRouter(ScrollToTopRoute);
