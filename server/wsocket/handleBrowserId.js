module.exports.handleBrowserId = async function ({
  collection,
  browserId,
  username,
}) {
  debugger;
  try {
    debugger;
    const user = await collection.findOne({ username });
    const browsers = user.browsers;
    if (!browsers) {
      debugger;
      await collection.update(
        { username },
        { $push: { browsers: { browserId } } }
      );
    } else {
      if (!browsers.find((b) => b.browserId === browserId)) {
        debugger;
        await collection.update(
          { username },
          { $push: { browsers: { browserId } } }
        );
      }
    }
  } catch (error) {
    debugger;
    throw error;
  }
};
