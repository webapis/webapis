import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import "./style.scss";
export default function Card() {
  return (
    <div
      className="mdc-card mdc-card--outlined"
      style={{ margin: 10, backgroundColor: "yellow" }}
    >
      Card
    </div>
  );
}
