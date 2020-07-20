import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Message from "./messages/Message";
import Layout from "./Layout";
import Button from "controls/button/index";
const style = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    paddingTop: 70,
    boxSizing: "border-box",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
};
const html = htm.bind(h);
export default function Inviter({ hangout, onAccept, onDecline, loading }) {
  return html`
    <${Layout} id="inviter-ui">
      <div style=${style.root}>
        <div style=${{ marginLeft: 8, display: "flex" }}>
          {hangout && hangout.message && (
          <${Message}
            message=${hangout &&
            hangout.message && {
              ...hangout.message,
              username: hangout.username,
              float: "left",
            }}
          />
          )}
        </div>

        <div class="row">
          <div class="col">
            <${Button}
              id="DECLINE"
              onClick=${onDecline}
              data-testid="decline-btn"
              title="Decline"
              block
              bg="danger"
              outline
            />
          </div>

          <div class="col">
            <${Button}
              id="ACCEPT"
              onClick=${onAccept}
              data-testid="accept-btn"
              loading=${loading}
              title="Accept"
              bg="primary"
              block
            />
          </div>
        </div>
      </div>
    <//>
  `;
}
