import { useEffect, useState } from "preact/hooks";
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
