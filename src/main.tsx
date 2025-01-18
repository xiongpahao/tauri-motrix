import Layout from "@/pages/_layout";
import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  </React.StrictMode>
);
