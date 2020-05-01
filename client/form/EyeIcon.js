import { h } from 'preact';
import { useState } from 'preact/hooks';
import openIcon from './icons/openEye.png';
import closeIcon from './icons/closeEye.png';
function IconState({ open }) {
  if (open) {
    return <img style={{ width: 25 }} src={openIcon} />;
  }
  return <img style={{ width: 25 }} src={closeIcon} />;
}

export default function EyeIcon({ onClick,inputType }) {
  const [state, setState] = useState(false);
  function toggle() {
    onClick();
    setState((prev) => !prev);
  }
  if (inputType === 'password')
    return (
      <div
        onClick={toggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 1,
        }}
      >
        <IconState open={state} />
      </div>
    );

  return null;
}
