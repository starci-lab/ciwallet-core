import React from "react"
// buffer is needed for the bip39 library
import { Buffer } from "buffer"
import { createRoot } from "react-dom/client"
import { Nomas } from "./nomas"
import "./nomas/global.css"
window.Buffer = Buffer

createRoot(document.getElementById("root")!).render(<Nomas />)    