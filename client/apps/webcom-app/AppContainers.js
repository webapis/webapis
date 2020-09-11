import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import HangoutAdapter from "features/hangouts/state/HangoutAdapter";
import HangoutsProvider from "features/hangouts/state/HangoutsProvider";
import WebRTCProvider from "features/webrtc/WebRTCProvider";
import AuthProvider from "features/authentication/index";

const html = htm.bind(h);

export function HangoutContainer() {}
