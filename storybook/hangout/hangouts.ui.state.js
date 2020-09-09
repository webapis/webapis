import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { Hangouts } from "../../client/features/hangouts/ui-components/Hangouts";
const html = htm.bind(h);

export default function HanogutUiState() {
  return html`
    <div>
      <div class="accordion" id="hangoutuistates">
        <${Accordion} title="Initial State" collapseid="initState">
          <${Hangouts}
            hangouts=${[
              { username: "demos" },
              { username: "beros" },
              { username: "guru" },
            ]}
            search=""
          />
        <//>
        <${Accordion} title="User Entered Search Input" collapseid="search">
          <${Hangouts} hangouts=${[]} search="feros" />
        <//>
        <${Accordion}
          title="User Clicked Search Button"
          collapseid="clicksearch"
        >
          <${Hangouts} hangouts=${[]} search="feros" searching=${true} />
        <//>
        <${Accordion} title="User is not found" collapseid="usernotfound">
          <${Hangouts}
            hangouts=${[]}
            searchResult="notfound"
            guestEmail=""
            search="testUser"
            userNotFound=${true}
            searchComplete=${true}
          />
        <//>
        <${Accordion}
          title="User clicked invite button."
          collapseid="clickinvite"
        >
          <${Hangouts}
            hangouts=${[]}
            searchResult="notfound"
            invitingGuest=${true}
            inviteGuest=${true}
            guestEmail="test@gmail.com"
            messageForGuest="Hello demo let's chat as a guest!"
          />
        <//>
        <${Accordion}
          title="Guest Invitation is send successfully"
          collapseid="sendguestinvit"
        >
          <${Hangouts}
            hangouts=${[]}
            searchResult="notfound"
            invitationSuccess=${true}
            inviteGuest=${false}
            userNotFound=${true}
          />
        <//>
        <${Accordion}
          title="Guest Invitation sending failed"
          collapseid="failedsending"
        >
          <${Hangouts}
            hangouts=${[]}
            searchResult="notfound"
            userNotFound=${true}
            inviteGuest=${true}
            error=${{ message: "something went wrong" }}
          />
        <//>
        <${Accordion} title="User is found" collapseid=""> <//>
        <${Accordion} title="" collapseid="">
          <${Hangouts}
            search="feros"
            hangouts=${[{ username: "feros", state: "INVITEE" }]}
          />
        <//>
      </div>
    </div>
  `;
}

function Accordion({ collapseid, children, title }) {
  return html`
    <div class="card">
      <div class="card-header" id="headingOne">
        <h2 class="mb-0">
          <button
            class="btn btn-link btn-block text-left"
            type="button"
            data-toggle="collapse"
            data-target=${`#${collapseid}`}
            aria-expanded="false"
            aria-controls=${collapseid}
          >
            ${title}
          </button>
        </h2>
      </div>

      <div
        id=${collapseid}
        class="collapse show"
        aria-labelledby="headingOne"
        data-parent="#hangoutuistates"
      >
        <div class="">
          ${children}
        </div>
      </div>
    </div>
  `;
}
