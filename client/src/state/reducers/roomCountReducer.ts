import { RoomCountAction } from '../action-types/roomCountActions';

const reducer = (state: number = 0, action: RoomCountAction) => {
  switch (action.type) {
    case 'increase':
      return state + action.payload;
    case 'decrease':
      return state - action.payload;
    default:
      return state;
  }
};

export default reducer;
