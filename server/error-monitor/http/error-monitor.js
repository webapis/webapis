module.exports.errorMonitor = function ({ req, res, collection }) {
  try {
    const errors = collection.find().toArray();

    debugger;
  } catch (error) {
    debugger;
  }
};
