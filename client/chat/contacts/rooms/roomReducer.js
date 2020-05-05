import actionTypes from './actionTypes';

export const initState = { rooms: [] };

export function roomReducer(state, action) {
  switch (action.type) {
    case actionTypes.OPEN_ROOM:
      return { ...state, rooms: [...state.rooms, action.room] };
    case actionTypes.CLOSE_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter(r.username !== action.room.username),
      };
    default:
      return state;
  }
}
