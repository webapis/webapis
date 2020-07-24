module.exports.clientError = async function ({ req, res, collection }) {
  //
  try {
    let error = req.body;
    const { message, stack } = error;
    const ip = req.connection.remoteAddress;
    const trimip = ip.slice(ip.lastIndexOf(":") + 1);
    const timestamp = Date.now();
    const rawHeaders = req.rawHeaders;
    debugger;
    const insertResult = await collection.insertOne({ message, stack });
  } catch (error) {
    debugger;
  }
};
