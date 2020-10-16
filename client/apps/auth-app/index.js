import "./";
import { h, render } from "preact";
import htm from "htm.module";
import AppServices from "./AppServices";
import ServiceAdapter from "../../service-adapters/ServiceAdapter";
import App from "./App";
const html = htm.bind(h);

render(
  html`<${ServiceAdapter}>
    ${() => {
      return html` <${App} />`;
    }}<//
  >`,
  document.body
);
