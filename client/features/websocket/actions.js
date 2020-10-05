import actionTypes from "./actionTypes";

export function initWebSocket({ url, dispatch }) {
  const websocket = new WebSocket(url.replace(/^http/, "ws"));
  dispatch({ type: actionTypes.WEBSOCKET_INITIALIZED, websocket });
}
