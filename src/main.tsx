import "@/utils/i18n";
import "./main.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import ApplicationLayout from "@/layout/Application";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApplicationLayout />
    </BrowserRouter>
  </React.StrictMode>,
);
