import { useEffect } from "preact/hooks";
import useWebRTC from "../../../webrtc/state/useWebRTC";
export default function useSignaling({ socket, hangout }) {
  const { state, dispatch } = useWebRTC({
    target: hangout && hangout.target,
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
