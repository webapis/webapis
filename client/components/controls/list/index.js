import { h } from "preact";

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
