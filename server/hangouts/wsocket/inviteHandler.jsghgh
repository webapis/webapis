import { hangoutStates } from "../hangoutStates";
export async function inviteHandler({ collection, hangout, ws, connections }) {
  try {
    const invited = {
      username: hangout.username,
      email: hangout.email,
      state: hangoutStates.INVITED,
      message: hangout.message,
    };
    const inviter = {
      message: hangout.message,
      username: ws.user.username,
      email: ws.user.email,
      state: hangoutStates.INVITER,
    };

    // push hangout to inviter
    await collection.updateOne(
      { username: ws.user.username },
      {
        $push: {
          hangouts: invited,
        },
      }
    );
    //push hangout to invitee
    await collection.updateOne(
      { username: hangout.username },
      {
        $push: {
          invitations: inviter,
        },
      }
    );
    //INVITEE ONLINE: send state change
    const inviteeConnection = connections[hangout.username];
    if (inviteeConnection) {
      inviteeConnection.send(JSON.stringify(inviter));
    } else {
      //INVITEE OFFLINE: save hangout to undeliverded
      await collection.updateOne(
        { username: hangout.username },
        {
          $push: {
            undeliverded: inviter,
          },
        }
      );
    }
    //send state change to inviter
    ws.send(JSON.stringify(invited));
  } catch (error) {
    console.log("inviteHandlerError", error);
  }
}
//
