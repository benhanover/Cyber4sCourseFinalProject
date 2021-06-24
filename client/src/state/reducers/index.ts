import { combineReducers } from 'redux';
import wsReducer from './wsReducer';
import roomsReducer from './roomsReducer';

const reducers = combineReducers({
  ws: wsReducer,
  rooms: roomsReducer
});

export default reducers;

export type State = ReturnType<typeof reducers>;
