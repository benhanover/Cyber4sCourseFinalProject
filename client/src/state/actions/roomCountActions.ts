import { ActionType } from '../action-types/index';

interface IncreaseAction {
  type: ActionType.INCREASE;
  payload: number;
}

interface DecreaseAction {
  type: ActionType.DECREASE;
  payload: number;
}

export type RoomCountAction = IncreaseAction | DecreaseAction;
