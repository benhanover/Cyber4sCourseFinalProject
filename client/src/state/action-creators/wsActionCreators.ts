import { Dispatch } from "react";
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
  