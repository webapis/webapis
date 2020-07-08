import { h } from "preact";
import { useEffect } from "preact/hooks";
import { useHangouts } from "../../state/useHangouts";
import * as actions from "./actions";
import { stateMapper } from "server/hangouts/stateMapper";
import { clientCommands } from "features/hangouts/state/clientCommands";
import { useAuthContext } from "features/authentication";
import { actionTypes } from "../../state/actionTypes";
export function ParseServer(props) {
  const { children } = props;
  const { state, dispatch } = useHangouts();
  const authContext = useAuthContext();
  const { user } = authContext.state;
  const { fetchHangouts, search, pendingHangout } = state;

  useEffect(() => {
    if (fetchHangouts) {
      actions.fetchHangouts({ dispatch, search, userId: user.objectId });
    }
  }, [fetchHangouts]);

  useEffect(() => {
    if (pendingHangout) {
      sendHangout();
    }
  }, [pendingHangout]);

  useEffect(() => {
    if (user) {
      subScribeToUnreadHangout();
      subScribeToHangout();

      Parse.LiveQuery.on("open", async () => {
        let query = new Parse.Query("UnreadHangout");
        query.equalTo("userid", user.objectId);
        let unreadhangouts = await query.find();
        if (unreadhangouts) {
          unreadhangouts.forEach((h) => {
            const unreadhangout = h.attributes;

            handleHangout({ hangout: unreadhangout });
            removeUnreadHangout({ hangout: unreadhangout, objectId: h.id });
          });
        }

        console.log("socket connection established");
      });
    }
  }, [user]);

  function handleHangout({ hangout }) {
    switch (hangout.state) {
      case "INVITED":
      case "ACCEPTED":
      case "BLOCKED":
      case "MESSAGED":
      case "DECLINED":
      case "UNBLOCKED":
        dispatch({
          type: actionTypes.SERVER_MESSAGE_RECIEVED,
          message: { hangout, type: "ACKHOWLEDGEMENT" },
        });
        break;
      case "INVITER":
      case "ACCEPTER":
      case "BLOCKER":
      case "MESSANGER":
      case "UNBLOCKER":
        dispatch({
          type: actionTypes.SERVER_MESSAGE_RECIEVED,
          message: { hangout, type: "HANGOUT" },
        });
        break;
    }
  }
  async function removeUnreadHangout({ hangout, objectId }) {
    try {
      let UnreadHangout = Parse.Object.extend("UnreadHangout");
      let query = new Parse.Query(UnreadHangout);
      let unreadhangout = await query.get(objectId);
      await unreadhangout.destroy();
    } catch (error) {
      dispatch({ type: actionTypes.ERROR_RECIEVED, error });
    }
  }

  async function subScribeToHangout() {
    let query = new Parse.Query("Hangout");
    query.equalTo("userid", user.objectId);
    let subscription = await query.subscribe();
    subscription.on("create", (object) => {
      const hangout = object.attributes;

      handleHangout({ hangout });
    });
    subscription.on("update", (object) => {
      const hangout = object.attributes;

      handleHangout({ hangout });
    });
    subscription.on("enter", (object) => {});
    subscription.on("leave", (object) => {
      const { hangouts } = object.attributes;
      const hangout = hangouts[0].attributes;
      handleHangout({ hangout });
    });
  }

  async function subScribeToUnreadHangout() {
    let query = new Parse.Query("UnreadHangout");
    query.equalTo("userid", user.objectId);
    let subscription = await query.subscribe();
    subscription.on("create", (object) => {
      const hangout = object.attributes;

      handleHangout({ hangout });
      removeUnreadHangout({ hangout });
    });
    subscription.on("update", (object) => {
      const hangout = object.attributes;

      handleHangout({ hangout });
      removeUnreadHangout({ hangout });
    });
    subscription.on("enter", (object) => {});
    subscription.on("leave", (object) => {
      const { hangouts } = object.attributes;
      const hangout = hangouts[0].attributes;
      handleHangout({ hangout });
      removeUnreadHangout({ hangout });
    });
  }

  async function sendHangout() {
    try {
      const { senderState, targetState } = stateMapper({
        command: pendingHangout.command,
      });
      const { username, email, message, offline, timestamp } = pendingHangout;
      const Hangout = Parse.Object.extend("Hangout");

      const SenderUser = Parse.Object.extend("HangoutUser");
      let senderQuery = new Parse.Query(SenderUser);
      senderQuery.equalTo("username", user.username);
      let senderUser = await senderQuery.first();

      const TargetUser = Parse.Object.extend("HangoutUser");
      let targetQuery = new Parse.Query(TargetUser);
      targetQuery.equalTo("username", username);
      let targetUser = await targetQuery.first();

      //HANGOUT
      const sender = new Hangout();
      sender.set("username", username);
      sender.set("email", email);
      sender.set("message", message);
      sender.set("timestamp", timestamp);
      sender.set("state", senderState);
      sender.set("userid", senderUser.attributes.userid);

      const target = new Hangout();
      target.set("username", user.username);
      target.set("email", user.email);
      target.set("message", message);
      target.set("timestamp", timestamp);
      target.set("state", targetState);
      target.set("userid", targetUser.attributes.userid);

      if (pendingHangout.command === clientCommands.INVITE) {
        senderUser.addUnique("hangouts", sender);
        targetUser.addUnique("hangouts", target);
        sender.set("owner", senderUser);
        target.set("owner", targetUser);
      } else {
        let targetQuery = new Parse.Query("Hangout");
        targetQuery.equalTo("userid", targetUser.attributes.userid);
        let targetHangout = await targetQuery.first();
        targetHangout.set("message", message);
        targetHangout.set("timestamp", timestamp);
        targetHangout.set("state", targetState);
        // targetHangout.save()

        let senderQuery = new Parse.Query("Hangout");
        senderQuery.equalTo("userid", user.objectId);
        let senderHangout = await senderQuery.first();
        senderHangout.set("message", message);
        senderHangout.set("timestamp", timestamp);
        senderHangout.set("state", senderState);
        senderHangout.save();
      }
      //UNREADHANGOUT
      const UnreadHangout = Parse.Object.extend("UnreadHangout");
      const unreadTarget = new UnreadHangout();
      unreadTarget.set("username", user.username);
      unreadTarget.set("email", user.email);
      unreadTarget.set("message", message);
      unreadTarget.set("timestamp", timestamp);
      unreadTarget.set("state", targetState);
      unreadTarget.set("userid", targetUser.attributes.userid);
      targetUser.addUnique("unreadhangouts", unreadTarget);
      unreadTarget.set("owner", targetUser);
      //SAVE HANGOUTUSER
      senderUser.save();
      targetUser.save();
    } catch (error) {}
  }

  return children;
}
