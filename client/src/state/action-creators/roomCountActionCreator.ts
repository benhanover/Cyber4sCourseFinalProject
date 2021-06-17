import { ActionEnum } from '../action-enum';
import { Dispatch } from 'redux';
import { RoomCountAction } from '../action-types/roomCountActions';

export const increase = (amount: number) => {
  return (dispatch: Dispatch<RoomCountAction>) => {
    dispatch({
      type: ActionEnum.INCREASE,
      payload: amount,
    });
  };
};

export const decrease = (amount: number) => {
  return (dispatch: Dispatch<RoomCountAction>) => {
    dispatch({
      type: ActionEnum.DECREASE,
      payload: amount,
    });
  };
};
