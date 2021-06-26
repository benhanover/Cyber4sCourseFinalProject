import { ActionEnum } from '../action-enum';

const wsReducer = (state: any = { serverSocket: "", user: false, chosenRoom: null }, action: any) => {
  
  
  switch (action.type) {
    case ActionEnum.NEW_WS:
      state.serverSocket = action.payload;
      break;
    case ActionEnum.SET_IS_LOGGED:
      
      state.user = action.payload;
      break;
    case "chooseRoom":
      state.chosenRoom = action.payload;
      break;
    default:
      return state;
  }
  return {...state}
};

export default wsReducer;

