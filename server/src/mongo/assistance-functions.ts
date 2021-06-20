// import models
import { User, Room } from './models';
import {Model} from 'mongoose'
/*---------------------------------------------------------------------------------------------------------- */
//  gets a model by given string
export function getModel(modelEnum: string): typeof Model | undefined {
  switch (modelEnum) {
    case 'User':
      return User;
    case 'Room':
      return Room;
    default:
      return undefined;
  }
}
