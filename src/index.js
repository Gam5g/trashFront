import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";

axios.defaults.withCredentials = true;
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
