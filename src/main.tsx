import "@/services/i18n";
import "./main.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import ApplicationLayout from "@/layout/Application";

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <ApplicationLayout />
      </BrowserRouter>
    </React.StrictMode>,
  );
}
