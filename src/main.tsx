import React from "react"
// buffer is needed for the bip39 library
import { Buffer } from "buffer"
import { createRoot } from "react-dom/client"
import { Nomas } from "./nomas"
import cssText from "/src/nomas/global.css?inline"

window.Buffer = Buffer

const container = document.createElement("div")
container.id = "nomas-overlay"
container.style.all = "initial"
container.style.position = "fixed"
container.style.top = "0"
container.style.left = "0"
container.style.zIndex = "2147483647"
document.body.appendChild(container)
const shadow = container.attachShadow({ mode: "open" })
const rootEl = document.createElement("div")
rootEl.id = "root"

const sheet = new CSSStyleSheet()
sheet.replaceSync(cssText)
shadow.adoptedStyleSheets = [sheet]

shadow.appendChild(rootEl)
createRoot(rootEl).render(<Nomas />)    