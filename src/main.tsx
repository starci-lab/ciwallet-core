import React from "react"
// buffer is needed for the bip39 library
import { Buffer } from "buffer"
window.Buffer = Buffer

import { createRoot } from "react-dom/client"
import "./global.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
    <App />
)
