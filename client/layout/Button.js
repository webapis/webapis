import { h } from 'preact';

export function Button(props) {
  const { title,style } = props;
  return (
    <button className="btn" {...props}>
      {title}
    </button>
  );
}
