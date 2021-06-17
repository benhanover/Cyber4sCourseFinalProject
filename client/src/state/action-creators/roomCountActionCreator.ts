import { ActionType } from '../action-types';
import { Dispatch } from 'redux';
import { RoomCountAction } from '../actions/roomCountActions';

export const increase = (amount: number) => {
  return (dispatch: Dispatch<RoomCountAction>) => {
    dispatch({
      type: ActionType.INCREASE,
      payload: amount,
    });
  };
};

export const decrease = (amount: number) => {
  return (dispatch: Dispatch<RoomCountAction>) => {
    dispatch({
      type: ActionType.DECREASE,
      payload: amount,
    });
  };
};
