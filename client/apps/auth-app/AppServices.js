import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import { h, render } from "preact";
import htm from "htm.module";
import ServiceAdapter from "../../service-adapters/ServiceAdapter";
const html = htm.bind(h);

export default function AppServices({ children }) {
  return html`<${ServiceAdapter}>
    ${children}
  <//> `;
}
