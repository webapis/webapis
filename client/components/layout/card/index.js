import { h } from "preact";
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
