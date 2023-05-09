import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Wordcloud from "./Wordcloud";

import { defaultWords1, defaultWords2 } from "./data";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Wordcloud data={defaultWords1} />
  </React.StrictMode>
);
