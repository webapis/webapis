import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import TextInput from "controls/text-input";

export default function TextInputStates() {
  return (
    <div>
      <div>
        <h5>Validation</h5>
        <TextInput isValid={true} />
        <TextInput isValid={false} />
      </div>
    </div>
  );
}
