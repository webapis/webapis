import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import useDeliveredAcknowledgement from "./useDeliveredAcknowledgement";
import useSenderMessage from "./useSenderMessage";
//import useUndeliveredHangouts from "./useUndeliveredHangouts";
import {
  updateSentMessage,
  saveUnread,
  saveHangout,
  saveSentMessage,
  saveRecievedMessage,
  updateHangout,
  removeUnreads,
} from "../local-storage/common";

export function useMessage(props) {
  useDeliveredAcknowledgement(props);
  useSenderMessage(props);
  //useUndeliveredHangouts(props);
}
