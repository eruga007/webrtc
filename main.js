"use strict";

// On this codelab, you will be streaming only video (video: true).
// const mediaStreamConstraints = {
//   video: true
// };
navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

var constraints = {
  audio: false,
  video: {
    mandatory: { maxWidth: 640, maxHeight: 360 }
  }
};

var video = document.querySelector("video");

function onGetMediaSuccess(stream) {
  console.log("onGetMediaSuccess");
  video.src = window.URL.createObjectURL(stream);
}

function onGetMediaError(e) {
  console.log("The following error occured: " + e);
}

navigator.getUserMedia(constraints, onGetMediaSuccess, onGetMediaError);
function onaddstream(event) {
  if (!event) return;
  remoteView.src = window.URL.createObjectURL(event.stream, "local");
  console.log("onaddstream");
}

var peerConnection = new RTCPeerConnection({
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302"
    }
  ]
});
// console.log(peerConnection.createOffer(getOfferSDP));
peerConnection.createOffer(getOfferSDP);
// console.log(offerSDP)
function getOfferSDP(offerSDP) {
  peerConnection.setLocalDescription(offerSDP, [
    successCallback,
    failureCallback
  ]);

  console.log("offer sdp", offerSDP.sdp);
  console.log("type", offerSDP.type);
}
// peerConnection.createOffer(
//   function(offerSDP) {
//     peerConnection.setLocalDescription(offerSDP);
//     POSTOfferSDP(offerSDP.sdp, offerSDP.type);
//     console.log('offer sdp',offerSDP.sdp )
//     console.log('offer type',offerSDP.type )
//   },
//   function(error) {
//     Console.log(error);
//   },
//   { mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: true } }
// );
var remoteSessionDescription = new RTCSessionDescription(offerSDP);
peerConnection.setRemoteDescription(
  remoteSessionDescription,
  successCallback,
  failureCallback
);


peerConnection.createAnswer(getAnswerSDP, sdpConstraints);
function getAnswerSDP(answerSDP) {
  peerConnection.setLocalDescription(answerSDP);
    
    console.log('answer sdp', answerSDP.sdp);
    console.log('type',       answerSDP.type);
};
// peerConnection.createAnswer(
//   function(sessionDescription) {
//     peerConnection.setLocalDescription(sessionDescription);
//     POSTanswerSDP(sessionDescription.sdp, sessionDescription.type);
//   },
//   function(error) {
//     console.log(error);
//   },
//   {
//     mandatory: {
//       OfferToReceiveAudio: true,
//       OfferToReceiveVideo: true
//     }
//   }
// );
function onicecandidate(event) {
  if (!peerConnection || !event || !event.candidate) return;
  var candidate = event.candidate;
  POSTIce(candidate.candidate, candidate.sdpMLineIndex);
  console.log(candidate.candidate);
}

function onaddstream(event) {
  if (!event) return;
  remoteView.src = window.URL.createObjectURL(event.stream, "peer");
  console.log("onaddstream");
}
// Initializes media stream.

peerConnection.onicecandidate = onicecandidate();
peerConnection.onaddstream = onaddstream();
peerConnection.addStream(stream);
