import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cbdf6161bd8ca09a385d62c8c697bd1cd87bb184/hooks.cdn.js";
import iceServers from "./ice-servers";
export function useWebrtc(props) {
  const { video, audio } = props;
  const [rtcPeerConnection, setRtcPeerConnection] = useState(null);

  useEffect(() => {
    setRtcPeerConnection(new RTCPeerConnection(iceServers));
  }, []);

  function createVideoOffer() {
    navigator.mediaDevices.getUserMedia({ audio, video }).then((stream) => {
      stream
        .getVideoTracks()
        .forEach((t) => rtcPeerConnection.addTrack(t, stream));
    });
  }

  function createVideoAnswer() {}

  return { createVideoAnswer, createVideoOffer };
}
