import { combineReducers } from 'redux';
import wsReducer from './wsReducer';

const reducers = combineReducers({
  ws: wsReducer
});

export default reducers;

export type State = ReturnType<typeof reducers>;
