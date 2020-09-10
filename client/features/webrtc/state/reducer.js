import actionTypes from "./actionTypes";
import iceServers from "./ice-servers";
export const initState = {
  calling: false,
  localStream: null,
  remoteStreams: null,
  rtcPeerConnection: null,
  offer: null,
  answer: null,
  candidate: null,
  mediaConstraints: { video: true, audio: false },
  RTCConfiguration: iceServers,
  connectionState: "",
  iceConnectionState: "",
  iceGatheringState: "",
};
export default function reducer(state, action) {
  switch (action.type) {
    case actionTypes.ON_TRACK:
      return { ...state, remoteStreams: action.remoteStreams };
    case actionTypes.ICE_GATHERING_STATE_CHANGED:
      return { ...state, iceGatheringState: action.iceGatheringState };
    case actionTypes.ICE_CONNECTION_STATE_CHANGED:
      return { ...state, iceConnectionState: action.iceConnectionState };
    case actionTypes.CONNECTION_STATE_CHANGED:
      return { ...state, connectionState: action.connectionState };
    case actionTypes.INITIALIZED_VIDEO_OFFER:
      return {
        ...state,
        localStream: action.localStream,
        rtcPeerConnection: action.rtcPeerConnection,
        offer: action.offer,
      };
    default:
      return state;
  }
}
