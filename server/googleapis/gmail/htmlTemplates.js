module.exports = function htmlTemplate({ type }) {
  debugger;
  switch (type) {
    case "GUEST_INVITATION":
      debugger;
      return "<b>Guest invitation</b>";
    default:
      throw "message type is not specified";
  }
};
