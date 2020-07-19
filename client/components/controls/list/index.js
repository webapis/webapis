import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";

export default function List(props) {
  return <div className="list-group" {...props} />;
}

function ListItem(props) {
  return (
    <button
      type="button"
      className="list-group-item list-group-item-action"
      {...props}
    />
  );
}

export { ListItem };
