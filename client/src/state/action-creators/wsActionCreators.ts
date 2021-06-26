import { Dispatch } from "react";
import { Iroom } from "../../components/Lobby/interfaces";
import { ActionEnum } from "../action-enum";



export const setWS = (ws: any) => {
    return (dispatch: Dispatch<any>) => {
      dispatch({
        type: ActionEnum.NEW_WS,
        payload: ws,
      });
    };
  };

export const setUser = (user: any) => {
  return (dispatch: Dispatch<any>) => {
    dispatch({
      type: ActionEnum.SET_IS_LOGGED,
      payload: user
    });
  };
};
  
export const setChosenRoom = (room: Iroom | null) => {
  return (dispatch: Dispatch<any>)=>{
      dispatch({
          type: "chooseRoom" , 
          payload:room
      })
  }
}

