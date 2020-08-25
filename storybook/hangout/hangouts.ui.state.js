import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Hangouts from "../../client/features/hangouts/ui-components/Hangouts";
const html = htm.bind(h);

export default function HanogutUiState() {
  return html`
    <div style="height:100%">
      <h5 class="bg-success text-white text-center">Initial State</h5>
      <${Hangouts}
        hangouts=${[{ username: "demos" }, { username: "beros" }]}
        search=""
      />
      <h5 class="bg-success text-white text-center">
        User Entered Search Input
      </h5>
      <${Hangouts}
        hangouts=${[{ username: "demos" }, { username: "beros" }]}
        search="feros"
      />
      <h5 class="bg-success text-white text-center">User is not found</h5>
      <${Hangouts}
        hangouts=${[{ username: "demos" }, { username: "beros" }]}
        searchResult="notfound"
        guestEmail=""
      />
      <h5 class="bg-success text-white text-center">
        Guest Invitation is send
      </h5>
      <${Hangouts}
        hangouts=${[{ username: "demos" }, { username: "beros" }]}
        searchResult="notfound"
      />
      <h5 class="bg-success text-white text-center">User is found</h5>
      <${Hangouts} hangouts=${[{ username: "demos" }, { username: "beros" }]} />
    </div>
  `;
}
