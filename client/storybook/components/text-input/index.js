import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import TextInput from "controls/text-input/index";
const html = htm.bind(h);
export default function TextInputStates() {
  return html`
    <div>
      <div>
        <h5>Validation</h5>
        <${TextInput} isValid=${true} />
        <${TextInput} isValid=${false} />
      </div>
    </div>
  `;
}
