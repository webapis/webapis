import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import Alert from "controls/alert";
export default function AlertDemo() {
  return <Alert alert="danger" message="Server is temporarily unavailable" />;
}
