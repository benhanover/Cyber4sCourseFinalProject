import { RoomCountAction } from '../actions/roomCountActions';

const reducer = (state: number = 0, action: RoomCountAction) => {
  switch (action.type) {
    case 'increase':
      return state + action.payload;
      break;
    case 'decrease':
      return state - action.payload;
      break;
    default:
      return state;
  }
};

export default reducer;
