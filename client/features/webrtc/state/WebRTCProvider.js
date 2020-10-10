import { h, createContext } from "preact";
import { useContext, useMemo, useReducer, useEffect } from "preact/hooks";
import htm from "htm.module";
import reducer, { initState } from "./reducer";
import actionTypes from "./actionTypes";
const html = htm.bind(h);
export const WebRTCContext = createContext();

export default function WebRTCProvider(props) {
  const { sendSignalingMessage, signalingMessage } = props;
  const [state, dispatch] = useReducer(reducer, initState);

  const { rtcPeerConnection } = state;

  useEffect(() => {
    if (rtcPeerConnection) {
      rtcPeerConnection.onicecandidate = (e) => {
        sendSignalingMessage({ sdp: e.candidate, type: "ice" });
      };
      rtcPeerConnection.onconnectionstatechange = (e) => {
        dispatch({
          type: actionTypes.CONNECTION_STATE_CHANGED,
          connectionState: rtcPeerConnection.connectionState,
        });
      };

      rtcPeerConnection.oniceconnectionstatechange = () => {
        dispatch({
          type: actionTypes.ICE_CONNECTION_STATE_CHANGED,
          iceConnectionState,
        });
      };
      rtcPeerConnection.onicegatheringstatechange = () => {
        dispatch({
          type: actionTypes.ICE_GATHERING_STATE_CHANGED,
          iceGatheringState: rtcPeerConnection.iceGatheringState,
        });
      };
      rtcPeerConnection.ontrack = (e) => {
        dispatch({ type: actionTypes.ON_TRACK, remoteStreams: e.streams });
      };
    }
  }, [rtcPeerConnection]);
  const value = useMemo(() => [state, dispatch], [state]);
  return html`<${WebRTCContext.Provider} value=${value} ...${props} />`;
}
