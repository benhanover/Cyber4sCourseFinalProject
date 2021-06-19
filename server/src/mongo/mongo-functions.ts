// import libraries
import mongoose, { Model, Document } from 'mongoose';

// import models
import { User, Room } from './models';

// import intefaces
import { Iuser, Iroom, IreturnInfo } from '../interfaces/index';
import { errorEnums } from '../enums';

import { getModel } from './assistance-functions';

// src/controllers/userControllers
export const canRegister = async (
  email: string,
  username: string
): Promise<IreturnInfo> => {
  try {
    const users: Array<Iuser> = await User.find({
      $or: [{ email }, { username }],
    });
    console.log('1');
    console.log(users);

    let returnObjCaseExist;
    users.find((user) => {
      if (user.email === email) {
        returnObjCaseExist = { return: false, message: 'Email Already Exist' };
      } else if (user.username === username) {
        returnObjCaseExist = {
          return: false,
          message: 'Username Already Exist',
        };
      }
    });
    console.log('2');
    if (returnObjCaseExist) {
      return returnObjCaseExist;
    }
    console.log('3');
    return { return: true };
  } catch (e) {
    console.log('4');

    return { return: false, message: e.message };
  }
};

// src/controllers/userControllers
export const registerUser = async (user: Iuser): Promise<Boolean> => {
  try {
    User.create(user);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// src/controllers/roomControllers
export const saveRoom = async (room: Iroom) => {
  try {
    Room.create(room);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getRooms = async () => {
  try {
    const rooms = await Room.find();
    return rooms;
  } catch (e) {
    console.log(errorEnums.UNREACHABLE_DB + e.message);
    return [];
  }
};

// finds a document by model and fiel
export const findDocument = async (
  modelString: string,
  field: string,
  fieldContent: any
): Promise<IreturnInfo | Iuser | Iroom> => {
  const model: typeof Model | undefined = getModel(modelString);
  if (!model) {
    console.log('No Model Enum Entered to findOne Function');
    return {
      return: false,
      message: 'Missing parameter line 68 ,mongo-functions',
    };
  }
  try {
    const foundDocument: Iuser | null = await model.findOne({
      [field]: fieldContent,
    });
    console.log('found Document: ', foundDocument);

    return foundDocument
      ? foundDocument
      : { return: false, message: modelString + errorEnums.NOT_FOUND };
  } catch (e) {
    console.log(e, 'Inside findeOne Function');
    return { return: false, message: errorEnums.UNREACHABLE_DB + e };
  }
};
