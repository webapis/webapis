import { useEffect } from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import useWebRTC from "../../../webrtc/state/useWebRTC";
export default function useSignaling({ socket, hangout }) {
  const { state, dispatch } = useWebRTC({
    target: hangout && hangout.username,
  });
  const { offer, answer, candidate } = state;

  useEffect(() => {
    if (offer && hangout && socket) {
      socket.send(JSON.stringify(offer));
    } else if (answer && hangout && socket) {
      socket.send(JSON.stringify(answer));
    } else if (candidate && hangout && socket) {
      socket.send(JSON.stringify(candidate));
    }
  }, [offer, answer, candidate, hangout, socket]);

  return null;
}
