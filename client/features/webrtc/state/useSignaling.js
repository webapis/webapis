import { useContext, useMemo, useReducer, useEffect } from "preact/hooks";
import useWebRTC from "./useWebRTC";
export default function useSignaling({ message, sendSignalingMessage }) {
  const { state, dispatch } = useWebRTC();
  const { rtcPeerConnection } = state;
}
