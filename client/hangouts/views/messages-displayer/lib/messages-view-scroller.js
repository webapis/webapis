/* eslint-disable react/no-deprecated */
import { h } from 'preact';

const MessageViewScroller = ({ children }) => {
  return (
    <div
      style={{
        transform: 'rotate(180deg)',
        height: '85%',
        backgroundColor: '#eeeeee',
        overflow: 'auto',
        width: '100%',
      }}
    >
      <div style={{ transform: 'rotate(180deg)' }}>{children}</div>
    </div>
  );
};

export default MessageViewScroller;