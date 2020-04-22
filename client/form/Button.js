import {h} from 'preact';

export default function Button({ onClick, title, disabled, id }) {
  return (
    <button
      data-testid={id}
      disabled={disabled}
      style={{ borderRadius: 2, height: 33 }}
      onClick={onClick}
    >
      {title}
    </button>
  );
}
