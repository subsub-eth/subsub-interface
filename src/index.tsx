import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

const rootEl = document.getElementById("root");
const root = createRoot(rootEl);
root.render(<App />);