import { Route, HashRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import ScrollToTopRoute from "./ScrollToTopRoute";
import Footer from "./components/Footer";
import Header from "./components/Header";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import PetDetailsPage from "./pages/PetDetailsPage";
import PetsPages from "./pages/PetsPages";
import { findIndex } from "lodash";

import Login from "./pages/Login";
import "./App.css";

import Register from "./pages/Register";
// import AddNewAdoption from "./pages/AddNewAdoption";
import AddNewAdoption from "./pages/PetFormPage";
import React from "react";
import { IAnimal } from "./common/interface/animal.interface";
import AuthService from "./common/Auth.service";
import PetRequests from "./pages/PetRequests";
interface Props {}

const InitialState = {
  favItems: [],
  loginState: false,
};
type State = typeof InitialState;

class App extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const isLoggedIn = AuthService.isLoggedIn();
    const local_fav = localStorage.getItem("fav");
    if (local_fav) {
      this.state = { favItems: JSON.parse(local_fav), loginState: isLoggedIn };
    } else {
      this.state = { favItems: [], loginState: isLoggedIn };
    }

    this.OnAddToFav = this.OnAddToFav.bind(this);
    this.OnRemoveFav = this.OnRemoveFav.bind(this);
  }

  OnRemoveFav(animal_id) {
    const index = findIndex(this.state.favItems, (row) => {
      return row.id == animal_id;
    });
    const new_sate = this.state.favItems.filter((row) => {
      return row.id != animal_id;
    });
    console.log(new_sate);
    this.setState({ favItems: new_sate });
    localStorage.setItem("fav", JSON.stringify(new_sate));
  }

  OnAddToFav(animal: IAnimal) {
    const state = this.state.favItems;
    state.push(animal);
    this.setState({ favItems: state });
    localStorage.setItem("fav", JSON.stringify(state));
  }

  Afterlogout = () => {
    console.warn("after logout");
    this.setState({ loginState: false });
  };

  AfterLogin = () => {
    console.warn("after login");
    this.setState({ loginState: true });
  };

  render() {
    return (
      <div className="app">
        <Router>
          <Header
            favItems={this.state.favItems}
            onRemoveFav={this.OnRemoveFav}
            Afterlogout={this.Afterlogout}
            loginState={this.state.loginState}
          />
          <Switch>
            <ScrollToTopRoute exact={true} path="/">
              <HomePage />
            </ScrollToTopRoute>

            <ScrollToTopRoute exact={true} path="/pet/add">
              <AddNewAdoption />
            </ScrollToTopRoute>
            <ScrollToTopRoute exact={true} path="/pet/:id">
              <AddNewAdoption />
            </ScrollToTopRoute>
            <ScrollToTopRoute exact={true} path="/contacts">
              <ContactPage />
            </ScrollToTopRoute>
            <ScrollToTopRoute exact={true} path="/blogs">
              <BlogPage />
            </ScrollToTopRoute>
            <ScrollToTopRoute exact={true} path="/blog-details">
              <BlogDetailsPage />
            </ScrollToTopRoute>
            <ScrollToTopRoute exact={true} path="/manage">
              <PetsPages />
            </ScrollToTopRoute>

            <ScrollToTopRoute exact={true} path="/view-all">
              <PetsPages />
            </ScrollToTopRoute>
            <ScrollToTopRoute exact={true} path="/manage/:keyword">
              <PetsPages />
            </ScrollToTopRoute>
            <ScrollToTopRoute exact={true} path="/pet-details/:id">
              <PetDetailsPage
                favItems={this.state.favItems}
                OnAddToFav={this.OnAddToFav}
              />
            </ScrollToTopRoute>

            <ScrollToTopRoute exact={true} path="/request">
              <PetRequests />
            </ScrollToTopRoute>

            <Route
              path="/login"
              render={(props) => (
                <Login
                  AfterLogin={this.AfterLogin}
                  loginState={this.state.loginState}
                  {...props}
                />
              )}
            />

            <Route
              path="/register"
              render={(props) => (
                <Register
                  AfterLogin={this.AfterLogin}
                  loginState={this.state.loginState}
                  {...props}
                />
              )}
            />
          </Switch>
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
