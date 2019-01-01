//removes hangouts from undelivered items after being delivered
//this function is invoked on user connection. after sendUndeliveredHangouts() function
const { undefinedArguments } = require("../../../helpers");
module.exports.removeDelivered = async function ({ col, username, browserId }) {
  try {
    undefinedArguments({ col, username, browserId });
    await col.update(
      { username },
      { $pull: { "browsers.$[t].undelivered": {} } },
      { arrayFilters: [{ "t.browserId": browserId }] }
    );
  } catch (error) {
    throw error;
  }
};