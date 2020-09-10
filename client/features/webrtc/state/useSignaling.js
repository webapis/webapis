import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import useWebRTC from "./useWebRTC";
export default function useSignaling({ message, sendSignalingMessage }) {
  const { state, dispatch } = useWebRTC();
  const { rtcPeerConnection } = state;
}
