// import models

import { User, Room } from "./models";

export function getModel(modelEnum: string){
  switch (modelEnum) {
    case 'User':
      return User;
    case 'Room':
      return Room;
    default:
      return undefined;
      break;
  }
}