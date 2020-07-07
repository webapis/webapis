import { h } from "preact";
import Message from "./messages/Message";
import Layout from "./Layout";
import Button from "controls/button";
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

export default function Inviter({ hangout, onAccept, onDecline, loading }) {
  return (
    <Layout id="inviter-ui">
      <div style={style.root}>
        <div style={{ marginLeft: 8, display: "flex" }}>
          {hangout && hangout.message && (
            <Message
              message={
                hangout &&
                hangout.message && {
                  ...hangout.message,
                  username: hangout.username,
                  float: "left",
                }
              }
            />
          )}
        </div>

        <div className="row">
          <div className="col">
            <Button
              id="DECLINE"
              onClick={onDecline}
              data-testid="decline-btn"
              title="Decline"
              block
              bg="danger"
              outline
            />
          </div>

          <div className="col">
            <Button
              id="ACCEPT"
              onClick={onAccept}
              data-testid="accept-btn"
              loading={loading}
              title="Accept"
              bg="primary"
              block
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
