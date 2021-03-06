import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { Done } from "icons/Done";
import Layout from "./Layout";
const html = htm.bind(h);
const style = {
  layout: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
};
export default function Invitee({ username, email, state }) {
  return html`
    <${Layout} id="invitee-ui" username=${username} desc="Invitation for ">
      <div
        class="h-100 d-flex flex-column justify-content-center align-items-center text-center"
      >
        <${Done} width="70" height="70" color="green" />
        <p>
          You will be able to chat with <b>${email}</b> once your invition
          accepted.
        </p>
        ${state === "INVITED" && html`<div class="invited" />`}
      </div>
    <//>
  `;
}
