import actionTypes from "./actionTypes";
export async function initializeVideoOffer({
  mediaConstraints,
  RTCConfiguration,
  dispatch,
  target,
}) {
  try {
    //capture local media
    const localStream = await navigator.mediaDevices.getUserMedia(
      mediaConstraints
    );
    //create RTCPeerConnection and call add tracks
    const rtcPeerConnection = new RTCPeerConnection(RTCConfiguration);
    localStream.getTracks((t) => {
      rtcPeerConnection.addTrack(t, localStream);
    });
    //call RTCPeerConnection.createOffer
    const sdp = await rtcPeerConnection.createOffer();
    //setLocalDescription
    await rtcPeerConnection.setLocalDescription(sdp);
    // set signaling protocol
    const offer = { sdp, type: "video-offer", target };
    //dispatch localMediaStream, RTCPeerConnection,offer to webRTCReducer
    dispatch({
      type: actionTypes.INITIALIZED_VIDEO_OFFER,
      localStream,
      rtcPeerConnection,
      offer,
    });
  } catch (error) {
    console.log("rtcError...", error);
  }
  x;
}
