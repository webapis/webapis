const { stateMapper } = require("./stateMapper");
module.exports.hangoutMapper = function ({ hangout, cUser }) {
  try {
    const { senderState, targetState } = stateMapper({
      command: hangout.command,
    });

    const {
      target: sTarget,
      email,
      message,
      offline,
      timestamp,
      browserId,
    } = hangout;

    const sender = {
      target: sTarget,
      email,
      message,
      timestamp,
      state: senderState,
      browserId,
    };

    const target = {
      target: cUser.username,
      email: cUser.email,
      message,
      timestamp,
      state: targetState,
    };

    return { hForTarget: target, hForSender: sender };
  } catch (error) {}
};
