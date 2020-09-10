import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
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
