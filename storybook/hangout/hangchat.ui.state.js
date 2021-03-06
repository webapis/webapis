import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Hangchat from "../../client/features/hangouts/ui-components/Hangchat";
const html = htm.bind(h);

const messages = [
  {
    timelog: "Now",
    text: "Hello demo How are you doing today? Are you doing all right",
    username: "berouser",
    state: "read",
  },
  {
    timelog: "Now",
    text: "Hello bero. ",
    username: "demouser",
    state: "read",
  },
  {
    timelog: "Now",
    text: "Hello demo How are you doing today? Are you doing all right",
    username: "berouser",
    state: "read",
  },
  {
    timelog: "Now",
    text: "Hello bero. ",
    username: "demouser",
    state: "read",
  },
  {
    timelog: "Now",
    text: "Hello demo How are you doing today? Are you doing all right",
    username: "berouser",
    state: "read",
  },
  {
    timelog: "Now",
    text: "Hello bero. ",
    username: "demouser",
    state: "read",
  },
  {
    timelog: "Now",
    text: "Hello demo How are you doing today? Are you doing all right",
    username: "berouser",
    state: "read",
  },
  {
    timelog: "Now",
    text: "Hello bero. ",
    username: "demouser",
    state: "read",
  },
  {
    timelog: "Now",
    text: "Hello demo How are you doing today? Are you doing all right",
    username: "berouser",
    state: "read",
  },
  {
    timelog: "Now",
    text: "Hello bero. ",
    username: "demouser",
    state: "read",
  },
];

export default function HangchatUiState() {
  return html` <div style="height:100%">
    <${Hangchat} messages=${messages} name="demouser" username="berouser" />
  </div>`;
}
