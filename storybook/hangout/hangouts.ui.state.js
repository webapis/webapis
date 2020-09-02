import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { Hangouts } from "../../client/features/hangouts/ui-components/Hangouts";
const html = htm.bind(h);

export default function HanogutUiState() {
  return html`
    <div style="height:100%">
      <h5 class="bg-success text-white text-center">Initial State</h5>
      <${Hangouts}
        hangouts=${[
          { username: "demos" },
          { username: "beros" },
          { username: "guru" },
        ]}
        search=""
      />
      <h5 class="bg-success text-white text-center">
        User Entered Search Input
      </h5>
      <${Hangouts} hangouts=${[]} search="feros" />
      <h5 class="bg-success text-white text-center">
        User Clicked Search Button
      </h5>
      <${Hangouts} hangouts=${[]} search="feros" searching=${true} />
      <h5 class="bg-success text-white text-center">User is not found</h5>
      <${Hangouts}
        hangouts=${[]}
        searchResult="notfound"
        guestEmail=""
        search="testUser"
        userNotFound=${true}
        searchComplete=${true}
      />
      <h5 class="bg-success text-white text-center">
        User clicked invite button.
      </h5>
      <${Hangouts}
        hangouts=${[]}
        searchResult="notfound"
        invitingGuest=${true}
        inviteGuest=${true}
        guestEmail="test@gmail.com"
        messageForGuest="Hello demo let's chat as a guest!"
      />
      <h5 class="bg-success text-white text-center">
        Guest Invitation is send successfully
      </h5>
      <${Hangouts}
        hangouts=${[]}
        searchResult="notfound"
        invitationSuccess=${true}
        inviteGuest=${false}
        userNotFound=${true}
      />
      <h5 class="bg-success text-white text-center">
        Guest Invitation sending failed
      </h5>
      <${Hangouts}
        hangouts=${[]}
        searchResult="notfound"
        userNotFound=${true}
        inviteGuest=${true}
        error=${{ message: "something went wrong" }}
      />
      <h5 class="bg-success text-white text-center">User is found</h5>
      <${Hangouts}
        search="feros"
        hangouts=${[{ username: "feros", state: "INVITEE" }]}
      />
    </div>
  `;
}
