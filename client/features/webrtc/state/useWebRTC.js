import {
  useEffect,
  useState,
  useContext,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import iceServers from "./ice-servers";
import { WebRTCContext } from "./WebRTCProvider";
import { initializeVideoOffer } from "./actions";
export default function useWebRTC({ target }) {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error("WebRTCContext must be used with WebRTCProvider");
  }
  const [state, dispatch] = context;
  const { mediaConstraints, RTCConfiguration } = state;
  function onVideoCall() {
    initializeVideoOffer({
      dispatch,
      mediaConstraints,
      RTCConfiguration,
      target,
    });
  }
  function onCancelVideoCall() {}
  function onCloseVideoCall() {}
  function onAnswerVideoCall() {}
  function onDeclineVideoCall() {}
  function onEndVideoCall() {}
  function onClick(e) {
    const id = e.currentTarget.id;
    switch (id) {
      case "video-call":
        onVideoCall();
        break;
      case "close-videocall":
        onCloseVideoCall();
        break;
      case "cancel-videocall":
        onCancelVideoCall();
        break;
      case "answer-video-call":
        onAnswerVideoCall();
        break;
      case "decline-video-call":
        onDeclineVideoCall();
        break;
      case "end-video-call":
        onEndVideoCall();
        break;
      default:
        throw "No id provided";
    }
  }
  return {
    state,
    dispatch,
    onClick,
  };
}
