import { h, createContext } from 'preact';
import { useReducer, useContext, useMemo } from 'preact/hooks';
import { roomReducer, initState } from './roomReducer';
const RoomContext = createContext();

function useRoomContext() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used with RoomProvider');
  }

  const [state, dispatch] = context;

  return {
    state,
    dispatch,
  };
}

function RoomProvider(props) {
  const [state, dispatch] = useReducer(roomReducer, initState);
  const value = useMemo(() => [state, dispatch], [state]);
  return <RoomContext.Provider value={value} {...props} />;
}

export { useRoomContext, RoomProvider };
