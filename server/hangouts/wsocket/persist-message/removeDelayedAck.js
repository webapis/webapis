//invoked on user connection after sendDelayedHangouts function returns true;
//this function removes hangouts from deyaled items after being synced with connected device or browser
const { undefinedArguments } = require("../../../helpers");
module.exports.removeDelayedAck = async function ({
  col,
  username,
  browserId,
}) {
  try {
    undefinedArguments({ col, username, browserId });
    await col.update(
      { username },
      { $pull: { "browsers.$[t].delayed": {} } },
      { arrayFilters: [{ "t.browserId": browserId }] }
    );
  } catch (error) {
    throw error;
  }
};
