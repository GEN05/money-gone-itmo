import React, { createContext } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Store from "./store/store";
import "normalize.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import StartPage from "./components/StartPage/StartPage";
import { RequestReset } from "./components/StartPage/RequestReset/RequestReset";
import { PasswordReset } from "./components/StartPage/PasswordReset/PasswordReset";

interface State {
  store: Store;
}

export const store = new Store();

export const Context = createContext<State>({ store });

ReactDOM.render(
  <Context.Provider value={{ store }}>
    <Router>
      <Routes>
        <Route path="/request-reset" element={<RequestReset />} />
        <Route
          path="/reset-password/:resetToken/:id"
          element={<PasswordReset />}
        />
        <Route path="/login" element={<StartPage />} />
        <Route path="/profile" element={<App />} />
        <Route path="/" element={<Navigate to="/profile" />} />
        <Route path="*" element={<h1>Page with such URL does not exists</h1>} />
      </Routes>
    </Router>
  </Context.Provider>,
  document.getElementById("root")
);
