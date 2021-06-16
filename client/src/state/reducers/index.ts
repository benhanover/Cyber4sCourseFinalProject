import { combineReducers } from 'redux';
import roomCountReducer from './roomCountReducer';

const reducers = combineReducers({
  roomCount: roomCountReducer,
});

export default reducers;

export type State = ReturnType<typeof reducers>;
