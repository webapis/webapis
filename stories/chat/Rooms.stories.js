/** @jsx h */
import { h } from 'preact';
import { RoomsContainer } from '../../client/chat/room/RoomsContainer';
import { RoomList } from '../../client/chat/room/RoomList';
export default {
  title: 'Chat',
};

export const RoomSmallDevice = () => (
  <RoomsContainer
    rooms={[{ name: 'room-one' }]}
    height={'90vh'}
    width={'100%'}
  />
);

RoomSmallDevice.story = {
  name: 'Small Rooms',
};

export const Desktop = () => (
  <RoomsContainer
    height={300}
    width={250}
    rooms={[{ name: 'room-one' }, { name: 'room-two' }, { name: 'room-three' }]}
  />
);

Desktop.story = {
  name: 'Desktop Rooms',
};

export const RoomListSmallDevice = () => (
  <RoomList
    rooms={[{ name: 'room-one' }, { name: 'room-two' }, { name: 'room-three' }]}
  />
);
