import Login from "./Login/Login";
import Register from "./Register/Register";
import Dashboard from "./Dashboard/Dashboard";
import Project from "./Project/Project";
import SearchResultsPage from "./SearchResults/SearchResultsPage";
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import Profile from "./Profile/Profile";
import UpdateProfile from "./Profile/UpdateProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Landing from "./LandingPage/Landing";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  let [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const result = await fetch("/auth/isLoggedIn", { method: "GET" });
      const parsedResult = await result.json();
      setLoggedIn(parsedResult.isLoggedIn);
    }
    fetchData();
  });

  const logoutPressed = () => {
    setLoggedIn(false);
  };

  const loginPressed = () => {
    setLoggedIn(true);
  };

  return (
    <Router>
      <div aria-live="polite" aria-label="toast message">
        <ToastContainer role="alert" ariaLabel="toast" />
      </div>
      <Switch>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/dashboard">
          {loggedIn ? (
            <Dashboard logoutPressed={logoutPressed} />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>
        <Route exact path="/profile">
          <Profile logoutPressed={logoutPressed} />
        </Route>
        <Route exact path="/profile/update">
          <UpdateProfile logoutPressed={logoutPressed} />
        </Route>
        <Route exact path="/projects/:projectId">
          <Project logoutPressed={logoutPressed} />
        </Route>
        <Route exact path="/search/:query">
          <SearchResultsPage logoutPressed={logoutPressed} />
        </Route>
        <Route exact path="/login">
          {!loggedIn ? (
            <Login loginPressed={loginPressed} loggedIn={loggedIn} />
          ) : (
            <Redirect to="/dashboard" />
          )}
        </Route>
        <Route exact path="/">
          {loggedIn ? <Redirect to="/dashboard" /> : <Landing />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
