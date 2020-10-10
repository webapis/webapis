import { h } from "preact";
import useDeliveredAcknowledgement from "./useDeliveredAcknowledgement";
import useSenderMessage from "./useSenderMessage";

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
}
