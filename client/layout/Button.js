import { h } from 'preact';

export function Button(props) {
  const { title,style,id } = props;
  return (
    <button className="btn" {...props}>
      {title}
    </button>
  );
}
