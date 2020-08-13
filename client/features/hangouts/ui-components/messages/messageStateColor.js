export default function messageStateColor(state) {
  switch (state) {
    //remote message
    case "unread":
      return "#d50000";
    case "read":
      return "#e8f5e9";
    case "reading":
      return "#a5d6a7";
    //local message
    case "pending":
      return "#fff176";
    case "delivered":
      return "#fff9c4";
    case "seeing":
      return "#a5d6a7";
    case "seen":
      return "#e8f5e9";
    default:
      return "red";
  }
}
