import { h } from 'preact';
import { useRoomContext } from './room-context';
import { TextChat } from '../text-chat/TextChat';
import { Position } from '../../../layout/Position';
export default function Rooms({ id }) {
  const { state, dispatch } = useRoomContext();
  const { rooms } = state;
  return (
    <Position>
      <div data-testid='rooms'>
        {rooms &&
          rooms.length > 0 &&
          rooms.map((r) => {
            return <Room room={r} />;
          })}
      </div>
    </Position>
  );
}

export function Room({ room }) {
  return (
    <div data-testid='room'>
      <TextChat room={room} />
    </div>
  );
}
