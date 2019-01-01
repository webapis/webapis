const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const { MongoClient } = require("mongodb");
const { undefinedArguments } = require("../../helpers");
const { sendDelayedAck } = require("./send-message/sendDelayedAck");
const { removeDelayedAck } = require("./persist-message/removeDelayedAck");
const { sendUndelivered } = require("./send-message/sendUndelivered");
const { removeDelivered } = require("./persist-message/removeDelivered");

const { sendHangout } = require("./send-message/sendHangout");
const { updateHangout } = require("./persist-message/updateHangout");
const { saveDelayedAck } = require("./persist-message/saveDelayedAck");
const { saveUndelivered } = require("./persist-message/saveUndelivered");

const { hangoutMapper } = require("./hangoutMapper");
module.exports.hangoutHandlerNew = async function ({
  ws,
  connections,
  username,
  browserId,
  persist,
}) {
  try {
    undefinedArguments({ ws, connections, username, browserId, persist });
    const client = await new MongoClient(dbUrl, { useUnifiedTopology: true });

    connections[`${username}-${browserId}`] = ws;

    await client.connect();
    const col = await client.db("auth").collection("users");
    const cUser = await col.findOne({ username });

    sendDelayedAck({ cUser, browserId, ws }) &&
      persist &&
      removeDelayedAck({ col, username, browserId }); //
    sendUndelivered({ cUser, ws, browserId }) &&
      persist &&
      removeDelivered({ col, username, browserId }); //

    ws.on("message", async (socketMessage) => {
      const { data } = JSON.parse(socketMessage);
      const { type } = data;

      switch (type) {
        case "HANGOUT":
          let { hangout } = data;
          debugger;
          const { target } = hangout;
          debugger;
          const tUser = await col.findOne({ username: target });
          const { hForTarget, hForSender } = hangoutMapper({
            hangout,
            cUser,
          });

          sendHangout({ cUser, tUser, connections, hForTarget, hForSender }) &&
            persist &&
            updateHangout({
              col,
              cUser,
              tUser,
              hForTarget,
              hForSender,
              hangout,
            });
          persist && saveDelayedAck({ col, connections, cUser, hForSender });
          persist && saveUndelivered({ col, connections, tUser, hForTarget });
          break;
        case "OFFLINE_HANGOUTS":
          let { hangouts } = data;

          hangouts.forEach(async (hangout) => {
            const { target } = hangout;

            const tUser = await col.findOne({ username: target });
            const { hForTarget, hForSender } = hangoutMapper({
              hangout,
              cUser,
            });

            sendHangout({
              cUser,
              tUser,
              connections,
              hForTarget,
              hForSender,
            }) &&
              persist &&
              updateHangout({
                col,
                cUser,
                tUser,
                hForTarget,
                hForSender,
                hangout,
              });
            persist && saveDelayedAck({ col, connections, cUser, hForSender });
            persist && saveUndelivered({ col, connections, tUser, hForTarget });
          });

          break;
        default:
          throw "No hangout type specified";
      }
    });

    ws.on("close", () => {
      delete connections[`${username}-${browserId}`];

      console.log("socket closed by", username);
    });
  } catch (error) {
    debugger;
    throw error;
  }
};
