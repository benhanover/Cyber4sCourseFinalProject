import { ActionEnum } from '../action-enum/index';

interface IncreaseAction {
  type: ActionEnum.INCREASE;
  payload: number;
}

interface DecreaseAction {
  type: ActionEnum.DECREASE;
  payload: number;
}

export type RoomCountAction = IncreaseAction | DecreaseAction;
