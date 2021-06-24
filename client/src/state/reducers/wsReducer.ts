import { ActionEnum } from '../action-enum';

const wsReducer = (state: any = { serverSocket: "", isLogged: false }, action: any) => {
  console.log("in the reducer!!");
  
  switch (action.type) {
    case ActionEnum.NEW_WS:
      state.serverSocket = action.payload;
      break;
    case ActionEnum.SET_IS_LOGGED:
      state.isLogged = action.payload;
      break;
    default:
      return state;
  }
  return {...state}
};

export default wsReducer;

