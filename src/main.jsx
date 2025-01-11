import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AppProvider } from "./Context/Context.jsx";
import { Provider } from "react-redux";
import store from "./components/Store/Index.js";

ReactDOM.createRoot(document.getElementById("root")).render(
 

    <Provider store={store}>
      <App />

    </Provider>
 
);
