import { h } from 'preact';

export function TextChat({ room }) {
  return <div data-testid={room.username}>TextChat,{room.username}</div>;
}
