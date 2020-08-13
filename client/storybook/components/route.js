import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute } from "components/app-route/index";
import Button from "./button/index";
import TextInput from "./text-input/index";
import ToastDemo from "./toast/index";
import AlertDemo from "./alert/index";
const html = htm.bind(h);
export default function ComponentsRoute() {
  return [
    html`
      <${AppRoute} path="/button">
        <${Button} />
      <//>
      <${AppRoute} path="/text-input">
        <${TextInput} />
      <//>
      <${AppRoute} path="/toast">
        <${ToastDemo} />
      <//>
      <${AppRoute} path="/alert">
        <${AlertDemo} />
      <//>
    `,
  ];
}
